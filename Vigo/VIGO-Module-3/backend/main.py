from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db
import models

app = FastAPI(title="NFDS Rider API")

# Soft-coded CORS: Allows your frontend (port 3000) to communicate with this backend (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "Rider API is running perfectly"}

# Dynamic endpoint replacing hardcoded data
@app.get("/orders/active")
def get_active_orders(db: Session = Depends(get_db)):
    # Soft-coded logic to fetch orders dynamically where status is "Assigned"
    orders = db.query(models.NFDOrder).filter(models.NFDOrder.status == "Assigned").all()
    return orders