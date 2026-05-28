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

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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
    message: str
    package: Optional[str] = ""


class ContactRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str = ""
    message: str
    package: str = ""
    email_sent: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatResponse(BaseModel):
    session_id: str
    reply: str


# ===== Chatbot system message =====
AKRON_SYSTEM_MESSAGE = """You're the assistant for Akron Digital — a small web design studio in the GTA, Ontario run by Goncalo. You help people decide if we're a fit and answer their questions. That's it.

How to talk:
- Short. 1–3 sentences usually. Skip the corporate tone.
- Sound like a thoughtful person, not a brochure. No bullet lists unless they actually ask "what do I get."
- Don't dump every feature. Answer what was asked. If they want more, they'll ask.
- No emojis. No "Great question!" No "I'd be happy to."
- If they ask something off-topic, answer briefly and steer back gently.
- If they're ready to talk or have a real project, point them to Goncalo:
  Email: Goncalo@akrondigital.com · Phone: 647-745-5082
- Never invent prices or features. Only use what's below.

What we do: Modern websites for service-based businesses (contractors, salons, clinics, consultants, etc.).

Packages (only mention details if asked):
- Standard — $299, one-time. A clean one-pager.
- Premium — $799, one-time. Multi-page site, custom design, basic SEO.
- Monthly Care — $75/month. Updates, backups, security, AI chat, Google reviews, analytics, priority support.

If asked "how long does it take", "do you do custom work", "what about hosting" etc — answer briefly and honestly, and if it's something only Goncalo should commit to, say so and share his contact.

When someone asks about getting a website built / made / designed (or seems ready to start a project), naturally ask two things before going deep:
1. What's the business name?
2. Do you already have a website? (yes/no)

Ask both casually in one short message, not as a stiff form. Once they answer, give a quick recommendation and point them to Goncalo or the contact form.
"""


# ===== Email helper =====
async def send_contact_email(record: ContactRecord) -> bool:
    if not RESEND_API_KEY:
        logger.info("RESEND_API_KEY not set — skipping email send. Stored in DB.")
        return False
    try:
        html = f"""
        <table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;background:#0a0a0a;color:#fff;padding:24px">
          <tr><td>
            <h2 style="margin:0 0 16px 0;color:#fff;font-size:22px">New lead — Akron Digital</h2>
            <p style="color:#a1a1aa;margin:0 0 24px 0">A new contact form was submitted on akrondigital.com</p>
            <table cellpadding="8" cellspacing="0" style="background:#111;border:1px solid #27272a;border-radius:6px;width:100%">
              <tr><td style="color:#a1a1aa;width:120px">Name</td><td style="color:#fff">{record.name}</td></tr>
              <tr><td style="color:#a1a1aa">Email</td><td style="color:#fff">{record.email}</td></tr>
              <tr><td style="color:#a1a1aa">Phone</td><td style="color:#fff">{record.phone or '-'}</td></tr>
              <tr><td style="color:#a1a1aa">Package</td><td style="color:#fff">{record.package or '-'}</td></tr>
              <tr><td style="color:#a1a1aa;vertical-align:top">Message</td><td style="color:#fff;white-space:pre-wrap">{record.message}</td></tr>
            </table>
            <p style="color:#52525b;margin-top:24px;font-size:12px">Submitted {record.created_at}</p>
          </td></tr>
        </table>
        """
        params = {
            "from": SENDER_EMAIL,
            "to": [NOTIFICATION_EMAIL],
            "reply_to": record.email,
            "subject": f"New Akron Digital lead — {record.name}",
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
        message=payload.message.strip(),
        package=(payload.package or "").strip(),
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
    try:
        # Load recent history (last 20 turns) for context
        history_docs = await db.chat_messages.find(
            {"session_id": session_id}, {"_id": 0}
        ).sort("created_at", 1).to_list(40)

        chat_client = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=AKRON_SYSTEM_MESSAGE,
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")

        # Replay prior turns so the model has continuity (LlmChat sessionizes via session_id but we also rely on history docs for our own UI)
        # Send user message
        user_msg = UserMessage(text=payload.message)
        reply_text = await chat_client.send_message(user_msg)

        now = datetime.now(timezone.utc).isoformat()
        await db.chat_messages.insert_many([
            {"session_id": session_id, "role": "user", "text": payload.message, "created_at": now},
            {"session_id": session_id, "role": "assistant", "text": str(reply_text), "created_at": now},
        ])
        return ChatResponse(session_id=session_id, reply=str(reply_text))
    except Exception as e:
        logger.exception("Chat error")
        raise HTTPException(status_code=500, detail=f"Chat failed: {e}")


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
