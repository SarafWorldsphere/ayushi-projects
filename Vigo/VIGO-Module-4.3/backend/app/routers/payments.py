"""Customer Payment API routes."""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import text

from app.config import settings
from app.db.pool import build_engine
from app.auth import get_current_customer

router = APIRouter(prefix="/payments", tags=["payments"])

engine = build_engine(settings.database_url, settings.app_name)

class PaymentRequest(BaseModel):
    order_id: str
    method: str
    amount: float
    provider: str = "Yashwant_Gateway" # Added provider to satisfy Error C7

class PaymentStatusRequest(BaseModel):
    payment_id: int

@router.post("")
def create_payment(request: PaymentRequest, current_customer_id: int = Depends(get_current_customer)):
    """Process a payment and link it to the order in the database."""

    allowed_methods = {"UPI", "CREDIT_CARD", "DEBIT_CARD"}

    if request.method not in allowed_methods:
        raise HTTPException(status_code=400, detail="Unsupported payment method")

    with engine.begin() as connection:
        # 1. Verify the order exists and belongs to this customer
        order = connection.execute(
            text("SELECT id FROM vgf_orders WHERE id = CAST(:order_id AS uuid) AND customer_id = :customer_id"),
            {"order_id": request.order_id, "customer_id": current_customer_id}
        ).scalar()

        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        # 2. Insert the payment record into the database (Added provider)
        payment_id = connection.execute(
            text("""
                INSERT INTO vgf_payments (
                    order_id, customer_id, amount, method, provider, status, created_at, updated_at
                )
                VALUES (
                    CAST(:order_id AS uuid), :customer_id, :amount, :method, :provider, 'SUCCESS', NOW(), NOW()
                )
                RETURNING payment_id
            """),
            {
                "order_id": request.order_id,
                "customer_id": current_customer_id,
                "amount": request.amount,
                "method": request.method,
                "provider": request.provider
            }
        ).scalar()

        # 3. Update the order status to PAID
        connection.execute(
            text("UPDATE vgf_orders SET status = 'PAID', updated_at = NOW() WHERE id = CAST(:order_id AS uuid)"),
            {"order_id": request.order_id}
        )

    return {
        "status": "SUCCESS",
        "message": "Payment processed successfully",
        "payment_id": payment_id,
        "order_id": request.order_id,
        "method": request.method,
        "provider": request.provider,
        "amount": request.amount,
    }

@router.post("/status")
def payment_status(request: PaymentStatusRequest, current_customer_id: int = Depends(get_current_customer)):
    """Fetch the actual payment status from the database."""
    
    with engine.connect() as connection:
        payment = connection.execute(
            text("SELECT status, order_id, amount, provider FROM vgf_payments WHERE payment_id = :payment_id AND customer_id = :customer_id"),
            {"payment_id": request.payment_id, "customer_id": current_customer_id}
        ).mappings().first()

    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    return {
        "status": payment["status"],
        "message": "Payment status retrieved successfully",
        "payment_id": request.payment_id,
        "order_id": str(payment["order_id"]),
        "provider": payment.get("provider", "Unknown"),
        "amount": payment["amount"]
    }