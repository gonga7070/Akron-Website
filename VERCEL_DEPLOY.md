# Deploying Akron Digital to Vercel

This project is configured to deploy on Vercel with **zero code changes** to the app itself.
The React frontend is served from Vercel's static edge and the FastAPI backend runs as a
Python serverless function under `/api/*`.

---

## 1. What's in this repo

```
/
├── vercel.json           ← Vercel build & routing config
├── api/
│   ├── index.py          ← ASGI entry that imports the existing FastAPI app
│   └── requirements.txt  ← Python deps installed on Vercel
├── backend/
│   └── server.py         ← unchanged app (imported by api/index.py)
├── frontend/             ← unchanged React app (built with CRA)
│   └── public/
│       ├── skyforge/     ← static SkyForge site (served at /skyforge/)
│       ├── carter/       ← static Carter Electric site (served at /carter/)
│       └── portfolio/    ← hero screenshots
└── requirements.txt      ← used locally, not by Vercel
```

Vercel automatically routes everything under `/api/*` to the Python function and
everything else to the built CRA output (`frontend/build`).

---

## 2. One-time setup before you deploy

You need three things: a Vercel account, a MongoDB Atlas cluster (free), and your
existing Emergent LLM key.

### a. MongoDB Atlas (free)
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a **free M0 cluster** (any region close to your Vercel region)
3. Database Access → add a user (remember password)
4. Network Access → **Allow access from anywhere** (`0.0.0.0/0`) so Vercel can connect
5. Connect → Drivers → copy the connection string, e.g.
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### b. Push the repo to GitHub
```bash
cd /app
git init
git add .
git commit -m "Initial Akron Digital"
gh repo create akron-digital --private --source=. --push
# or push manually to a GitHub repo you create
```

### c. Import into Vercel
1. Go to https://vercel.com/new
2. Import the GitHub repo you just created
3. When Vercel asks for the **Root Directory**, **leave it as `./`** (the repo root)
4. Framework Preset → **Other** (Vercel will use the `buildCommand` from `vercel.json`)
5. Don't hit deploy yet — first add environment variables (next step)

---

## 3. Environment variables (Vercel → Project → Settings → Environment Variables)

Add all of these for **Production, Preview, and Development**:

| Key | Value | Notes |
|---|---|---|
| `MONGO_URL` | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority` | from Atlas step above |
| `DB_NAME` | `akron_digital` | any name you like |
| `EMERGENT_LLM_KEY` | `sk-emergent-47bD4E1Cd393e1334A` | your existing key |
| `CORS_ORIGINS` | `*` | fine to leave as is |
| `NOTIFICATION_EMAIL` | `Goncaloc007@gmail.com` | already unused (form uses mailto), but keep set |
| `SENDER_EMAIL` | `onboarding@resend.dev` | leave as is |
| `RESEND_API_KEY` | *(leave empty)* | not needed — form uses Gmail compose |
| `REACT_APP_BACKEND_URL` | *(leave empty string)* | tells the frontend to call same-origin `/api` |

> ⚠️ For `REACT_APP_BACKEND_URL` on Vercel, set the value to an **empty string** (or omit
> the variable). Do NOT put your Vercel URL there — the frontend uses relative
> `/api/...` paths automatically when this is empty.

Hit **Deploy**. First build takes ~3 minutes.

---

## 4. After first deploy

1. Open the Vercel URL (e.g. `https://akron-digital.vercel.app`)
2. Test:
   - Homepage loads with hero, packs, calculator, portfolio previews
   - `/skyforge/` and `/carter/` load the live-preview builds
   - Click the AI chatbot bubble → send a test message → you should get a reply
   - Click Send Message on the Start-a-Project section → Gmail opens pre-filled

3. Point your custom domain (Vercel → Domains → add `akrondigital.com`)

---

## 5. Common Vercel gotchas

- **First cold start on the API is slow (2–4s)** because it imports FastAPI +
  litellm. Subsequent requests are fast. This is normal for serverless Python.
- **Function size limit**: Vercel Hobby caps unzipped functions at 250MB. Our deps
  fit comfortably (~90MB) but if you add heavy libs later, watch that limit.
- **Timeouts**: the chat function has `maxDuration: 60` in `vercel.json`. Hobby
  plan max is 10s; Pro plan supports 60s. If you're on Hobby and chats time out,
  either upgrade or reduce the model's `max_tokens`.
- **Environment variable changes** require a redeploy (Vercel → Deployments →
  ⋯ → Redeploy).

---

## 6. Running locally (unchanged)

Nothing about local dev changes:
```bash
# backend
cd backend && uvicorn server:app --reload --port 8001

# frontend
cd frontend && yarn install && yarn start
```

Local uses `frontend/.env` and `backend/.env` as before.
