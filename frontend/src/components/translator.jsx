import { useState, useRef, useEffect } from 'react';
import { FaVolumeUp } from 'react-icons/fa';
import textToSpeechApi from '../api/tts'

export default function Translate({ translatedText, targetLanguage, onLanguageChange }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null)


    const languages = [
    { code: 'hi', name: 'Hindi' },
    { code: 'mr', name: 'Marathi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'gu', name: 'Gujarati' },
  ];
 // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

 const handleTextToSpeech = async () => {
  if (!translatedText) return;

  try {
    // Stop previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Generate new audio
    const result = await textToSpeechApi.textToSpeech(translatedText, targetLanguage);
    const audioUrl = `${result.audio_url}?t=${Date.now()}`;
    
    // Create audio element
    audioRef.current = new Audio(audioUrl);
    
    // Optional: Preload audio (helps with autoplay)
    audioRef.current.preload = "auto";
    
    // Play after user interaction
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch((e) => {
        console.error("Playback failed:", e);
        // Fallback: Show a "Click to Play" button
        setShowManualPlayButton(true);
      });

    audioRef.current.onended = () => setIsPlaying(false);

  } catch (err) {
    console.error("TTS Error:", err);
  }
};

  return (
    <div className="w-full bg-white shadow rounded-lg p-4 mb-6">
   <div className="flex items-center flex-wrap gap-4"> {/* Changed to inline flex */}
    <h4 className="text-gray-700">Translate:</h4>
    
    {/* Language buttons */}
    <div className="flex flex-wrap justify-center gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className="px-4 py-2 bg-gray-50 text-gray-500 rounded-md hover:bg-gray-200 transition-colors"
          onClick={() => onLanguageChange(lang.code)}
        >
          {lang.name}
        </button>
      ))}
    </div>
    </div>

        <div className="flex items-center gap-2">
      {translatedText && (
        <div className="flex items-center">
          <span>{translatedText}</span>
          <button
            onClick={handleTextToSpeech}
            className={`ml-2 p-1 ${isPlaying ? 'text-[#8e7ab5]' : 'text-gray-500 hover:text-[#8e7ab5]'}`}
            aria-label={isPlaying ? "Stop audio" : "Play audio"}
          >
            <FaVolumeUp className={isPlaying ? "animate-pulse" : ""} />
          </button>
        </div>
      )}
    </div>
    
    </div>
  );
}