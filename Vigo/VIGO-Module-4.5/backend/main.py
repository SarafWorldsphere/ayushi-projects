from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NFDS Module 4.5 - Operations Monitoring API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def seed_data():
    db = next(get_db())
    if db.query(models.VGFOrderMonitoring).count() == 0:
        sample_orders = [
            models.VGFOrderMonitoring(order_id="NFDS-9021", customer_name="Rahul Verma", hotel_name="Spice Kitchen", rider_name="Karan Singh", status="Preparing", prep_time_mins=14, delivery_time_mins=20),
            models.VGFOrderMonitoring(order_id="NFDS-9022", customer_name="Pooja Sharma", hotel_name="Bawarchi Grand", rider_name="Amit Patel", status="Picked", prep_time_mins=10, delivery_time_mins=18),
            models.VGFOrderMonitoring(order_id="NFDS-9023", customer_name="Vikram Seth", hotel_name="Tandoor Box", rider_name=None, status="Accepted", prep_time_mins=16, delivery_time_mins=25),
            models.VGFOrderMonitoring(order_id="NFDS-9024", customer_name="Ananya Roy", hotel_name="Pizza Junction", rider_name="Sanjay Rao", status="Delivered", prep_time_mins=11, delivery_time_mins=21),
        ]
        db.add_all(sample_orders)
        db.commit()

@app.get("/api/module45/overview")
def get_ops_overview():
    # Matching the exact metric counters from design spec
    return {
        "orders_in_progress": 34,
        "orders_delayed": 3,
        "avg_prep_time_mins": 12,
        "avg_delivery_time_mins": 22,
        "cancelled_today": 5,
        "sla_breaches": 2,
        "active_riders_online": 24,
    }

@app.get("/api/module45/live-orders")
def get_live_orders(db: Session = Depends(get_db)):
    return db.query(models.VGFOrderMonitoring).all()