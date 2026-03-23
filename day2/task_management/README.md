# FastAPI Task Management System

A production-style REST API built with FastAPI, Pydantic v2, and JSON file storage.

## Features
- Full CRUD for Users and Tasks
- OOP + SOLID principles throughout
- JSON file-based persistence with file locking (atomic writes)
- Structured logging to `logs/app.log`
- Custom exception handlers
- Environment-based configuration via `.env`
- Pydantic v2 validation
- Postman collection included

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run the server
python main.py
# or
uvicorn main:app --reload
```

Server runs at: http://localhost:8000  
Swagger UI: http://localhost:8000/docs

## Default Test Credentials
All sample users have password: `password123`
- alice / alice@techcorp.com
- bob / bob@techcorp.com
- carol / carol@techcorp.com
- dave / dave@techcorp.com

## Project Structure
```
task_management/
├── main.py                     # App entry point, middleware, exception handlers
├── config.py                   # Pydantic-settings environment config
├── models/
│   ├── enums.py                # TaskStatus, TaskPriority enums
│   └── schemas.py              # Pydantic request/response schemas
├── services/
│   ├── task_service.py         # Task business logic
│   └── user_service.py         # User business logic + password hashing
├── repositories/
│   ├── base_repository.py      # Abstract base (DIP interface)
│   └── json_repository.py      # JSON file implementation (atomic writes)
├── routers/
│   ├── task_router.py          # Task HTTP endpoints
│   └── user_router.py          # User HTTP endpoints
├── middleware/
│   └── logging_middleware.py   # Request/response timing logger
├── exceptions/
│   └── custom_exceptions.py    # Domain exceptions
├── tests/
│   ├── test_tasks.py           # Task endpoint tests
│   └── test_users.py           # User endpoint tests
├── data/
│   ├── tasks.json              # Persistent task storage (10 sample tasks)
│   └── users.json              # Persistent user storage (4 sample users)
├── logs/
│   └── app.log                 # Structured application logs
├── postman_collection.json     # Import into Postman as "Day2-TaskAPI"
├── .env                        # Environment configuration
└── requirements.txt
```

## Running Tests
```bash
cd task_management
pytest tests/ -v
```

## API Endpoints

### Users
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | /users/register | Register new user | 201 |
| POST | /users/login | Login | 200 |
| GET | /users | List all users | 200 |
| DELETE | /users/{user_id} | Delete user | 200 |

### Tasks
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | /tasks | Create task | 201 |
| GET | /tasks | List (filter+paginate) | 200 |
| GET | /tasks/{id} | Get by ID | 200 |
| PUT | /tasks/{id} | Full update | 200 |
| PATCH | /tasks/{id} | Partial update | 200 |
| DELETE | /tasks/{id} | Delete | 200 |

### Query Parameters for GET /tasks
- `?status=pending`
- `?priority=high`
- `?owner=alice`
- `?page=1&limit=5`

## Error Response Format
```json
{
  "error": "TaskNotFoundError",
  "message": "Task with id 999 not found",
  "status_code": 404
}
```

## SOLID Principles Map
| Principle | Where Applied |
|-----------|--------------|
| SRP | Routers (HTTP only), Services (logic only), Repositories (persistence only) |
| OCP | New entities need only new router/service/repo files — no existing code changed |
| LSP | JSONRepository substitutes BaseRepository in any service without breakage |
| ISP | BaseRepository defines only: find_all, find_by_id, save, update, delete |
| DIP | Services depend on BaseRepository (abstract); JSONRepository injected via Depends() |
