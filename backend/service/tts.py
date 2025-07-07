from gtts import gTTS
import os
import time
from fastapi import HTTPException
import uuid

async def generate_speech(
    text: str,
    lang: str = "en",
    output_path: str = "output.mp3",
    speed: float = 1.0
):
    try:
        # Use a unique temp file to avoid collisions
        temp_path = f"temp_{uuid.uuid4().hex}.mp3"
        tts = gTTS(text=text, lang=lang, slow=False)
        tts.save(temp_path)

        # Wait briefly to ensure the file is flushed
        time.sleep(0.2)

        # Safely remove the old file if it exists
        if os.path.exists(output_path):
            os.remove(output_path)

        os.rename(temp_path, output_path)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"TTS generation failed: {str(e)}"
        )
