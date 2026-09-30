from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from datetime import datetime
from database import Base

class VGFSalesSummary(Base):
    __tablename__ = "VGF_sales_summary"
    id = Column(Integer, primary_key=True, index=True)
    report_date = Column(String)
    total_revenue = Column(Float)
    orders_count = Column(Integer)
    avg_order_value = Column(Float)

class VGFCommissionSummary(Base):
    __tablename__ = "VGF_commission_summary"
    id = Column(Integer, primary_key=True, index=True)
    hotel_commission = Column(Float)
    rider_payouts = Column(Float)
    tds_deducted = Column(Float)

class VGFFeatureFlagsConfig(Base):
    __tablename__ = "VGF_feature_flags_config"
    id = Column(Integer, primary_key=True, index=True)
    feature_name = Column(String)
    district = Column(String)
    is_enabled = Column(Boolean, default=False)