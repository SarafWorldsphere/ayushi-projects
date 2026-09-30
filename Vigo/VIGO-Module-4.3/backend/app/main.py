"""SWAIS standard FastAPI entry point.

Module path is always `app.main:app` — pm2/uvicorn/Nginx all assume this.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import (
    example,
    customers,
    payments,
    orders,
    tracking,
    offers,
    feedback,
)

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    """Required by SWAIS standards — the monitoring cron curls this."""
    return {"status": "ok", "app": settings.app_name}


# Routes are registered WITHOUT the role prefix (/students, not /api/<role>/students).
# Nginx strips /api/<role>/ before forwarding — backends stay proxy-agnostic.
app.include_router(example.router)
app.include_router(customers.router)
app.include_router(payments.router)
app.include_router(orders.router)
app.include_router(tracking.router)
app.include_router(offers.router)
app.include_router(feedback.router)