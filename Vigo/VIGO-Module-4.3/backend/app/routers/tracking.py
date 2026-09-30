"""Customer Order Tracking API routes."""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/tracking", tags=["tracking"])


class TrackingRequest(BaseModel):
    customer_id: int
    order_id: int


@router.post("")
def order_tracking(request: TrackingRequest):
    """Order tracking API structure."""
    return {
        "status": "pending",
        "message": "Order tracking API structure is ready",
        "customer_id": request.customer_id,
        "order_id": request.order_id,
        "order_status": "PENDING",
        "rider_id": None,
        "latitude": None,
        "longitude": None,
        "eta": None,
    }