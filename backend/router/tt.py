from fastapi import APIRouter, HTTPException
from service.tts import text_to_speech
from schemas import TTSRequest
import os
import time 
router = APIRouter()

@router.post("/tts")
def generate_speech(request: TTSRequest):
    audio_path = text_to_speech(request.text, request.lang)
    if not os.path.exists(audio_path):
        raise HTTPException(status_code=500, detail="TTS failed")
    timestamp = int(time.time())
    return {
            "audio_url": f"/static/audio/output.mp3?t={timestamp}",
            "file_path": audio_path
        }
