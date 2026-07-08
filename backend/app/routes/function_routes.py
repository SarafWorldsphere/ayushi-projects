from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db

router = APIRouter()

@router.get("/")
def get_functions(db: Session = Depends(get_db)):
    query = """
        SELECT function_id, function_name, function_date,
               coordinator_name, participants_count, status
        FROM dem_function_master
        WHERE record_status = 'Active'
        ORDER BY function_id DESC;
    """
    
    result = db.execute(text(query)).mappings().all()
    return [dict(r) for r in result]