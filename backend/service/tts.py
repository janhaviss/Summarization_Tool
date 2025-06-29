from gtts import gTTS
import os
from typing import Optional
from fastapi import HTTPException

async def generate_speech(
    text: str,
    lang: str = "en",
    output_path: str = "output.mp3",
    speed: float = 1.0
):
    """Generate speech audio file using gTTS"""
    try:
        tts = gTTS(text=text, lang=lang, slow=False)
        
        # Adjust speed by modifying temp file
        temp_path = "temp.mp3"
        tts.save(temp_path)
        
        # Speed adjustment would go here (requires pydub/ffmpeg for premium)
        os.rename(temp_path, output_path)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"TTS generation failed: {str(e)}"
        )