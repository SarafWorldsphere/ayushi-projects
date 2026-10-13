from database import Base
from sqlalchemy import Boolean, Column, Float, Integer, String, DateTime
from datetime import datetime

# 1. CANONICAL ORDERS TABLE (Fixes Error A2 - allows dynamic aggregation)
class VGFOrder(Base):
    __tablename__ = "vgf_orders"
    
    id = Column(String, primary_key=True, index=True)
    customer_id = Column(String, nullable=True)
    restaurant_id = Column(String, nullable=True)
    rider_id = Column(String, nullable=True)
    status = Column(String, index=True)
    total_amount = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# 2. DYNAMIC CONFIGURATION TABLE (Fixes Error A4 - saves feature toggles)
class VGFFeatureFlagsConfig(Base):
    __tablename__ = "VGF_feature_flags_config"

    id = Column(Integer, primary_key=True, index=True)
    feature_name = Column(String, index=True, nullable=False)
    district = Column(String, nullable=True)
    is_enabled = Column(Boolean, default=False, nullable=False)

# ------------------------------------------------------------------
# Legacy Summary Tables (Kept temporarily to prevent crashes 
# before we update main.py, but they will be phased out)
# ------------------------------------------------------------------
class VGFSalesSummary(Base):
    __tablename__ = "VGF_sales_summary"

    id = Column(Integer, primary_key=True, index=True)
    report_date = Column(String, index=True, nullable=False)
    total_revenue = Column(Float, default=0.0, nullable=False)
    orders_count = Column(Integer, default=0, nullable=False)
    avg_order_value = Column(Float, default=0.0, nullable=False)

class VGFCommissionSummary(Base):
    __tablename__ = "VGF_commission_summary"

    id = Column(Integer, primary_key=True, index=True)
    hotel_commission = Column(Float, default=0.0, nullable=False)
    rider_payouts = Column(Float, default=0.0, nullable=False)
    tds_deducted = Column(Float, default=0.0, nullable=False)