from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.sql import func
from database import Base

# Standard table args for pre-existing tables
TABLE_ARGS = {"extend_existing": True}
# If using a custom schema in pgAdmin (e.g., 'nfd'), use:
# TABLE_ARGS = {"schema": "nfd", "extend_existing": True}


# --- CORE USER & ROLE ENTITIES ---
class NFDUser(Base):
    __tablename__ = "nfd_users"
    __table_args__ = TABLE_ARGS

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    role = Column(String(50), default="rider")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class NFDRole(Base):
    __tablename__ = "nfd_roles"
    __table_args__ = TABLE_ARGS

    id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String(50), unique=True, nullable=False)
    permissions = Column(Text, nullable=True)


# --- CUSTOMER & HOTEL ENTITIES ---
class NFDCustomer(Base):
    __tablename__ = "nfd_customers"
    __table_args__ = TABLE_ARGS

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    phone = Column(String(20), unique=True, nullable=False)
    email = Column(String(150), nullable=True)


class NFDHotel(Base):
    __tablename__ = "nfd_hotels"
    __table_args__ = TABLE_ARGS

    id = Column(Integer, primary_key=True, index=True)
    hotel_name = Column(String(150), nullable=False)
    owner_name = Column(String(150), nullable=False)
    phone = Column(String(20), nullable=False)
    address = Column(Text, nullable=False)
    commission_rate = Column(Float, default=10.0)


# --- RIDER MASTER & CAPACITY ---
class NFDRider(Base):
    __tablename__ = "nfd_riders"
    __table_args__ = TABLE_ARGS

    id = Column(Integer, primary_key=True, index=True)
    rider_code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    vehicle_number = Column(String(50), nullable=True)
    status = Column(String(20), default="Available")
    current_orders_count = Column(Integer, default=0)


# --- ORDERS & REAL-TIME TRACKING ---
class NFDOrder(Base):
    __tablename__ = "nfd_orders"
    __table_args__ = TABLE_ARGS

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    rider_id = Column(Integer, ForeignKey("nfd_riders.id"), nullable=True)
    hotel_id = Column(Integer, ForeignKey("nfd_hotels.id"), nullable=True)
    customer_name = Column(String(150), nullable=False)
    customer_address = Column(Text, nullable=False)
    delivery_fee = Column(Float, nullable=False)
    status = Column(String(50), default="Assigned")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class NFDOrderTracking(Base):
    __tablename__ = "nfd_order_tracking"
    __table_args__ = TABLE_ARGS

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("nfd_orders.id"), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    status_update = Column(String(100), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


# --- PAYMENTS & PAYOUTS ---
class NFDRiderPayout(Base):
    __tablename__ = "nfd_rider_payouts"
    __table_args__ = TABLE_ARGS

    id = Column(Integer, primary_key=True, index=True)
    rider_id = Column(Integer, ForeignKey("nfd_riders.id"), nullable=False)
    gross_amount = Column(Float, nullable=False)
    tds_deduction = Column(Float, default=0.0)
    net_payable = Column(Float, nullable=False)
    payout_status = Column(String(50), default="Pending")
    payout_date = Column(DateTime(timezone=True), server_default=func.now())


class NFDPayment(Base):
    __tablename__ = "nfd_payments"
    __table_args__ = TABLE_ARGS

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("nfd_orders.id"), nullable=False)
    payment_mode = Column(String(50), default="UPI")
    amount = Column(Float, nullable=False)
    status = Column(String(50), default="Completed")


class NFDFranchise(Base):
    __tablename__ = "nfd_franchises"
    __table_args__ = TABLE_ARGS

    id = Column(Integer, primary_key=True, index=True)
    franchise_name = Column(String(150), nullable=False)
    district = Column(String(100), nullable=False)
    contact_person = Column(String(100), nullable=False)