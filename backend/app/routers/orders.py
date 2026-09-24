"""Customer Order API routes."""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/orders", tags=["orders"])


class CustomerIdRequest(BaseModel):
    customer_id: int


class OrderItemRequest(BaseModel):
    menu_id: int
    quantity: int
    unit_price: float


class CreateOrderRequest(BaseModel):
    customer_id: int
    hotel_id: int
    address_id: int
    items: list[OrderItemRequest]
    subtotal: float
    gst_amount: float
    delivery_charge: float
    total_amount: float


class OrderIdRequest(BaseModel):
    customer_id: int
    order_id: int


class CancelOrderRequest(BaseModel):
    customer_id: int
    order_id: int
    reason: str


@router.post("")
def create_order(request: CreateOrderRequest):
    """Create order API structure."""
    return {
        "status": "pending",
        "message": "Create order API structure is ready",
        "customer_id": request.customer_id,
        "hotel_id": request.hotel_id,
        "address_id": request.address_id,
        "items": request.items,
        "subtotal": request.subtotal,
        "gst_amount": request.gst_amount,
        "delivery_charge": request.delivery_charge,
        "total_amount": request.total_amount,
    }


@router.post("/history")
def order_history(request: CustomerIdRequest):
    """Customer order history API structure."""
    return {
        "status": "pending",
        "message": "Order history API structure is ready",
        "customer_id": request.customer_id,
        "orders": [],
    }


@router.post("/details")
def order_details(request: OrderIdRequest):
    """Customer order details API structure."""
    return {
        "status": "pending",
        "message": "Order details API structure is ready",
        "customer_id": request.customer_id,
        "order_id": request.order_id,
    }


@router.post("/cancel")
def cancel_order(request: CancelOrderRequest):
    """Customer order cancellation API structure."""
    return {
        "status": "pending",
        "message": "Order cancellation API structure is ready",
        "customer_id": request.customer_id,
        "order_id": request.order_id,
        "reason": request.reason,
    }