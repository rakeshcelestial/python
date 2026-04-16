import os
from datetime import datetime, timedelta
from typing import Dict
from jose import jwt, JWTError, ExpiredSignatureError
from fastapi import FastAPI, HTTPException, status

app = FastAPI()

# --- CONFIGURATION ---
# In a real app, you'd set this in your terminal: export JWT_SECRET="my_super_secret"
# For this exercise, we provide a default value.
SECRET_KEY = os.getenv("JWT_SECRET", "SUPER_SECRET_KEY_123")
ALGORITHM = "HS256"

# A helper to raise 401 errors consistently
credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

# --- UTILITY FUNCTIONS ---

def create_access_token(data: dict, expires_minutes: int = 15):
    """Encodes data into a JWT string."""
    to_encode = data.copy()
    
    # Set 'iat' (Issued At) and 'exp' (Expires)
    iat = datetime.utcnow()
    expire = iat + timedelta(minutes=expires_minutes)
    
    to_encode.update({"exp": expire, "iat": iat})
    
    # Create the token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str):
    """Decodes and validates a JWT string."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except ExpiredSignatureError:
        # The 'exp' time has passed
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError:
        # Any other error (invalid signature, wrong format)
        raise credentials_exception

# --- TEST ENDPOINT ---
@app.get("/test-token/{username}")
def test_token(username: str):
    # 1. Create a token
    token = create_access_token({"sub": username}, expires_minutes=1)
    
    # 2. Decode it immediately to prove it works
    decoded_data = decode_token(token)
    
    return {
        "original_token": token,
        "decoded_payload": decoded_data
    }


