from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    # id: int
    credits: int
    active: bool

    class Config:
        from_attributes = True  # For ORM mode (previously called orm_mode)