from gtts import gTTS
import os

def text_to_speech(text: str, lang: str, output_dir: str = "static/audio") -> str:
    os.makedirs(output_dir, exist_ok=True)
    tts = gTTS(text=text, lang=lang)
    filename = f"{output_dir}/output.mp3"
    tts.save(filename)
    # return {"url": f"/{output_dir}/{filename}?t={hash(text + lang)}"}

    return filename


#offline
# import pyttsx3

# def text_to_speech(text: str) -> None:
#     engine = pyttsx3.init()
#     engine.say(text)
#     engine.runAndWait()