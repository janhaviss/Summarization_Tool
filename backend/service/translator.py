from googletrans import Translator

def translate_text(text: str, target_lang: str = "es") -> str:
    translator = Translator()
    translated = translator.translate(text, dest=target_lang)
    return translated.text