import json
import re
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.ai_config import GeminiService


# ==================================================
# Helper: Clean AI Text
# ==================================================
def clean_ai_text(text: str):
    return re.sub(r"(\$\$|\$|```|\\\(|\\\)|\\\[|\\\])", "", text or "").strip()


# ==================================================
# Helper: Log AI Usage
# ==================================================
def log_ai_usage(db: Session, user_info: dict, feature_used: str):
    try:
        db.execute(text("""
            INSERT INTO ai_usage_logs (user_name, user_email, user_type, feature_used)
            VALUES (:name, :email, :role, :feature)
        """), {
            "name": user_info.get("name"),
            "email": user_info.get("email"),
            "role": user_info.get("role"),
            "feature": feature_used
        })
        db.commit()
    except Exception as e:
        print("LOG ERROR:", e)


# ==================================================
# 1. ASSIGNMENT REPORT
# ==================================================
def get_assignment_report(db: Session, data: dict, user_info: dict):

    log_ai_usage(db, user_info, "School-Wide Assignment Report")

    result = db.execute(text("""
        SELECT 
            COUNT(*) AS total_assigned,
            SUM(CASE WHEN marks_obtained IS NOT NULL THEN 1 ELSE 0 END) AS completed,
            SUM(CASE WHEN marks_obtained IS NULL OR is_absent = true THEN 1 ELSE 0 END) AS missing
        FROM sgs_assessment_results
    """)).mappings().first()

    prompt = f"""
You are DEMO AI Executive Assistant for the Headmaster.

School Assignment Data:
{json.dumps(dict(result or {}))}

Generate a concise executive report.
Rules:
- 3 bullet points only
- no markdown
"""

    ai_result = GeminiService.generate_content(prompt)

    return {
        "report": clean_ai_text(ai_result.get("text", ""))
    }


# ==================================================
# 2. ACADEMIC ANALYTICS
# ==================================================
def get_academic_analytics(db: Session, payload: dict, user_info: dict):

    target_name = payload.get("targetName")
    target_type = payload.get("targetType")
    scope = payload.get("scope")

    log_ai_usage(db, user_info, f"Academic Analytics {target_type}-{scope}")

    data = []

    if target_type == "student" and scope == "single_subject":
        data = db.execute(text("""
            SELECT a.title AS test, ar.percentage AS score
            FROM sgs_assessment_results ar
            JOIN sgs_assessments a ON a.assessment_id = ar.assessment_id
            JOIN sgs_student_master s ON s.student_id = ar.student_id
            WHERE s.full_name ILIKE :name
        """), {"name": f"%{target_name}%"}).mappings().all()

    elif target_type == "student" and scope == "all_subjects":
        data = db.execute(text("""
            SELECT a.assessment_type AS subject,
                   ROUND(AVG(ar.percentage), 2) AS score
            FROM sgs_assessment_results ar
            JOIN sgs_assessments a ON a.assessment_id = ar.assessment_id
            JOIN sgs_student_master s ON s.student_id = ar.student_id
            WHERE s.full_name ILIKE :name
            GROUP BY a.assessment_type
        """), {"name": f"%{target_name}%"}).mappings().all()

    elif target_type == "class" and scope == "single_subject":
        data = db.execute(text("""
            SELECT s.full_name AS student, ar.percentage AS score
            FROM sgs_assessment_results ar
            JOIN sgs_student_master s ON s.student_id = ar.student_id
        """)).mappings().all()

    elif target_type == "class" and scope == "all_subjects":
        data = db.execute(text("""
            SELECT a.assessment_type AS subject,
                   ROUND(AVG(ar.percentage), 2) AS avg_score
            FROM sgs_assessment_results ar
            JOIN sgs_assessments a ON a.assessment_id = ar.assessment_id
            GROUP BY a.assessment_type
        """)).mappings().all()

    prompt = f"""
You are DEMO AI Academic Analytics Assistant.

Analyze this data:
{json.dumps([dict(x) for x in data])}

Provide:
- trend
- strengths
- weaknesses
- recommendations
Rules:
- max 4 bullet points
"""

    ai_result = GeminiService.generate_content(prompt)

    return {
        "analysis": clean_ai_text(ai_result.get("text", "")),
        "chartData": [dict(x) for x in data]
    }


# ==================================================
# 3. TEACHER PERFORMANCE
# ==================================================
def get_teacher_performance(db: Session, data: dict, user_info: dict):

    log_ai_usage(db, user_info, "Teacher Performance Review")

    teacher_data = db.execute(text("""
        SELECT u.full_name AS name,
               COUNT(a.assessment_id) AS assessments_created
        FROM sgs_users_masters u
        LEFT JOIN sgs_assessments a ON u.user_id = a.teacher_id
        GROUP BY u.full_name
        ORDER BY assessments_created DESC
    """)).mappings().all()

    prompt = f"""
Teacher Performance Data:
{json.dumps([dict(x) for x in teacher_data])}

Generate executive summary:
- top performers
- low performers
- improvement suggestions
Rules:
- max 4 bullet points
"""

    ai_result = GeminiService.generate_content(prompt)

    return {
        "report": clean_ai_text(ai_result.get("text", ""))
    }


# ==================================================
# 4. TRANSLATE
# ==================================================
def translate_for_headmaster(db: Session, payload: dict, user_info: dict):

    text_value = payload.get("text")
    target_language = payload.get("target_language")

    if not text_value or not target_language:
        return {"error": "Missing parameters"}

    log_ai_usage(db, user_info, "Headmaster Translator")

    prompt = f"""
Translate into {target_language}.

Return ONLY translated text.

Text:
{text_value}
"""

    ai_result = GeminiService.generate_content(prompt)

    return {
        "translation": clean_ai_text(ai_result.get("text", ""))
    }