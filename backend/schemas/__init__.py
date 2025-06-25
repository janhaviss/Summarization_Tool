from pydantic import BaseModel

class SummaryRequest(BaseModel):
    text: str

class TranslateRequest(BaseModel):
    text: str
    target_lang: str = "es"  # Default to Spanish

class TTSRequest(BaseModel):
    text: str
    lang: str = "en"