from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import get_db

router = APIRouter()

@router.get("/")
def get_class_teachers(db: Session = Depends(get_db)):
    query = """
        SELECT
            c.class_id,
            c.class_name,
            c.section_name,
            c.academic_year,
            c.class_teacher_id,
            u.full_name AS class_teacher_name,
            u.email_id AS teacher_email,
            u.mobile_no AS teacher_mobile
        FROM dem_class_master c
        LEFT JOIN dem_users_master u
            ON c.class_teacher_id = u.user_id
        WHERE c.record_status = 'Active'
        ORDER BY c.class_id;
    """
    
    result = db.execute(text(query)).mappings().all()
    return [dict(row) for row in result]