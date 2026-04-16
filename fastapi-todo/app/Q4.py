from fastapi import FastAPI
from pydantic import BaseModel, EmailStr
from datetime import datetime
from passlib.context import CryptContext
from typing import List

app = FastAPI()

# --- SECURITY SETUP ---
# This tells passlib to use bcrypt for hashing passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- MODELS ---

# 1. Input Model: What the user sends during registration
class UserCreate(BaseModel):
    username: str
    email: EmailStr  # Validates that it's a real email format
    password: str

# 2. Response Model: What we show to the public (No Password!)
class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime

# 3. Internal Model: What we would actually save in a Database
class UserInDB(UserResponse):
    hashed_password: str

# Simulated Database (In-memory)
users_db = []

# --- ENDPOINT ---

@app.post("/users", response_model=UserResponse)
async def create_user(user_in: UserCreate):
    # 1. Hash the plaintext password
    hashed_pass = pwd_context.hash(user_in.password)
    
    # 2. Create the internal "Database" version of the user
    new_user_id = len(users_db) + 1
    user_data = {
        "id": new_user_id,
        "username": user_in.username,
        "email": user_in.email,
        "hashed_password": hashed_pass,
        "created_at": datetime.now()
    }
    
    # Save to our "list" database
    users_db.append(user_data)
    
    # 3. Return the data. 
    # Because response_model=UserResponse, FastAPI will AUTOMATICALLY 
    # remove 'hashed_password' before the user sees it.
    return user_data


