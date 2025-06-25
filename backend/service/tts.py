from gtts import gTTS
import os

def text_to_speech(text: str, lang: str = "en", output_dir: str = "static/audio") -> str:
    os.makedirs(output_dir, exist_ok=True)
    tts = gTTS(text=text, lang=lang)
    filename = f"{output_dir}/output.mp3"
    tts.save(filename)
    return filename


#offline
# import pyttsx3

# def text_to_speech(text: str) -> None:
#     engine = pyttsx3.init()
#     engine.say(text)
#     engine.runAndWait()