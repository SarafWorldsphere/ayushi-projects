"""Customer Payment API routes."""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/payments", tags=["payments"])


class PaymentRequest(BaseModel):
    customer_id: int
    order_id: int
    method: str
    amount: float


class PaymentStatusRequest(BaseModel):
    payment_id: int


@router.post("")
def create_payment(request: PaymentRequest):
    """Create payment API structure."""

    allowed_methods = {
        "UPI",
        "CREDIT_CARD",
        "DEBIT_CARD",
    }

    if request.method not in allowed_methods:
        return {
            "status": "failed",
            "message": "Unsupported payment method",
        }

    return {
        "status": "pending",
        "message": "Payment API structure is ready",
        "customer_id": request.customer_id,
        "order_id": request.order_id,
        "method": request.method,
        "amount": request.amount,
    }


@router.post("/status")
def payment_status(request: PaymentStatusRequest):
    """Payment status API structure."""

    return {
        "status": "pending",
        "message": "Payment status API structure is ready",
        "payment_id": request.payment_id,
    }