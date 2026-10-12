from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from database import get_db
import models

app = FastAPI(title="VIGO Feast - Rider API (Module 3)")

# --- Security Dependency (Fix for Error R5) ---
security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Validates bearer token on protected rider endpoints.
    """
    token = credentials.credentials
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid or missing authentication token"
        )
    return token


# --- CORS Configuration (Fix for Error R5) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3003"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Pydantic Schemas ---
class OrderStatusUpdate(BaseModel):
    status: str
    rider_id: Optional[str] = None

class LoginRequest(BaseModel):
    phone: str
    password: str


@app.get("/")
def health_check():
    return {"status": "VIGO Feast Rider API is active"}


# --- Auth Endpoints (Fix for Error R1/R5) ---
@app.post("/login")
def login_rider(credentials: LoginRequest):
    """
    Validates rider credentials and returns a JWT token.
    (Placeholder validation for current dev phase)
    """
    if len(credentials.phone) < 10 or not credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid phone number or password"
        )
    
    return {
        "access_token": "test_token_12345",
        "token_type": "bearer",
        "rider_id": "rider_demo_001"
    }


# --- Read Endpoints (Fix for Error R2 & R5) ---
@app.get("/orders/active")
def get_active_orders(
    db: Session = Depends(get_db), 
    token: str = Depends(verify_token)
):
    """
    Queries active orders from vgf_orders.
    """
    active_statuses = ["ORDERED", "Assigned", "ACCEPTED", "PICKED_UP"]
    orders = (
        db.query(models.VGFOrder)
        .filter(models.VGFOrder.status.in_(active_statuses))
        .all()
    )
    
    return [
        {
            "id": order.id,
            "order_number": order.order_number,
            "rider_id": order.rider_id,
            "restaurant_id": order.restaurant_id,
            "customer_id": order.customer_id,
            "customer_name": order.customer_name,
            "delivery_address": order.delivery_address,
            "delivery_fee": order.delivery_fee,
            "status": order.status,
            "created_at": order.created_at.isoformat() if order.created_at else None,
        }
        for order in orders
    ]


# --- Write Endpoints (Fix for Error R2) ---
@app.put("/orders/{order_id}/status")
def update_order_status(
    order_id: str, 
    update_data: OrderStatusUpdate, 
    db: Session = Depends(get_db), 
    token: str = Depends(verify_token)
):
    """
    Updates order lifecycle status (Assigned -> Picked Up -> Delivered).
    """
    order = db.query(models.VGFOrder).filter(models.VGFOrder.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Order with ID {order_id} not found"
        )
    
    valid_statuses = ["Assigned", "ACCEPTED", "PICKED_UP", "DELIVERED", "CANCELLED"]
    if update_data.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{update_data.status}'. Must be one of {valid_statuses}"
        )

    order.status = update_data.status
    if update_data.rider_id:
        order.rider_id = update_data.rider_id
        
    db.commit()
    db.refresh(order)
    
    return {
        "message": f"Order {order_id} updated successfully",
        "order_id": order.id,
        "status": order.status,
        "rider_id": order.rider_id
    }