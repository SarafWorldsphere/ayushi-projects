from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base

class VGFOrderMonitoring(Base):
    __tablename__ = "VGF_order_monitoring"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, unique=True, index=True)
    customer_name = Column(String)
    hotel_name = Column(String)
    rider_name = Column(String, nullable=True)
    status = Column(String)  # Placed, Accepted, Preparing, Picked, Delivered
    prep_time_mins = Column(Integer, default=12)
    delivery_time_mins = Column(Integer, default=22)
    created_at = Column(DateTime, default=datetime.utcnow)

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