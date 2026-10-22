import os
import random
import requests
import jwt
import urllib.parse
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

router = APIRouter(prefix="/auth", tags=["Authentication"])

SECRET_KEY = os.getenv("SECRET_KEY", "vigo-super-secret-jwt-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # Tokens last for 7 days

security = HTTPBearer()

otp_storage = {}

class PhoneRequest(BaseModel):
    phone: str
    language: str = "en"  # Defaults to English

class VerifyRequest(BaseModel):
    phone: str
    otp: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_customer(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        customer_id = payload.get("sub")
        if customer_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication token")
        return int(customer_id)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token. Please log in again.")

@router.post("/request-otp")
def request_otp(data: PhoneRequest):
    otp = str(random.randint(100000, 999999))
    otp_storage[data.phone] = otp
    
    base_url = os.getenv("NIMBUS_API_URL", "http://nimbusit.biz/api/SmsApi/SendSingleApi")
    if not base_url:
        raise HTTPException(status_code=500, detail="NIMBUS_API_URL is missing in .env file")
    
    # DLT Compliant Unicode Formatting for Regional Languages
    if data.language == "hi":
        template_id = os.getenv("NIMBUS_TEMPLATE_ID_HI")
        encoded_msg = f"%E0%A4%86%E0%A4%AA%E0%A4%95%E0%A4%BE%20%E0%A4%AE%E0%A5%8B%E0%A4%AC%E0%A4%BE%E0%A4%87%E0%A4%B2%20%E0%A4%B8%E0%A4%A4%E0%A5%8D%E0%A4%AF%E0%A4%BE%E0%A4%AA%E0%A4%A8%20OTP%20{otp}%20VIGOFEAST%20%E0%A4%95%E0%A5%87%20%E0%A4%B2%E0%A4%BF%E0%A4%8F%20%E0%A4%B9%E0%A5%88%E0%A5%A4%20%E0%A4%AF%E0%A4%B9%2010%20%E0%A4%AE%E0%A4%BF%E0%A4%A8%E0%A4%9F%20%E0%A4%A4%E0%A4%95%20%E0%A4%AE%E0%A4%BE%E0%A4%A8%E0%A5%8D%E0%A4%AF%20%E0%A4%B9%E0%A5%88%E0%A5%A4%20%E0%A4%87%E0%A4%B8%20OTP%20%E0%A4%95%E0%A5%8B%20%E0%A4%95%E0%A4%BF%E0%A4%B8%E0%A5%80%20%E0%A4%95%E0%A5%87%20%E0%A4%B8%E0%A4%BE%E0%A4%A5%20%E0%A4%B8%E0%A4%BE%E0%A4%9D%E0%A4%BE%20%E0%A4%A8%20%E0%A4%95%E0%A4%B0%E0%A5%87%E0%A4%82%E0%A5%A4%0A-%20SARAF%20WORLDSPHERE%20AI%20SERVICES"
        base_url = base_url.replace("SendSingleApi", "SendSingleUnicodeApi")
        
    elif data.language == "te":
        template_id = os.getenv("NIMBUS_TEMPLATE_ID_TE")
        encoded_msg = f"%E0%B0%AE%E0%B1%80%20%E0%B0%AE%E0%B1%8A%E0%B0%AC%E0%B1%88%E0%B0%B2%E0%B1%8D%20%E0%B0%A7%E0%B1%83%E0%B0%B5%E0%B1%80%E0%B0%95%E0%B0%B0%E0%B0%A3%20OTP%20{otp}%20VIGOFEAST%20%E0%B0%95%E0%B1%8B%E0%B0%B8%E0%B0%82.%20%E0%B0%87%E0%B0%A6%E0%B0%BF%2010%20%E0%B0%A8%E0%B0%BF%E0%B0%AE%E0%B0%BF%E0%B0%B7%E0%B0%BE%E0%B0%B2%20%E0%B0%B5%E0%B0%B0%E0%B0%95%E0%B1%81%20%E0%B0%9A%E0%B1%86%E0%B0%B2%E0%B1%8D%E0%B0%B2%E0%B1%81%E0%B0%AC%E0%B0%BE%E0%B0%9F%E0%B1%81%20%E0%B0%85%E0%B0%B5%E0%B1%81%E0%B0%A4%E0%B1%81%E0%B0%82%E0%B0%A6%E0%B0%BF.%20%E0%B0%88%20OTP%20%E0%B0%A8%E0%B0%BF%20%E0%B0%8E%E0%B0%B5%E0%B0%B0%E0%B0%BF%E0%B0%A4%E0%B1%8B%E0%B0%A8%E0%B1%82%20%E0%B0%AA%E0%B0%82%E0%B0%9A%E0%B1%81%E0%B0%95%E0%B1%8B%E0%B0%B5%E0%B0%A6%E0%B1%8D%E0%B0%A6%E0%B1%81.%0A-%20SARAF%20WORLDSPHERE%20AI%20SERVICES"
        base_url = base_url.replace("SendSingleApi", "SendSingleUnicodeApi")
        
    else:
        template_id = os.getenv("NIMBUS_TEMPLATE_ID")
        message = f"Your mobile verification OTP is {otp} for VIGOFEAST. It is valid for 10 minutes. Do not share this OTP with anyone.\nSARAF WORLDSPHERE AI SERVICES"
        encoded_msg = urllib.parse.quote(message)
    
    user_id = os.getenv("NIMBUS_USER_ID")
    password = urllib.parse.quote(str(os.getenv("NIMBUS_PASSWORD")))
    sender_id = os.getenv("NIMBUS_SENDER_ID")
    entity_id = os.getenv("NIMBUS_ENTITY_ID")
    
    query = (
        f"?UserID={user_id}"
        f"&Password={password}"
        f"&SenderID={sender_id}"
        f"&Phno={data.phone}"
        f"&Msg={encoded_msg}"
        f"&EntityID={entity_id}"
        f"&TemplateID={template_id}"
    )
    
    try:
        response = requests.get(f"{base_url}{query}", timeout=10)
        response_text = response.text.lower()
        
        if response.status_code == 200 and "<html" not in response_text and "error" not in response_text and "invalid" not in response_text:
            return {"message": f"OTP sent successfully in {data.language}", "nimbus_response": response.text}
        else:
            raise HTTPException(
                status_code=500, 
                detail=f"SMS Gateway Failed. Response: {response.text[:150]}"
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to SMS Gateway: {str(e)}")

@router.post("/verify-otp")
def verify_otp(data: VerifyRequest):
    stored_otp = otp_storage.get(data.phone)
    
    if not stored_otp or stored_otp != data.otp:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    del otp_storage[data.phone]
    access_token = create_access_token({"sub": data.phone})
    
    return {"access_token": access_token, "token_type": "bearer"}