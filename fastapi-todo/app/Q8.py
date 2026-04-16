import os
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from jose import jwt, JWTError

app = FastAPI()

# --- CONFIGURATION (Must match Q7) ---
SECRET_KEY = os.getenv("JWT_SECRET", "MY_SUPER_SECRET_KEY")
ALGORITHM = "HS256"

# --- SCHEMAS ---
class RefreshRequest(BaseModel):
    refresh_token: str

# --- TOKEN UTILITY ---
def create_token(data: dict, expires_delta: timedelta, token_type: str):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire, "iat": datetime.utcnow(), "token_type": token_type})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- ENDPOINT ---
@app.post("/auth/refresh")
async def refresh(payload: RefreshRequest):
    try:
        # Decode the token
        decoded_data = jwt.decode(payload.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # SECURITY: Check if it's actually a refresh token
        if decoded_data.get("token_type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        username = decoded_data.get("sub")
        
        # Create a NEW access token (15 mins)
        new_access_token = create_token(
            data={"sub": username},
            expires_delta=timedelta(minutes=15),
            token_type="access"
        )

        return {"access_token": new_access_token, "token_type": "bearer"}

    except JWTError:
        # Fails if expired, tampered with, or wrong secret key
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Refresh token expired or invalid"
        )