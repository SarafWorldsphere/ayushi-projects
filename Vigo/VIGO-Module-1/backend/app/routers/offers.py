"""Customer Offers API routes."""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/offers", tags=["offers"])


class CustomerOfferRequest(BaseModel):
    customer_id: int


class ApplyOfferRequest(BaseModel):
    customer_id: int
    order_id: int
    offer_code: str


@router.post("/list")
def list_offers(request: CustomerOfferRequest):
    """List available customer offers."""
    return {
        "status": "pending",
        "message": "Offers API structure is ready",
        "customer_id": request.customer_id,
        "offers": [],
    }


@router.post("/apply")
def apply_offer(request: ApplyOfferRequest):
    """Apply an eligible offer."""
    return {
        "status": "pending",
        "message": "Apply offer API structure is ready",
        "customer_id": request.customer_id,
        "order_id": request.order_id,
        "offer_code": request.offer_code,
    }