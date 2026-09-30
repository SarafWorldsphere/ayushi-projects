from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Module 4.6 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/module46/reports-summary")
def get_reports_summary():
    return {
        "total_revenue": 482600,
        "orders_this_month": 12340,
        "avg_order_value": 390,
        "hotel_commission_earned": 72400,
        "rider_payouts": 186200,
        "tds_deducted": 9300
    }

@app.get("/api/module46/chart-data")
def get_chart_data():
    return [
        {"month": "Jan", "revenue": 320000},
        {"month": "Feb", "revenue": 380000},
        {"month": "Mar", "revenue": 350000},
        {"month": "Apr", "revenue": 410000},
        {"month": "May", "revenue": 482600}
    ]