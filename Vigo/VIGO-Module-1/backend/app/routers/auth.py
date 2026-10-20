import os
import random
import requests
import jwt
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
    
    # Exact template match (including 'VIGOFEAST' casing and the hyphen)
    message = f"Your mobile verification OTP is {otp} for VIGOFEAST. It is valid for 10 minutes. Do not share this OTP with anyone.\n- SARAF WORLDSPHERE AI SERVICES"
    
    # Dynamically pull the API URL from .env
    nimbus_url = os.getenv("NIMBUS_API_URL")
    if not nimbus_url:
        raise HTTPException(status_code=500, detail="NIMBUS_API_URL is missing in .env file")
    
    # EXACT case-sensitive parameter match based on your specific Nimbus URL
    params = {
        "UserID": os.getenv("NIMBUS_USER_ID"),
        "Password": os.getenv("NIMBUS_PASSWORD"),
        "SenderID": os.getenv("NIMBUS_SENDER_ID"),
        "EntityID": os.getenv("NIMBUS_ENTITY_ID"),
        "TemplateID": os.getenv("NIMBUS_TEMPLATE_ID"),
        "Phno": data.phone,
        "Msg": message
    }
    
    try:
        response = requests.get(nimbus_url, params=params)
        response_text = response.text.lower()
        
        # Strict validation: Must be 200 OK, NOT an HTML page, and NOT contain "error"
        if response.status_code == 200 and "<html" not in response_text and "error" not in response_text and "invalid" not in response_text:
            return {"message": "OTP sent successfully", "nimbus_response": response.text}
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