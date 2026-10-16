"""Customer Feedback API routes."""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/feedback", tags=["feedback"])


class FeedbackRequest(BaseModel):
    customer_id: int
    order_id: int
    rating: int
    comments: str = ""


@router.post("")
def submit_feedback(request: FeedbackRequest):
    """Submit customer rating and feedback."""

    if request.rating < 1 or request.rating > 5:
        return {
            "status": "failed",
            "message": "Rating must be between 1 and 5",
        }

    return {
        "status": "pending",
        "message": "Customer feedback API structure is ready",
        "customer_id": request.customer_id,
        "order_id": request.order_id,
        "rating": request.rating,
        "comments": request.comments,
    }