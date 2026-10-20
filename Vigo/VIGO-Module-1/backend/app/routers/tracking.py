"""Customer Order Tracking API routes."""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import text

from app.config import settings
from app.db.pool import build_engine
from app.routers.auth import get_current_customer

router = APIRouter(prefix="/tracking", tags=["tracking"])

engine = build_engine(settings.database_url, settings.app_name)


class TrackingRequest(BaseModel):
    order_id: str


@router.post("")
def order_tracking(
    request: TrackingRequest, 
    current_customer_id: int = Depends(get_current_customer)
):
    """Fetch real order tracking status and assigned rider details from the database."""

    with engine.connect() as connection:
        # Added LEFT JOIN to fetch real coordinates and rider details
        order = connection.execute(
            text("""
                SELECT 
                    o.id AS order_id, 
                    o.status AS order_status, 
                    o.rider_id,
                    r.name AS rider_name,
                    r.mobile AS rider_phone,
                    r.latitude,
                    r.longitude
                FROM vgf_orders o
                LEFT JOIN vgf_riders r ON o.rider_id = r.id
                WHERE o.id = CAST(:order_id AS uuid) 
                  AND o.customer_id = :customer_id
                  AND o.is_deleted = FALSE
            """),
            {
                "order_id": request.order_id, 
                "customer_id": current_customer_id
            }
        ).mappings().first()

    if not order:
        raise HTTPException(
            status_code=404, 
            detail="Order not found for this customer."
        )

    # Estimate ETA based on status (you can replace this with real logic later)
    eta = "15-20 mins" if order["order_status"] in ["OUT_FOR_DELIVERY", "PREPARING"] else None

    return {
        "status": "ok",
        "message": "Order tracking details loaded successfully.",
        "customer_id": current_customer_id,
        "order_id": request.order_id,
        "order_status": order["order_status"],
        "rider_id": str(order["rider_id"]) if order["rider_id"] else None,
        "rider_name": order.get("rider_name"),
        "rider_phone": order.get("rider_phone"),
        "latitude": float(order["latitude"]) if order.get("latitude") else None,
        "longitude": float(order["longitude"]) if order.get("longitude") else None,
        "eta": eta,
    }