import os
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from jose import jwt
from passlib.context import CryptContext

app = FastAPI()

# --- CONFIGURATION ---
SECRET_KEY = os.getenv("JWT_SECRET", "MY_SUPER_SECRET_KEY")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- MOCK DATABASE ---
# Password for 'alice' is 'secret123'
users_db = {
    "alice": {
        "username": "alice",
        "hashed_password": pwd_context.hash("secret123"),
    }
}

# --- SCHEMAS ---
class LoginRequest(BaseModel):
    username: str
    password: str

# --- TOKEN UTILITY ---
def create_token(data: dict, expires_delta: timedelta, token_type: str):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({
        "exp": expire, 
        "iat": datetime.utcnow(), 
        "token_type": token_type  # Claim to distinguish the tokens
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- ENDPOINT ---
@app.post("/auth/login")
async def login(payload: LoginRequest):
    user = users_db.get(payload.username)
    
    # SECURITY: Generic error message to prevent User Enumeration
    generic_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid username or password",
    )

    if not user or not pwd_context.verify(payload.password, user["hashed_password"]):
        raise generic_error

    # Create Access Token (15 Minutes)
    access_token = create_token(
        data={"sub": user["username"]}, 
        expires_delta=timedelta(minutes=15), 
        token_type="access"
    )
    
    # Create Refresh Token (7 Days)
    refresh_token = create_token(
        data={"sub": user["username"]}, 
        expires_delta=timedelta(days=7), 
        token_type="refresh"
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }