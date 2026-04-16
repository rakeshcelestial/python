from fastapi import FastAPI, Path, Query
from typing import Literal, Optional

app = FastAPI(title="My REST API Assignment Project")

# --- QUESTION 2: Path & Query Params ---

@app.get("/users/{user_id}/todos")
async def get_user_todos(
    # 1. Path Param: user_id must be an integer and greater than 0
    user_id: int = Path(..., title="The ID of the user", gt=0),
    
    # 2. Query Param: status can only be 'pending' or 'done'
    status: Optional[Literal["pending", "done"]] = Query(None, description="Filter by status"),
    
    # 3. Query Param: limit must be between 1 and 100 (default 10)
    limit: int = Query(10, ge=1, le=100),
    
    # 4. Query Param: offset must be 0 or more (default 0)
    offset: int = Query(0, ge=0)
):
    # This is "Mock Data" (simulating a database)
    mock_todos = [
        {"id": 11, "title": "Buy milk", "status": "pending"},
        {"id": 12, "title": "Clean room", "status": "done"},
        {"id": 13, "title": "Read book", "status": "pending"},
    ]
    
    # Returning the response in the exact shape requested
    return {
        "user_id": user_id,
        "total": 27,  # Hardcoded for example
        "limit": limit,
        "offset": offset,
        "items": mock_todos
    }


