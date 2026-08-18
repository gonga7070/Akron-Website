"""
Vercel serverless entry point for the Akron Digital FastAPI backend.

Vercel's Python runtime auto-detects an ASGI app exported as `app`
(or `handler`) from this module. All /api/* requests are rewritten
to /api/index (see vercel.json), then FastAPI's own /api-prefixed
routes handle the rest.
"""

import sys
from pathlib import Path

# Make ../backend importable so we can reuse the existing server.py
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "backend"))

from server import app  # noqa: E402,F401  (re-exported for Vercel)
