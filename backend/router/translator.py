from fastapi import APIRouter
from service.translator import translate_text
from schemas import TranslateRequest

router = APIRouter()

@router.post("/translate")
def translate(request: TranslateRequest):
    translated = translate_text(request.text, request.target_lang)
    return {"translated_text": translated}