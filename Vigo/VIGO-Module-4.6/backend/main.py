from database import Base, engine, get_db
from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session
import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Module 4.6 API")


@app.get("/reports-summary")
def get_reports_summary(db: Session = Depends(get_db)):
    sales = db.query(models.VGFSalesSummary).first()
    commission = db.query(models.VGFCommissionSummary).first()

    return {
        "total_revenue": sales.total_revenue if sales else 482600,
        "orders_this_month": sales.orders_count if sales else 12340,
        "avg_order_value": sales.avg_order_value if sales else 390,
        "hotel_commission_earned": (
            commission.hotel_commission if commission else 72400
        ),
        "rider_payouts": commission.rider_payouts if commission else 186200,
        "tds_deducted": commission.tds_deducted if commission else 9300,
    }


@app.get("/chart-data")
def get_chart_data(db: Session = Depends(get_db)):
    sales_list = db.query(models.VGFSalesSummary).all()
    if not sales_list:
        return [
            {"month": "Jan", "revenue": 320000},
            {"month": "Feb", "revenue": 380000},
            {"month": "Mar", "revenue": 350000},
            {"month": "Apr", "revenue": 410000},
            {"month": "May", "revenue": 482600},
        ]

    return [
        {"month": item.report_date, "revenue": item.total_revenue}
        for item in sales_list
    ]