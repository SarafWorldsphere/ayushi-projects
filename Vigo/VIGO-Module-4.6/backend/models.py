from database import Base
from sqlalchemy import Boolean, Column, Float, Integer, String


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


class VGFFeatureFlagsConfig(Base):
    __tablename__ = "VGF_feature_flags_config"

    id = Column(Integer, primary_key=True, index=True)
    feature_name = Column(String, index=True, nullable=False)
    district = Column(String, nullable=True)
    is_enabled = Column(Boolean, default=False, nullable=False)