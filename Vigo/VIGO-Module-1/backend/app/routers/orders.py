"""Customer Order API routes."""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import text

from app.config import settings
from app.db.pool import build_engine
from app.routers.auth import get_current_customer

router = APIRouter(prefix="/orders", tags=["orders"])

engine = build_engine(settings.database_url, settings.app_name)

class OrderItemRequest(BaseModel):
    menu_id: str
    quantity: int
    unit_price: float

class CreateOrderRequest(BaseModel):
    hotel_id: int
    address_id: int
    items: list[OrderItemRequest]
    subtotal: float
    gst_amount: float
    delivery_charge: float
    total_amount: float

class OrderIdRequest(BaseModel):
    order_id: str

class CancelOrderRequest(BaseModel):
    order_id: str
    reason: str


@router.post("")
def create_order(request: CreateOrderRequest, current_customer_id: int = Depends(get_current_customer)):
    """
    Blocks the old stub endpoint to enforce the fix for Error C1.
    All checkouts must go through /customers/checkout to properly save the order.
    """
    raise HTTPException(
        status_code=400, 
        detail="Order creation must be done via POST /customers/checkout to ensure proper cart and payment processing."
    )


@router.post("/history")
def order_history(current_customer_id: int = Depends(get_current_customer)):
    """Fetch customer's real order history with restaurant names and item summaries."""
    with engine.connect() as connection:
        # Added JOINs to fetch restaurant names, images, and aggregate the menu items for the UI
        orders = connection.execute(
            text("""
                SELECT 
                    o.id as order_id, 
                    o.total_amount, 
                    o.status, 
                    o.created_at,
                    r.name as restaurant_name,
                    COALESCE(r.cover_image_url, r.logo_url) as image_url,
                    (
                        SELECT STRING_AGG(mi.name || ' x' || oi.quantity, ', ')
                        FROM vgf_order_items oi
                        JOIN vgf_menu_items mi ON oi.menu_item_id = mi.id
                        WHERE oi.order_id = o.id
                    ) as items_summary
                FROM vgf_orders o
                LEFT JOIN vgf_restaurants r ON o.restaurant_id = r.id
                WHERE o.customer_id = :customer_id 
                ORDER BY o.created_at DESC
            """),
            {"customer_id": current_customer_id}
        ).mappings().all()

    formatted_orders = []
    for o in orders:
        formatted_orders.append({
            "order_id": str(o["order_id"]),
            "restaurant": o["restaurant_name"] or "Unknown Restaurant",
            "image_url": o["image_url"] or "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
            "items": o["items_summary"] or "Order items",
            "total_amount": float(o["total_amount"]),
            "status": o["status"],
            "created_at": str(o["created_at"].strftime("%b %d, %Y %I:%M %p")) if o["created_at"] else "Unknown Date"
        })

    return {
        "status": "ok",
        "message": "Order history retrieved successfully",
        "customer_id": current_customer_id,
        "orders": formatted_orders,
    }


@router.post("/details")
def order_details(request: OrderIdRequest, current_customer_id: int = Depends(get_current_customer)):
    """Fetch real customer order details and items with readable names."""
    with engine.connect() as connection:
        order = connection.execute(
            text("""
                SELECT o.*, r.name as restaurant_name 
                FROM vgf_orders o
                LEFT JOIN vgf_restaurants r ON o.restaurant_id = r.id
                WHERE o.id = CAST(:order_id AS uuid) AND o.customer_id = :customer_id
            """),
            {"order_id": request.order_id, "customer_id": current_customer_id}
        ).mappings().first()

        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        # Added JOIN to get the actual name of the menu item
        items = connection.execute(
            text("""
                SELECT oi.menu_item_id, oi.quantity, oi.unit_price, mi.name as item_name
                FROM vgf_order_items oi
                LEFT JOIN vgf_menu_items mi ON oi.menu_item_id = mi.id
                WHERE oi.order_id = CAST(:order_id AS uuid)
            """),
            {"order_id": request.order_id}
        ).mappings().all()

    return {
        "status": "ok",
        "order_id": request.order_id,
        "customer_id": current_customer_id,
        "restaurant_name": order["restaurant_name"],
        "status_code": order["status"],
        "total_amount": float(order["total_amount"]),
        "items": [
            {
                "menu_item_id": str(i["menu_item_id"]), 
                "name": i["item_name"],
                "quantity": i["quantity"], 
                "unit_price": float(i["unit_price"])
            } for i in items
        ]
    }


@router.post("/cancel")
def cancel_order(request: CancelOrderRequest, current_customer_id: int = Depends(get_current_customer)):
    """Cancel order and update database status."""
    with engine.begin() as connection:
        order_status = connection.execute(
            text("SELECT status FROM vgf_orders WHERE id = CAST(:order_id AS uuid) AND customer_id = :customer_id"),
            {"order_id": request.order_id, "customer_id": current_customer_id}
        ).scalar()

        if not order_status:
            raise HTTPException(status_code=404, detail="Order not found")

        if order_status in ["DELIVERED", "CANCELLED", "OUT_FOR_DELIVERY", "PAID"]:
            raise HTTPException(status_code=400, detail=f"Order cannot be cancelled. Current status: {order_status}")

        connection.execute(
            text("UPDATE vgf_orders SET status = 'CANCELLED', updated_at = NOW() WHERE id = CAST(:order_id AS uuid)"),
            {"order_id": request.order_id}
        )

    return {
        "status": "ok",
        "message": "Order cancelled successfully",
        "customer_id": current_customer_id,
        "order_id": request.order_id,
        "reason": request.reason,
    }