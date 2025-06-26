from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from service.auth import get_current_active_user, get_current_user_optional
from service.tts import generate_speech
from models.user import User
from database import get_db
from schemas.tts import TTSRequest, TTSResponse
import os
from typing import Optional

router = APIRouter(tags=["Text-to-Speech"])
AUDIO_DIR = "static/audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

# Constants for limits
GUEST_CHAR_LIMIT = 300
PREMIUM_CHAR_LIMIT = 5000

@router.post("/synthesize", response_model=TTSResponse)
async def synthesize_speech(
    request: Request,
    tts_request: TTSRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Convert text to speech with authentication and limits"""
    # Check character limits
    text_length = len(tts_request.text)
    
    if current_user is None:  # Guest user
        if text_length > GUEST_CHAR_LIMIT:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Guest users limited to {GUEST_CHAR_LIMIT} characters. Please login."
            )
    else:  # Authenticated user
        if text_length > PREMIUM_CHAR_LIMIT:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Maximum {PREMIUM_CHAR_LIMIT} characters allowed per request"
            )
        
        # Deduct credits if needed
        if current_user.credits <= 0:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Insufficient credits"
            )
        current_user.credits -= 1
        db.commit()

    # Generate audio file
    filename = f"tts_{hash(tts_request.text)}.mp3"
    filepath = os.path.join(AUDIO_DIR, filename)
    
    await generate_speech(
        text=tts_request.text,
        lang=tts_request.language,
        output_path=filepath,
        speed=tts_request.speed
    )
    
    # Prepare response
    response = TTSResponse(
        audio_url=f"/audio/{filename}",
        text_length=text_length,
        is_guest=current_user is None
    )
    
    if current_user:  # Add premium features
        response.premium_features = {
            "voice_options": ["male", "female", "neutral"],
            "high_quality": True,
            "remaining_credits": current_user.credits
        }
    
    return response

@router.get("/audio/{filename}")
async def get_audio_file(
    filename: str,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Serve generated audio files (public access)"""
    filepath = os.path.join(AUDIO_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audio file not found"
        )
    return FileResponse(
        path=filepath,
        media_type="audio/mpeg",
        filename=filename  # Helps with downloads
    )