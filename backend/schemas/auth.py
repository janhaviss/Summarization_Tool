from pydantic import BaseModel, EmailStr, Field, field_validator, SecretStr

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    credits: int
    active: bool

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: str | None = None
    password: str | None = None


class Token(BaseModel):
    access_token: str
    token_type: str
   

class TokenData(BaseModel):
    email: str | None = None


class PasswordResetRequest(BaseModel):
    email: EmailStr
    # class Config:
    #     json_schema_extra = {
    #         "example": {
    #             "email": "user@example.com"
    #         }
    #     }


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: SecretStr
    confirm_password: SecretStr

    @field_validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'new_password' in values.data and v != values.data['new_password']:
            raise ValueError("Passwords don't match")
        return v

# class PasswordResetConfirm(BaseModel):
#     token: str = Field(..., description="Reset token from email link")
#     new_password: str = Field(..., min_length=8, max_length=100)
#     confirm_password: str = Field(..., min_length=8, max_length=100)

#     @field_validator('new_password')
#     def validate_password_strength(cls, v):
#         if len(v) < 8:
#             raise ValueError("Password must be at least 8 characters")
#         if not any(c.isdigit() for c in v):
#             raise ValueError("Password must contain at least one number")
#         if not any(c.isupper() for c in v):
#             raise ValueError("Password must contain at least one uppercase letter")
#         return v

#     @field_validator('confirm_password')
#     def passwords_match(cls, v, values):
#         if 'new_password' in values and v != values['new_password']:
#             raise ValueError("Passwords do not match")
#         return v

#     class Config:
#         json_schema_extra = {
#             "example": {
#                 "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#                 "new_password": "NewSecurePassword123!",
#                 "confirm_password": "NewSecurePassword123!"
#             }
#         }