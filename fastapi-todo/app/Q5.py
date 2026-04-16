from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional

app = FastAPI()

# --- MODELS ---

# 1. The "Nested" Model (The User details)
class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

# 2. The "Main" Model (The Todo details)
class TodoWithOwner(BaseModel):
    id: int
    title: str
    status: str
    # Here is the NESTING: The owner field uses the UserResponse model
    owner: UserResponse 

# --- MOCK DATABASE ---
# Imagine these are rows in a database table
users_db = {
    42: {"id": 42, "username": "alice", "email": "a@b.com", "password_hash": "secret_abc"},
    10: {"id": 10, "username": "bob", "email": "b@c.com", "password_hash": "secret_123"}
}

todos_db = {
    11: {"id": 11, "title": "Buy milk", "status": "pending", "owner_id": 42},
    12: {"id": 12, "title": "Fix car", "status": "done", "owner_id": 10}
}

# --- ENDPOINT ---

@app.get("/todos/{todo_id}", response_model=TodoWithOwner)
async def get_todo(todo_id: int):
    # 1. Find the todo
    todo = todos_db.get(todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # 2. Find the owner using the owner_id from the todo
    owner_data = users_db.get(todo["owner_id"])
    if not owner_data:
        raise HTTPException(status_code=404, detail="Owner not found")

    # 3. Combine them into the shape expected by TodoWithOwner
    # Notice we don't pass "password_hash"; Pydantic would ignore it anyway 
    # because it's not in the UserResponse model.
    return {
        "id": todo["id"],
        "title": todo["title"],
        "status": todo["status"],
        "owner": owner_data 
    }