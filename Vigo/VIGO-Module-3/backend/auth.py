import os
import random
import requests
import jwt
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/auth", tags=["Authentication"])

SECRET_KEY = os.getenv("SECRET_KEY", "vigo-rider-super-secret-jwt-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

security = HTTPBearer()
otp_storage = {}

class PhoneRequest(BaseModel):
    phone: str
    language: str = "en"

class VerifyRequest(BaseModel):
    phone: str
    otp: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/request-otp")
def request_otp(data: PhoneRequest):
    otp = str(random.randint(100000, 999999))
    otp_storage[data.phone] = otp
    
    base_url = os.getenv("NIMBUS_API_URL", "http://nimbusit.biz/api/SmsApi/SendSingleApi")

    if data.language == "hi":
        template_id = os.getenv("NIMBUS_TEMPLATE_ID_HI", "1777179221814991147")
        message = f"आपका मोबाइल सत्यापन OTP {otp} VIGOFEAST के लिए है। यह 10 मिनट तक मान्य है। इस OTP को किसी के साथ साझा न करें।\n- SARAF WORLDSPHERE AI SERVICES"
        base_url = base_url.replace("SendSingleApi", "SendSingleUnicodeApi")
        
    elif data.language == "te":
        template_id = os.getenv("NIMBUS_TEMPLATE_ID_TE", "1777179221822594132")
        message = f"మీ మొబైల్ ధృవీకరణ OTP {otp} VIGOFEAST కోసం. ఇది 10 నిమిషాల వరకు చెల్లుబాటు అవుతుంది. ఈ OTP ని ఎవరితోనూ పంచుకోవద్దు.\n- SARAF WORLDSPHERE AI SERVICES"
        base_url = base_url.replace("SendSingleApi", "SendSingleUnicodeApi")
        
    else:
        template_id = os.getenv("NIMBUS_TEMPLATE_ID", "1777179214715165356")
        message = f"Your mobile verification OTP is {otp} for VIGOFEAST. It is valid for 10 minutes. Do not share this OTP with anyone.\n- SARAF WORLDSPHERE AI SERVICES"
    
    params = {
        "UserID": os.getenv("NIMBUS_USER_ID"),
        "Password": os.getenv("NIMBUS_PASSWORD"),
        "SenderID": os.getenv("NIMBUS_SENDER_ID"),
        "EntityID": os.getenv("NIMBUS_ENTITY_ID"),
        "TemplateID": template_id,
        "Phno": data.phone,
        "Msg": message
    }
    
    try:
        response = requests.get(base_url, params=params, timeout=10)
        resp_text = response.text.strip()
        print(f"Nimbus Gateway Response ({data.language}): {resp_text}")
        
        if response.status_code == 200 and "error" not in resp_text.lower():
            return {"message": f"OTP sent successfully in {data.language}"}
            
        raise HTTPException(status_code=500, detail=f"SMS Gateway Error: {resp_text[:120]}")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-otp")
def verify_otp(data: VerifyRequest):
    stored_otp = otp_storage.get(data.phone)
    if not stored_otp or stored_otp != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    del otp_storage[data.phone]
    access_token = create_access_token({"sub": data.phone})
    return {"access_token": access_token, "token_type": "bearer"}