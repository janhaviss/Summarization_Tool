import { useState, useRef, useEffect } from 'react';
import { FaVolumeUp } from 'react-icons/fa';
import textToSpeechApi from '../api/tts'

export default function Translate({ translatedText, targetLanguage, onLanguageChange }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false);

    const languages = [
    { code: 'hi', name: 'Hindi' },
    { code: 'mr', name: 'Marathi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'gu', name: 'Gujarati' },
  ];

console.log("Translated Text:", translatedText);

 

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
  setError(null);
  setLoading(true);

  try {
    // Stop previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

     // Generate new audio
      const result = await textToSpeechApi.textToSpeech(translatedText, targetLanguage);
      const audioUrl = `http://localhost:8000${result.audio_url}?t=${Date.now()}`;
      console.log("Audio URL:", audioUrl);

    
     // Create audio element
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
        console.error('TTS Error:', err);
        setError(err.message || 'Failed to play audio');
    } finally {
        setLoading(false);
          }
        };

  return (
    <>
    <h1 className="text-3xl font-bold text-center text-gray-900 mb-5">Translate Your Summary</h1>
    <div className="w-full bg-white shadow rounded-lg p-4 mb-6">
   <div className="flex items-center flex-wrap gap-4 p-2"> {/* Changed to inline flex */}
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
        <div className="flex border border-gray-200 p-2 items-center">
          <span>{translatedText}</span>


          {/* Volume Icon with Prompt */}
    <div className="relative ml-2">
      {/* Floating Prompt */}
      <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-10 bg-black text-white text-sm px-3 py-1 rounded-lg shadow-lg whitespace-nowrap">
        Click to hear
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45 mt-[-2px]"></div>
      </div>

          <button
            onClick={handleTextToSpeech}
            className={`ml-2 p-1 rounded-full ${isPlaying ? 'text-[#8e7ab5]' : 'text-gray-500 hover:text-[#8e7ab5]'}`}
            aria-label="Play audio"
          >
            <FaVolumeUp className={isPlaying ? "animate-pulse" : ""} />
          </button>
        </div>
        </div>
      )}
    </div>

    {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}
    
    </div>
    </>
  );
  
}