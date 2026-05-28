# Akron Digital — Product Requirements Document

## Original Problem Statement
Build a website-design-agency marketing site called **Akron Digital**. Dark, sleek, professional (inspired by https://my-portfolio-887.preview.emergentagent.com/). Colors: mostly black/white with dark-blue accents. Catchy hero quote with striking background. Sections: pricing packs (Standard $299, Premium $799, Monthly Subscription $75), portfolio with 3 placeholder website cards, conversion-rate calculator (default 500 visitors, 5% conversion, $10,000 job price — all editable), AI chatbot widget. Contact: 647-745-5082, Goncalo@akrondigital.com, GTA Ontario.

## Architecture
- **Backend**: FastAPI + MongoDB (motor). Routes under `/api`.
- **Frontend**: React 19 (CRA + craco), Tailwind, single-page anchor navigation.
- **Integrations**:
  - Resend (email contact-form leads to goncaloc007@gmail.com — currently no key set, so emails are skipped but submissions are stored in DB).
  - Emergent Universal LLM Key → Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) via `emergentintegrations.llm.chat.LlmChat` for the AI assistant chatbot.

## Core Requirements (Static)
- Single-page marketing site, anchor scroll between sections.
- Pricing packs match exact prices and feature lists from the brief.
- Calculator math: `clients = round(visitors * conversion% / 100)`, `monthly = clients * jobPrice`, `yearly = monthly * 12`. CAD currency.
- Contact form: name (required), email (required, validated), phone (optional), package (optional, pre-fills when pack CTA clicked), message (required).
- Chatbot: floating bottom-right, persistent session via localStorage, system prompt grounded in Akron Digital pricing/services.

## User Personas
- **Service-based business owner (primary)** — contractor/clinic/salon/consultant looking for a professional website. Wants clear pricing, proof of work, easy contact.
- **Prospective monthly-care client** — already has a site, wants AI chat + reviews + maintenance.

## Implemented (2026-05-28)
- Hero with editorial quote ("Designed in silence. Built to be remembered.")
- Animated marquee strip
- Portfolio: 3 placeholder cards (Lumen & Co., North Atlas, Field Notes) — links intentionally empty (preventDefault).
- Website Packs grid: Standard / Premium (highlighted Popular) / Monthly Care, CTAs pre-fill the contact form.
- Conversion Rate Calculator with live number inputs + sliders.
- About section (4 pillars).
- Contact form → POST /api/contact (stores in DB, attempts Resend email if key set).
- Footer with phone/email/location + giant "AKRON DIGITAL." typography.
- AI Chatbot widget (floating, Claude Sonnet 4.5 via Emergent Universal Key).

## Backend Endpoints
- `GET /api/` — health
- `POST /api/contact` — store + email lead
- `GET /api/contact` — list leads
- `POST /api/chat` — { session_id, message } → Claude reply
- `GET /api/chat/{session_id}` — chat history

## Backlog / Next Tasks
- **P0** — User to add their **Resend API key** to `/app/backend/.env` (`RESEND_API_KEY=re_...`) to activate live email notifications to goncaloc007@gmail.com. Without it, leads are only stored in DB.
- **P1** — Verify a custom domain in Resend (for production sending from `hello@akrondigital.com` instead of `onboarding@resend.dev`).
- **P1** — Replace portfolio placeholder images with real screenshots once the 3 client sites are ready; wire live links.
- **P2** — Admin dashboard route to view contact submissions (currently DB-only).
- **P2** — Rate limiting on `/api/contact` and `/api/chat` (anti-abuse).
- **P2** — Refactor `App.js` (~1250 lines) into `/src/components/{Header,Hero,Portfolio,Packs,Calculator,Contact,Footer,ChatWidget}.jsx`.
- **P2** — Google Analytics / Plausible.
- **P3** — Stripe checkout for instant $299/$799/$75 purchase.
- **P3** — Live Google Reviews embed (advertised in Monthly Care pack).
