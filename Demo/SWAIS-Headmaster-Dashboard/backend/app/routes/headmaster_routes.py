from fastapi import APIRouter, Depends, Body, HTTPException, UploadFile, File, Form
from fastapi.responses import Response
from sqlalchemy.orm import Session
from sqlalchemy import text
import io

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
from app.ai_config import GeminiService

# Import Text-to-Speech for generating audio files
try:
    from gtts import gTTS
except ImportError:
    gTTS = None

router = APIRouter()

# =========================================================
# GET HEADMASTER DETAILS
# =========================================================
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

# =========================================================
# ASSIGNMENT REPORT
# =========================================================
@router.post("/assignment-report")
def assignment(
    payload: AssignmentReportRequest,
    db: Session = Depends(get_db)
):
    data = payload.model_dump()
    user_info = data["user_info"]
    return get_assignment_report(db, data, user_info)

# =========================================================
# ACADEMIC ANALYTICS
# =========================================================
@router.post("/academic-analytics")
def academic(
    payload: AcademicAnalyticsRequest,
    db: Session = Depends(get_db)
):
    data = payload.model_dump()
    user_info = data["user_info"]
    return get_academic_analytics(db, data, user_info)

# =========================================================
# TEACHER PERFORMANCE
# =========================================================
@router.post("/teacher-performance")
def teacher(
    payload: TeacherPerformanceRequest,
    db: Session = Depends(get_db)
):
    data = payload.model_dump()
    user_info = data["user_info"]
    return get_teacher_performance(db, data, user_info)

# =========================================================
# 1. AI TRANSLATE ENDPOINT
# =========================================================
@router.post("/translate")
async def translate_text(payload: dict = Body(...)):
    text_input = payload.get("script") or payload.get("text")
    target_language = payload.get("target_language")

    if not text_input or not target_language:
        raise HTTPException(status_code=400, detail="Text and target_language are required")

    prompt = f'Translate this text into {target_language}. Return ONLY the final translated text, with no quotes or conversational preamble: "{text_input}"'
    result = GeminiService.generate_content(prompt)

    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error", "Translation failed"))

    return {"translated_text": result.get("text")}

# =========================================================
# 2. AI STUDENT ASSESSMENT ENDPOINT
# =========================================================
@router.post("/assess/student")
async def assess_student(payload: dict = Body(...)):
    if not payload:
        raise HTTPException(status_code=400, detail="Student data is required")

    section_name = payload.get("classSection") or payload.get("student_name") or "Selected Batch"
    students_data = payload.get("students", [])

    prompt = f"""
    You are an expert academic evaluator. Analyze the following student records for section '{section_name}':
    {students_data}

    Provide a concise, professional assessment report summarizing:
    1. Overall Class Performance & Engagement
    2. Key Strengths Observed
    3. Actionable Recommendations for Academic Improvement

    Format the response cleanly in plain text with bullet points. Do not include raw JSON code or system errors.
    """
    
    result = GeminiService.generate_content(prompt)

    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error", "Assessment generation failed"))

    return {"assessment": result.get("text")}

# =========================================================
# 3. TEXT TO VOICE ENDPOINT
# =========================================================
@router.post("/text-to-voice")
async def text_to_voice(payload: dict = Body(...)):
    text_input = payload.get("text")
    language = payload.get("target_language", "en")

    if not text_input:
        raise HTTPException(status_code=400, detail="Text is required")

    if gTTS:
        tts = gTTS(text=text_input, lang=language[:2])
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        return Response(content=fp.read(), media_type="audio/mpeg")
    else:
        raise HTTPException(status_code=500, detail="gTTS library missing.")

# =========================================================
# 4. VOICE TO TEXT ENDPOINT
# =========================================================
@router.post("/voice-to-text")
async def voice_to_text(file: UploadFile = File(...)):
    mock_transcript = "Speech input received successfully."
    prompt = f"Clean up and structure this transcript: '{mock_transcript}'"
    result = GeminiService.generate_content(prompt)

    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error", "Voice processing failed"))

    return {"text": result.get("text")}

# =========================================================
# 5. AUDIO TRANSLATOR ENDPOINT
# =========================================================
@router.post("/audio-translator")
async def audio_translator(file: UploadFile = File(...), target_language: str = Form(...)):
    mock_transcript = "Audio recording received successfully."
    prompt = f"Translate this transcript into {target_language}: '{mock_transcript}'"
    result = GeminiService.generate_content(prompt)

    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error", "Audio translation failed"))

    return {"translated_text": result.get("text")}
