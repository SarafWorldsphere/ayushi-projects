from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import get_db

from app.controllers.headmaster_controller import (
    get_assignment_report,
    get_academic_analytics,
    get_teacher_performance,
    translate_for_headmaster
)

from app.schemas.headmaster_schema import (
    AssignmentReportRequest,
    AcademicAnalyticsRequest,
    TeacherPerformanceRequest,
    TranslateRequest
)

router = APIRouter()


# ==================================================
# GET HEADMASTER DETAILS
# ==================================================
@router.get("/")
def get_headmaster(db: Session = Depends(get_db)):

    query = """
        SELECT u.full_name, r.role_name
        FROM dem_users_masters u
        JOIN dem_role_response r ON r.role_id = u.role_id
        WHERE LOWER(r.role_name) = 'headmaster'
          AND u.is_active = TRUE
          AND u.record_status = 'Active'
        LIMIT 1
    """

    row = db.execute(text(query)).mappings().fetchone()

    if not row:
        return {
            "success": True,
            "data": {
                "name": "",
                "role": "Headmaster"
            }
        }

    return {
        "success": True,
        "data": {
            "name": row["full_name"],
            "role": row["role_name"]
        }
    }


# ==================================================
# ASSIGNMENT REPORT
# ==================================================
@router.post("/assignment-report")
def assignment(
    payload: AssignmentReportRequest,
    db: Session = Depends(get_db)
):
    data = payload.model_dump()
    user_info = data["user_info"]

    return get_assignment_report(db, data, user_info)


# ==================================================
# ACADEMIC ANALYTICS
# ==================================================
@router.post("/academic-analytics")
def academic(
    payload: AcademicAnalyticsRequest,
    db: Session = Depends(get_db)
):
    data = payload.model_dump()
    user_info = data["user_info"]

    return get_academic_analytics(db, data, user_info)


# ==================================================
# TEACHER PERFORMANCE
# ==================================================
@router.post("/teacher-performance")
def teacher(
    payload: TeacherPerformanceRequest,
    db: Session = Depends(get_db)
):
    data = payload.model_dump()
    user_info = data["user_info"]

    return get_teacher_performance(db, data, user_info)


# ==================================================
# TRANSLATE
# ==================================================
@router.post("/translate")
def translate(
    payload: TranslateRequest,
    db: Session = Depends(get_db)
):
    data = payload.model_dump()
    user_info = data["user_info"]

    return translate_for_headmaster(db, data, user_info)