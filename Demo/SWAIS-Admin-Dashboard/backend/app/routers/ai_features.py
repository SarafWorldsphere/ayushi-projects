import os
import requests
from fastapi import APIRouter, HTTPException, UploadFile, File, Body
from dotenv import load_dotenv

load_dotenv()
router = APIRouter(prefix="/api/v1/admin", tags=["AI Features"])

@router.post("/translate")
def translate_text(data: dict = Body(...)):
    url = os.getenv("AI_SERVICE_TRANSLATE")
    try:
        response = requests.post(url, json=data)
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/text-to-voice")
def text_to_voice(data: dict = Body(...)):
    url = os.getenv("AI_SERVICE_TEXT_TO_VOICE")
    try:
        response = requests.post(url, json=data)
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/voice-to-text")
async def voice_to_text(file: UploadFile = File(...)):
    url = os.getenv("AI_SERVICE_VOICE_TO_TEXT")
    try:
        files = {"file": (file.filename, await file.read(), file.content_type)}
        response = requests.post(url, files=files)
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/audio-translator")
async def audio_translator(file: UploadFile = File(...)):
    url = os.getenv("AI_SERVICE_AUDIO_TRANSLATOR")
    try:
        files = {"file": (file.filename, await file.read(), file.content_type)}
        response = requests.post(url, files=files)
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
