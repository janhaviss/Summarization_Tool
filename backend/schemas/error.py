from pydantic import BaseModel

class HTTPError(BaseModel):
    """Base error response schema"""
    detail: str

    class Config:
        json_schema_extra = {
            "example": {"detail": "Error message here"}
        }

class ValidationError(BaseModel):
    """Schema for 422 validation errors"""
    detail: list[dict[str, str]]