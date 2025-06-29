from pydantic import BaseModel, Field

class TranslateRequest(BaseModel):
    """Schema for translation input"""
    text: str = Field(..., min_length=1, example="Text to translate")
    target_lang: str = Field(..., min_length=2, max_length=5, example="es")

class TranslateResponse(BaseModel):
    """Schema for translation output"""
    translation: str
    user: str  # Email of authenticated user