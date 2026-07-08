from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import get_db

router = APIRouter()

# ===================== STUDENTS =====================
@router.get("/")
def get_students(db: Session = Depends(get_db)):
    query = """
        SELECT
            s.student_id,
            s.admission_no,
            s.full_name,
            c.class_name,
            s.section AS section_name,
            s.roll_no,
            COALESCE(s.parent_name, '-') AS parent_name,
            COALESCE(s.mobile_no, '-') AS mobile_no,
            s.email_id,
            s.record_status
        FROM dem_student_master s
        LEFT JOIN dem_class_master c ON s.class_id = c.class_id
        WHERE s.record_status = 'Active'
        ORDER BY s.student_id;
    """
    
    result = db.execute(text(query)).mappings().all()
    return [dict(row) for row in result]

# ===================== PROGRESS =====================
@router.get("/progress")
def get_progress(db: Session = Depends(get_db)):
    query = """
        SELECT
            sm.marks_id,
            s.student_id,
            s.full_name,
            c.class_name,
            c.section_name,
            sub.subject_name,
            e.exam_name,
            e.exam_type,
            sm.marks_obtained,
            sm.max_marks,
            ROUND(
                (sm.marks_obtained::numeric / NULLIF(sm.max_marks, 0)) * 100,
                2
            ) AS percentage,
            sm.grade,
            sm.remarks,
            sm.record_status
        FROM dem_student_marks sm
        LEFT JOIN dem_student_master s ON sm.student_id = s.student_id
        LEFT JOIN dem_class_master c ON s.class_id = c.class_id
        LEFT JOIN dem_subject_master sub ON sm.subject_id = sub.subject_id
        LEFT JOIN dem_exam_master e ON sm.exam_id = e.exam_id
        WHERE sm.record_status = 'Active'
        ORDER BY sm.marks_id;
    """
    
    result = db.execute(text(query)).mappings().all()
    return [dict(row) for row in result]