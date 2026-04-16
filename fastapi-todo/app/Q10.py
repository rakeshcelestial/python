from fastapi import FastAPI, Depends, HTTPException, status
# (Assume get_current_user logic is here - importing from Q9 logic)
from Q9 import get_current_user 

app = FastAPI()

# --- UPDATED MOCK DATABASE WITH ROLES ---
users_db = {
    "alice": {"username": "alice", "role": "admin"},
    "bob": {"username": "bob", "role": "user"}
}

# --- ROLE DEPENDENCY ---
def require_admin(current_user: dict = Depends(get_current_user)):
    # 1. SECURITY: Authorization (What can you do?)
    if current_user.get("role") != "admin":
        # 403 means: "I know who you are, but you are not allowed to do this."
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation not permitted. Admin role required."
        )
    return current_user

# --- PROTECTED ADMIN ENDPOINT ---
@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, admin: dict = Depends(require_admin)):
    return {"message": f"Todo {todo_id} deleted by admin {admin['username']}"}

