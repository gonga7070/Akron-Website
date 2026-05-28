"""Backend tests for Akron Digital API."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://akron-digital.preview.emergentagent.com").rstrip("/")
# Use frontend env for external URL since same project
# Read from frontend/.env if available
try:
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break
except Exception:
    pass


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ===== Root =====
def test_root_returns_akron_digital(api):
    r = api.get(f"{BASE_URL}/api/", timeout=20)
    assert r.status_code == 200
    data = r.json()
    assert data.get("message") == "Akron Digital API"


# ===== Contact =====
def test_contact_post_stores_and_returns_email_sent_false(api):
    payload = {
        "name": "TEST_Alice",
        "email": "test_alice@example.com",
        "phone": "555-0001",
        "message": "TEST contact message",
        "package": "Standard",
    }
    r = api.post(f"{BASE_URL}/api/contact", json=payload, timeout=20)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body.get("status") == "ok"
    assert body.get("email_sent") is False  # RESEND_API_KEY empty
    assert "id" in body
    # validate uuid form
    uuid.UUID(body["id"])


def test_contact_post_invalid_email_returns_422(api):
    payload = {
        "name": "TEST_Bad",
        "email": "not-an-email",
        "message": "msg",
    }
    r = api.post(f"{BASE_URL}/api/contact", json=payload, timeout=20)
    assert r.status_code == 422


def test_contact_post_missing_required_field(api):
    # missing message
    payload = {"name": "TEST_Missing", "email": "x@y.com"}
    r = api.post(f"{BASE_URL}/api/contact", json=payload, timeout=20)
    assert r.status_code == 422


def test_contact_get_list_sorted_desc(api):
    # Insert two records
    e1 = f"test_first_{uuid.uuid4().hex[:6]}@example.com"
    e2 = f"test_second_{uuid.uuid4().hex[:6]}@example.com"
    api.post(f"{BASE_URL}/api/contact", json={"name": "TEST_First", "email": e1, "message": "first"}, timeout=20)
    time.sleep(1)
    api.post(f"{BASE_URL}/api/contact", json={"name": "TEST_Second", "email": e2, "message": "second"}, timeout=20)

    r = api.get(f"{BASE_URL}/api/contact", timeout=20)
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    assert len(items) >= 2
    # Find positions
    emails = [it["email"] for it in items]
    assert e2 in emails and e1 in emails
    assert emails.index(e2) < emails.index(e1), "Sorted descending by created_at expected (second before first)"
    # Ensure no _id leak
    for it in items[:5]:
        assert "_id" not in it


# ===== Chat =====
@pytest.fixture(scope="module")
def chat_session_id():
    return f"TEST_{uuid.uuid4().hex[:10]}"


def test_chat_post_returns_reply(api, chat_session_id):
    payload = {
        "session_id": chat_session_id,
        "message": "What does the Premium pack cost and what's included?",
    }
    r = api.post(f"{BASE_URL}/api/chat", json=payload, timeout=90)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["session_id"] == chat_session_id
    assert isinstance(data["reply"], str)
    assert len(data["reply"]) > 10
    # Should mention $799 or Premium
    low = data["reply"].lower()
    assert ("799" in low) or ("premium" in low), f"Expected reply to reference Premium/$799: {data['reply']}"


def test_chat_history_persisted(api, chat_session_id):
    # First send a message in case prior didn't run
    r = api.get(f"{BASE_URL}/api/chat/{chat_session_id}", timeout=20)
    assert r.status_code == 200
    msgs = r.json()
    assert isinstance(msgs, list)
    assert len(msgs) >= 2  # user + assistant
    roles = [m["role"] for m in msgs]
    assert "user" in roles and "assistant" in roles
    # chronological: created_at non-decreasing
    timestamps = [m["created_at"] for m in msgs]
    assert timestamps == sorted(timestamps)
    for m in msgs:
        assert "_id" not in m
