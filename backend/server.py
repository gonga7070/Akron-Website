from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

import resend
from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB (optional at import time — endpoints handle missing gracefully)
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=3000)
db = client[os.environ.get('DB_NAME', 'akron_digital')]

# Resend
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '').strip()
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
NOTIFICATION_EMAIL = os.environ.get('NOTIFICATION_EMAIL', 'goncaloc007@gmail.com')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Emergent LLM
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ===== Models =====
class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    message: Optional[str] = ""
    package: Optional[str] = ""
    business_name: Optional[str] = ""
    has_website: Optional[str] = ""


class ContactRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str = ""
    message: str
    package: str = ""
    business_name: str = ""
    has_website: str = ""
    email_sent: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatResponse(BaseModel):
    session_id: str
    reply: str


# ===== Chatbot system message =====
AKRON_SYSTEM_MESSAGE = """You're the assistant for Akron Digital — a small web design studio in the GTA, Ontario. You answer visitor questions. That's your only job.

Rules:
- Keep replies short. 1–2 sentences unless the question really needs more.
- Sound like a person, not a brochure. No corporate tone, no emojis, no filler phrases like "Great question!" or "I'd be happy to."
- Only answer using the facts below. Do not make anything up.
- If a question is outside what you know, or if the visitor wants a quote, a timeline, a custom feature, or anything specific to their project — say you can't answer that and tell them to text or call 647-745-5082.
- Never suggest email. Always point to text or call at 647-745-5082.

Facts you can use:

What we do: modern websites for service-based businesses (contractors, salons, clinics, consultants, etc.) in the GTA, Ontario.

Pricing:
- Standard
  * Own it: $999 one-time + $99/month maintenance. You own the site and domain.
  * Lease it: $199/month, no upfront. We host the site and hold the domain. Maintenance included.
- Premium
  * Own it: $2,999 one-time + $99/month maintenance. You own the site and domain.
  * Lease it: $499/month, no upfront. We host + hold the domain. Maintenance included.

What's in each pack:
- Standard: one-page website with services, work photos, reviews, contact info, contact form, mobile-friendly.
- Premium: home, services, our work, about, contact pages. Custom design, portfolio, reviews, contact form, mobile-friendly, basic SEO, AI chat, live Google reviews, analytics.

Maintenance covers updates, security, backups, and support.

If they ask anything you don't have facts for — "how long does it take", "can you build X feature", "do you do e-commerce", "will it work with my current site" — reply:
"That one's better answered by Goncalo directly. Text or call 647-745-5082."
"""


# ===== Email helper =====
async def send_contact_email(record: ContactRecord) -> bool:
    if not RESEND_API_KEY:
        logger.info("RESEND_API_KEY not set — skipping email send. Stored in DB.")
        return False
    try:
        rows = [
            ("Name", record.name or "-"),
            ("Business", record.business_name or "-"),
            ("Already has a website", record.has_website or "-"),
            ("Email", record.email or "-"),
            ("Phone", record.phone or "-"),
            ("Interested in", record.package or "-"),
        ]
        row_html = "".join(
            f"""<tr>
              <td style="padding:14px 18px;color:#6b7280;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;width:200px;border-bottom:1px solid #1f2937;vertical-align:top">{label}</td>
              <td style="padding:14px 18px;color:#f9fafb;font-size:15px;border-bottom:1px solid #1f2937">{val}</td>
            </tr>"""
            for label, val in rows
        )
        message_block = (
            f"""<div style="margin-top:28px">
              <div style="color:#6b7280;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px">Message</div>
              <div style="color:#f9fafb;font-size:15px;line-height:1.6;white-space:pre-wrap;background:#0a0a0a;padding:18px;border:1px solid #1f2937;border-radius:4px">{record.message}</div>
            </div>"""
            if record.message
            else ""
        )
        subject_label = record.business_name or record.name or "New lead"
        html = f"""
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#050505;padding:32px;color:#fff;max-width:640px;margin:0 auto">
          <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#3b82f6;margin-bottom:8px">Akron Digital · Website Form</div>
          <h1 style="font-size:26px;font-weight:700;margin:0 0 6px 0;color:#fff">New project enquiry</h1>
          <div style="color:#9ca3af;font-size:14px;margin-bottom:28px">{subject_label}</div>
          <table cellpadding="0" cellspacing="0" style="width:100%;background:#0c0c0d;border:1px solid #1f2937;border-radius:4px;border-collapse:collapse">
            {row_html}
          </table>
          {message_block}
          <div style="margin-top:32px;padding-top:20px;border-top:1px solid #1f2937;color:#52525b;font-size:12px">
            Submitted {record.created_at} · Reply directly to this email to contact {record.name}.
          </div>
        </div>
        """
        params = {
            "from": SENDER_EMAIL,
            "to": [NOTIFICATION_EMAIL],
            "reply_to": record.email,
            "subject": f"Website Form — {subject_label}",
            "html": html,
        }
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent: {result}")
        return True
    except Exception as e:
        logger.error(f"Failed to send Resend email: {e}")
        return False


# ===== Routes =====
@api_router.get("/")
async def root():
    return {"message": "Akron Digital API"}


@api_router.post("/contact")
async def submit_contact(payload: ContactRequest):
    record = ContactRecord(
        name=payload.name.strip(),
        email=payload.email,
        phone=(payload.phone or "").strip(),
        message=(payload.message or "").strip(),
        package=(payload.package or "").strip(),
        business_name=(payload.business_name or "").strip(),
        has_website=(payload.has_website or "").strip(),
    )
    sent = await send_contact_email(record)
    record.email_sent = sent
    await db.contacts.insert_one(record.model_dump())
    return {"status": "ok", "email_sent": sent, "id": record.id}


@api_router.get("/contact", response_model=List[ContactRecord])
async def list_contacts():
    docs = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api_router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")
    session_id = payload.session_id or str(uuid.uuid4())

    # DB history is nice-to-have. Never let it block the LLM response.
    try:
        await db.chat_messages.find(
            {"session_id": session_id}, {"_id": 0}
        ).sort("created_at", 1).to_list(40)
    except Exception as db_err:
        logger.warning(f"Chat history read failed (continuing): {db_err}")

    try:
        chat_client = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=AKRON_SYSTEM_MESSAGE,
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")

        user_msg = UserMessage(text=payload.message)
        reply_text = await chat_client.send_message(user_msg)
    except Exception as llm_err:
        logger.exception("LLM call failed")
        raise HTTPException(status_code=502, detail=f"LLM error: {llm_err}")

    # Fire-and-forget persistence
    try:
        now = datetime.now(timezone.utc).isoformat()
        await db.chat_messages.insert_many([
            {"session_id": session_id, "role": "user", "text": payload.message, "created_at": now},
            {"session_id": session_id, "role": "assistant", "text": str(reply_text), "created_at": now},
        ])
    except Exception as db_err:
        logger.warning(f"Chat history write failed (continuing): {db_err}")

    return ChatResponse(session_id=session_id, reply=str(reply_text))


@api_router.get("/chat/{session_id}")
async def chat_history(session_id: str):
    msgs = await db.chat_messages.find(
        {"session_id": session_id}, {"_id": 0}
    ).sort("created_at", 1).to_list(200)
    return msgs


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
