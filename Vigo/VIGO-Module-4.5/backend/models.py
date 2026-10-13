from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base

# 1. NEW CANONICAL MODEL (Fixes Error O2 & X1)
class VGFOrder(Base):
    __tablename__ = "vgf_orders"
    
    id = Column(String, primary_key=True, index=True) # UUIDs stored as strings
    customer_id = Column(String, nullable=True)
    restaurant_id = Column(String, nullable=True)
    rider_id = Column(String, nullable=True)
    status = Column(String, index=True)  # e.g., ORDERED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
    total_amount = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# ------------------------------------------------------------------
# NOTE: The tables below are from the old 'VGF_* monitoring' family. 
# As per Error X1 and O3, these will eventually be phased out or 
# labeled as sample data. We are leaving them here temporarily 
# so your app doesn't crash before we update main.py.
# ------------------------------------------------------------------

class VGFSlaBreach(Base):
    __tablename__ = "VGF_sla_breaches"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String)
    breach_type = Column(String)  # Prep Delay, Delivery Delay
    excess_time_mins = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

class VGFDelayAlert(Base):
    __tablename__ = "VGF_delay_alerts"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String)
    alert_level = Column(String)  # Warning, Critical
    message = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class VGFRiderLiveLocation(Base):
    __tablename__ = "VGF_rider_live_locations"
    id = Column(Integer, primary_key=True, index=True)
    rider_name = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    status = Column(String)  # Online, Busy, Idle