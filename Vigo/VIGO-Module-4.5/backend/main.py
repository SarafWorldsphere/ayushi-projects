from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import engine, get_db
import models

# FIX: Removed Base.metadata.create_all(bind=engine) 
# This prevents accidentally creating unmanaged tables in the shared live database.

app = FastAPI(title="NFDS Module 4.5 - Operations Monitoring API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# FIX: Removed the startup seed_data() function completely. 
# We are no longer inserting fake dummy data into the database (Fixes Error O2).

@app.get("/api/module45/overview")
def get_ops_overview(db: Session = Depends(get_db)):
    # FIX: Compute actual metrics from vgf_orders instead of returning constants (Fixes Error O1)
    in_progress = db.query(models.VGFOrder).filter(
        models.VGFOrder.status.in_(["ORDERED", "PREPARING", "OUT_FOR_DELIVERY"])
    ).count()
    
    cancelled = db.query(models.VGFOrder).filter(
        models.VGFOrder.status == "CANCELLED"
    ).count()

    # Returning 0 for complex metrics temporarily until related tables/logic are finalized
    return {
        "orders_in_progress": in_progress,
        "orders_delayed": 0,
        "avg_prep_time_mins": 0,
        "avg_delivery_time_mins": 0,
        "cancelled_today": cancelled,
        "sla_breaches": 0,
        "active_riders_online": 0,
    }

@app.get("/api/module45/live-orders")
def get_live_orders(db: Session = Depends(get_db)):
    # FIX: Read active orders directly from the canonical vgf_orders table (Fixes Error O2)
    return (
        db.query(models.VGFOrder)
        .filter(models.VGFOrder.status.in_(["ORDERED", "PREPARING", "OUT_FOR_DELIVERY"]))
        .order_by(models.VGFOrder.created_at.desc())
        .all()
    )