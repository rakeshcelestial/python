import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

app = FastAPI()
security = HTTPBearer() # This helper looks for "Authorization: Bearer <token>"

# --- CONFIGURATION ---
SECRET_KEY = os.getenv("JWT_SECRET", "MY_SUPER_SECRET_KEY")
ALGORITHM = "HS256"

# --- MOCK DATABASE ---
users_db = {
    "alice": {"username": "alice", "email": "a@b.com", "full_name": "Alice Smith"}
}

# --- DEPENDENCY ---
async def get_current_user(auth: HTTPAuthorizationCredentials = Depends(security)):
    token = auth.credentials # This is the actual string 'eyJhbGci...'
    
    # 1. Prepare the 401 Error (Who are you?)
    unauthorized_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # 2. Decode the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        token_type: str = payload.get("token_type")

        # 3. SECURITY: Reject if it's a Refresh Token instead of an Access Token
        if token_type != "access":
            raise unauthorized_exception
            
        if username is None:
            raise unauthorized_exception
            
    except JWTError:
        raise unauthorized_exception

    # 4. Look up user in database
    user = users_db.get(username)
    if user is None:
        raise unauthorized_exception
        
    return user

# --- PROTECTED ENDPOINT ---
@app.get("/me")
def read_users_me(current_user: dict = Depends(get_current_user)):
    # This code only runs if the 'get_current_user' dependency succeeds
    return current_user

