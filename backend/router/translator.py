from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from service.auth import get_current_active_user, get_current_user_optional
from models.user import User
from database import get_db
from service.translator import translate_text
from typing import Optional

router = APIRouter(tags=["Translation"])

# Constants for translation limits
GUEST_CHAR_LIMIT = 500
PREMIUM_CHAR_LIMIT = 5000

@router.get("/languages")
async def get_languages():
    """Get available Indian languages (public endpoint)"""
    languages = [
        {"code": "hi", "name": "Hindi"},
        {"code": "mr", "name": "Marathi"},
        {"code": "bn", "name": "Bengali"},
        {"code": "pa", "name": "Punjabi"},
        {"code": "gu", "name": "Gujarati"},
    ]
    return {"languages": languages}

@router.post("/translate")
async def translate_text_endpoint(
    text: str,
    target_language: str,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Translate text with authentication and limits
    - Guests: limited to 500 characters
    - Authenticated users: limited to 5000 characters
    """
    # Validate input
    if not text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text cannot be empty"
        )

    if len(text) > PREMIUM_CHAR_LIMIT:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Text exceeds maximum length of {PREMIUM_CHAR_LIMIT} characters"
        )

    # Check user status and limits
    if current_user:
        if not current_user.active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is not active"
            )
        
        if current_user.credits <= 0:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Insufficient translation credits"
            )
        
        # Deduct one credit per translation
        current_user.credits -= 1
        db.commit()
    else:
        if len(text) > GUEST_CHAR_LIMIT:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Guest users limited to {GUEST_CHAR_LIMIT} characters. Please login."
            )

    # Perform translation
    try:
        translated_text = translate_text(text, target_language)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Translation failed: {str(e)}"
        )

    # Prepare response
    response = {
        "translation": translated_text,
        "source_language": "auto",
        "target_language": target_language,
        "character_count": len(text),
        "is_guest": current_user is None
    }

    if current_user:
        response.update({
            "remaining_credits": current_user.credits,
            "premium_features": {
                "api_calls_left": current_user.credits,
                "priority_processing": True
            }
        })

    return response 

def normalize_language(lang: str) -> str:
    return language_map.get(lang.lower(), lang)