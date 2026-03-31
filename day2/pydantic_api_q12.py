from pydantic import BaseModel, Field, field_validator, ValidationError


#  Address Model
class Address(BaseModel):
    street: str
    city: str
    zip_code: str

    @field_validator("zip_code")
    def validate_zip(cls, v):
        if not (v.isdigit() and len(v) == 6):
            raise ValueError("zip_code must be exactly 6 digits")
        return v


#  UserCreate Model (Input)
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    age: int
    address: Address

    @field_validator("email")
    def validate_email(cls, v):
        if "@" not in v:
            raise ValueError("Invalid email format")
        return v

    @field_validator("password")
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v

    @field_validator("age")
    def validate_age(cls, v):
        if v < 18 or v > 120:
            raise ValueError("Age must be between 18 and 120")
        return v


#  UserResponse Model (Output)
class UserResponse(BaseModel):
    username: str
    email: str
    age: int
    address: Address


# Input
data = {
    "username": "alice",
    "email": "alice@mail.com",
    "password": "securepass",
    "age": 25,
    "address": {
        "street": "MG Road",
        "city": "Bangalore",
        "zip_code": "560001"
    }
}

try:
    user = UserCreate(**data)

    # Exclude password using response model
    response = UserResponse(**user.model_dump())

    print(response)

except ValidationError as e:
    print(e)