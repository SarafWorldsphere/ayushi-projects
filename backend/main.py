import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from database import engine, Base
import models
from routers import dashboard, translation, communication, debug, assessments
from startup_check import run_startup_checks
import logging

logging.basicConfig(level=logging.INFO)

# ── Startup table validation ──────────────────────────────────────────────────
# Checks that every table the app actively queries exists in the connected DB.
# On DEMO RDS (DB_TABLE_PREFIX="dem_") this will warn about absent legacy tables
# (e.g. dem_teacher_parent_interaction) without blocking startup, and will raise
# immediately if a *required* table is missing instead of crashing mid-request.

# Create tables (IF NOT EXISTS — safe for both fresh and existing databases)
Base.metadata.create_all(bind=engine)

run_startup_checks(raise_on_error=True)

# Back-fill recipient_name on existing support_tickets tables.
# Fetch the prefix from environment variables, defaulting to "dem_"
db_prefix = os.getenv("DB_TABLE_PREFIX", "dem_")

with engine.connect() as _conn:
    _conn.execute(text(
        f"ALTER TABLE {db_prefix}support_tickets "
        "ADD COLUMN IF NOT EXISTS recipient_name VARCHAR"
    ))
    _conn.commit()

app = FastAPI(title="Parent Dashboard API")

# Configure CORS
# It is best practice to specify the exact origin in production.
# Add FRONTEND_URL=http://<YOUR_EC2_PUBLIC_IP>:7009 to your backend .env file.
# If not provided, it will safely fall back to "*" for testing purposes.
frontend_url = os.getenv("FRONTEND_URL", "*")
allowed_origins = [frontend_url] if frontend_url != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(dashboard.router, tags=["Dashboard"])
app.include_router(translation.router, tags=["Translation"])
app.include_router(communication.router)
app.include_router(debug.router)   # dev-only: GET /debug/seeded-students, /debug/seeded-parents
app.include_router(assessments.router, tags=["Assessments"])

@app.get("/")
def read_root():
    return {"message": "Parent Dashboard API is running"}

# ── EC2 Execution ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    # Binds the application to 0.0.0.0 so it is accessible over the internet
    # and sets the port to 7010 as requested.
    uvicorn.run("main:app", host="0.0.0.0", port=7010, reload=True)