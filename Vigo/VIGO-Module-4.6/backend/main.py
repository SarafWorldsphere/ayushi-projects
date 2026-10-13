from database import engine, get_db
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
import models

# FIX: Removed Base.metadata.create_all(bind=engine) to prevent unauthorized table creation

app = FastAPI(title="Module 4.6 API")

# Add CORS so the frontend can connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define Pydantic models for the Feature Flags API
class FeatureFlagUpdate(BaseModel):
    is_enabled: bool

# FIX Error A1: Added /api/module46 prefix to all routes

@app.get("/api/module46/reports-summary")
def get_reports_summary(db: Session = Depends(get_db)):
    # FIX Error A2: Calculate metrics from real vgf_orders instead of returning fallback constants
    total_revenue = db.query(func.sum(models.VGFOrder.total_amount)).filter(models.VGFOrder.status == 'DELIVERED').scalar() or 0
    orders_count = db.query(models.VGFOrder).filter(models.VGFOrder.status == 'DELIVERED').count()
    
    avg_order_value = 0
    if orders_count > 0:
        avg_order_value = total_revenue / orders_count

    # Returning 0 temporarily for commission logic until those tables are migrated
    return {
        "total_revenue": total_revenue,
        "orders_this_month": orders_count,
        "avg_order_value": avg_order_value,
        "hotel_commission_earned": 0,
        "rider_payouts": 0,
        "tds_deducted": 0,
    }

@app.get("/api/module46/chart-data")
def get_chart_data(db: Session = Depends(get_db)):
    # FIX Error A2: Replaced the fake hardcoded month/revenue list. 
    # Returning an empty list for now until date-based SQL grouping is fully implemented for the chart.
    return []

# FIX Error A4: New endpoints to Load and Save Feature Flags
@app.get("/api/module46/feature-flags")
def get_feature_flags(db: Session = Depends(get_db)):
    flags = db.query(models.VGFFeatureFlagsConfig).all()
    return [{"id": f.id, "feature_name": f.feature_name, "is_enabled": f.is_enabled, "district": f.district} for f in flags]

@app.put("/api/module46/feature-flags/{flag_id}")
def update_feature_flag(flag_id: int, flag_data: FeatureFlagUpdate, db: Session = Depends(get_db)):
    flag = db.query(models.VGFFeatureFlagsConfig).filter(models.VGFFeatureFlagsConfig.id == flag_id).first()
    if flag:
        flag.is_enabled = flag_data.is_enabled
        db.commit()
        return {"success": True}
    return {"error": "Flag not found"}, 404