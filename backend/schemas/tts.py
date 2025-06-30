from pydantic import BaseModel, Field
from typing import Optional

class TTSRequest(BaseModel):
    """Schema for TTS input"""
    text: str = Field(..., min_length=1, max_length=1000, example="Text to speak")
    language: str = Field("en", example="en")
    speed: Optional[float] = Field(1.0, ge=0.5, le=2.0)

class TTSResponse(BaseModel):
    """Schema for TTS output"""
    audio_url: str
    text_length: int
    is_guest: bool
    premium_features: Optional[dict] = None