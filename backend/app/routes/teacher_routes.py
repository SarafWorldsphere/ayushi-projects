from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db

router = APIRouter()

@router.get("/")
def get_teachers(db: Session = Depends(get_db)):
    try:
        query = """
            SELECT
                t.teacher_id,
                t.full_name,
                t.subject_name,
                t.class_id,
                c.class_name,
                c.section_name,
                t.section_1,
                t.role,
                t.email_id,
                t.section_2,
                t.phone,
                t.is_active
            FROM dem_teacher_master t
            LEFT JOIN dem_class_master c
                ON t.class_id = c.class_id
            WHERE t.is_active = TRUE
            ORDER BY t.teacher_id;
        """
        
        result = db.execute(text(query)).mappings().all()
        return [dict(row) for row in result]
        
    except Exception as e:
        print("🔥 TEACHERS API ERROR:")
        import traceback
        traceback.print_exc()
        raise e