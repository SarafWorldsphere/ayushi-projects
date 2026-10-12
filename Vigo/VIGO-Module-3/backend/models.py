import uuid
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.sql import func
from database import Base

TABLE_ARGS = {"extend_existing": True}


# --- CORE USER & ROLE ENTITIES ---
class VGFUser(Base):
    __tablename__ = "vgf_users"
    __table_args__ = TABLE_ARGS

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    role = Column(String(50), default="rider")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class VGFRole(Base):
    __tablename__ = "vgf_roles"
    __table_args__ = TABLE_ARGS

    id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String(50), unique=True, nullable=False)
    permissions = Column(Text, nullable=True)


# --- CUSTOMER & RESTAURANT ENTITIES ---
class VGFCustomer(Base):
    __tablename__ = "vgf_customers"
    __table_args__ = TABLE_ARGS

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(150), nullable=False)
    phone = Column(String(20), unique=True, nullable=False)
    email = Column(String(150), nullable=True)


class VGFRestaurant(Base):
    __tablename__ = "vgf_restaurants"
    __table_args__ = TABLE_ARGS

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    restaurant_name = Column(String(150), nullable=False)
    owner_name = Column(String(150), nullable=False)
    phone = Column(String(20), nullable=False)
    address_line1 = Column(Text, nullable=False)
    address_line2 = Column(Text, nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    postal_code = Column(String(20), nullable=False)
    commission_rate = Column(Float, default=10.0)


# --- RIDER MASTER & CAPACITY ---
class VGFRider(Base):
    __tablename__ = "vgf_riders"
    __table_args__ = TABLE_ARGS

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    rider_code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    vehicle_number = Column(String(50), nullable=True)
    status = Column(String(20), default="Available")
    current_orders_count = Column(Integer, default=0)


# --- ORDERS & REAL-TIME TRACKING (ALIGNED WITH VGF_ORDERS) ---
class VGFOrder(Base):
    __tablename__ = "vgf_orders"
    __table_args__ = TABLE_ARGS

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    rider_id = Column(String(36), ForeignKey("vgf_riders.id"), nullable=True)
    restaurant_id = Column(String(36), ForeignKey("vgf_restaurants.id"), nullable=True)
    customer_id = Column(String(36), ForeignKey("vgf_customers.id"), nullable=True)
    customer_name = Column(String(150), nullable=False)
    delivery_address = Column(Text, nullable=False)
    delivery_fee = Column(Float, nullable=False)
    status = Column(String(50), default="ORDERED", index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class VGFOrderTracking(Base):
    __tablename__ = "vgf_order_tracking"
    __table_args__ = TABLE_ARGS

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), ForeignKey("vgf_orders.id"), nullable=False)
    rider_id = Column(String(36), ForeignKey("vgf_riders.id"), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    status_update = Column(String(50), nullable=False)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())