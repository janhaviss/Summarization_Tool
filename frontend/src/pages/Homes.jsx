import React from 'react'
import { useState } from 'react'
import { summarizeText, summarizeFile } from '../api/summarizer';
import { useAuth } from '../context/AuthContext';
import Translate from '../components/translator'
import GuestPrompt from '../components/GuestPrompt'; // adjust path
import translateApi from '../api/translator'
import Highlights from '../components/Highlights';
import FeatureSection from '../components/Features';

const MAX_GUEST_TEXT_LENGTH = 5000;


const tones = [
    { code: 'formal', name: 'formal' },
    { code: 'casual', name: 'casual' },
    { code: 'bullet', name: 'bullet' },
]

const Homes = () => {

    const { user } = useAuth();
    const [inputText, setInputText] = useState('')
    const [summary, setSummary] = useState('')
    const [uses, setUses]= useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const [stats, setStats] = useState(null)
    const [error, setError] = useState(null)
    const [targetTone, setTargetTone] = useState('formal');
    const { isAuthenticated } = useAuth();
    const [translate, setTranslate] = useState('')
    const [targetLanguage, setTargetLanguage] = useState('hi');
    const [isTranslating, setIsTranslating] = useState(false);
    const [showCopyToast, setShowCopyToast] = useState(false);
    


    // const [translate, setTranslate] = useState('')

//  ** HANDLING TONE CHANGE
     const handleToneChange = async (toneCode) => {
        setTargetTone(toneCode);
      };

//  ** HANDLING SUMMARIZATION
     const handleSummarize = async () => {
        // setTranslate(''); 
        if (!inputText.trim()) {
          setError('Please enter some text to summarize');
          return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            const result = await summarizeText(inputText, 'transformers', targetTone);
            
            setSummary(result.summary);
            setStats({
            original: inputText.length,
            summary: result.summary.length,
            ratio: Math.round(100 - (result.summary.length/inputText.length)*100)
            });
            setUses(result.remaining_uses);
            
        } catch (error) {
            setError(
            error.response?.data?.detail || 
            error.response?.data?.message || 
            error.message ||
            'Summarization failed'
            );
            console.error('API Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

//  ** HANDLING CLEARING TEXT
      const handleClear = () => {
          setInputText('')
          setSummary('')
          setStats(null)
          setError(null)
      }

//  ** HANDLING FILE
    const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError('');
      const result = await summarizeFile(file);
      setSummary(result.summary);
      setStats({
        original: inputText.length,
        summary: result.summary.length,
        ratio: Math.round(100 - (result.summary.length/inputText.length)*100)
        });
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

// ** HaNDLING CLIPBOARD COPY
  const handleCopy = () => {
  if (!summary) return; // Don't copy if there's no summary
  
  navigator.clipboard.writeText(summary)
    .then(() => {
      // Show success feedback
      //alert('Summary copied to clipboard!');
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 3000); // Hide after 3 sec
    })
    .catch((err) => {
      console.error('Failed to copy:', err);
      alert('Failed to copy text');
    });
};
  
// ** HANDLING TRANSLATION
const handleTranslation = async (lang) => {
    setIsLoading(true);
    setError(null);

    if (!summary) return;
    setIsTranslating(true);   
    try {
          const result = await translateApi.translateText(summary, lang);
          setTranslate(result.translation || result);
    }
    catch (error) {
    setError(
      error.response?.data?.detail || 
      error.response?.data?.message || 
      error.message ||
      'Translation failed'
    );
    console.error('API Error:', error);
  } finally {
    setIsLoading(false);
  }
  };

// HANDLING LANGUAGE CHNAGE
  const handleLanguageChange = async (langCode) => {
  setTargetLanguage(langCode);
  if (summary) {  // Only translate if there's a summary
    await handleTranslation(langCode);
  }
};

  return (
    <div className="min-h-screen bg-[#F9F5FF] py-8 px-4 sm:px-6 lg:px-8">  {/* Main Container */}
        <div className="max-w-6xl mx-auto"> {/* Increased max-width to accommodate side-by-side layout ** DIV 2** */} 
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Text Summarizer</h1>
    
    {error && ( // Error Div
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-red-500">!</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div> // Error div closed
    )}

    {showCopyToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md animate-fade-in-out">
          ✅ Successfully Copied to Clipboard!
        </div>
        )}

    {!isAuthenticated && <GuestPrompt />}

    
    {/* Main content container with flex for side-by-side layout */}
    <div className="flex flex-col md:flex-row gap-6 mb-10"> {/* Stack on mobile, side-by-side on medium screens and up **DIV 3** */}
     
      {/* Input box */}
      <div className="flex-1 bg-[#fff] shadow rounded-lg p-6 pb-0">

        <div className="flex justify-between items-center mt-3 mb-4"> {/* ALIGING LABEL AND TONE BUTTONS */}
        {/* Left Label */}
        <label htmlFor="input-text" className="block text-sm font-medium text-gray-700">
          Enter your text to summarize:
        </label>

        {/* Right: Tone Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Tone:</span>
          {tones.map((tone) => (
            <button
              key={tone.code}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tone.code === targetTone
                  ? 'bg-[#8e7ab5] text-white'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-200'
              }`}
              onClick={() => handleToneChange(tone.code)}
            >
              {tone.name}
            </button>
          ))}
        </div>
      </div> {/* ALIGNING CLOSED */}



        <div className="relative">
          <textarea
            id="input-text"
            className="w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            rows={13}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your article, essay, or any long text here..."
          />
          {/* Character counter - positioned at bottom right */}
          {isAuthenticated ? (null) : (
           <div className="absolute bottom-2 right-2 text-sm bg-white/80 px-2 rounded flex items-center gap-2">
            <span className={inputText.length > MAX_GUEST_TEXT_LENGTH ? 'text-red-600' : 'text-gray-500'}>
              {inputText.length}/{MAX_GUEST_TEXT_LENGTH}
            </span>
          </div>
          )}
        </div>

          {/* DIV FOR Button and Uses for Summarize, Clear */}

          <div className="flex justify-between items-start mt-3 mb-6"> {/* FOR uses and buttons alingment */}
          
          {/* uses - left aligned */}
          <div className="flex-1">
            {isAuthenticated ? (null) : (
          <p className='text-sm text-gray-600 space-y-1 justify-start'>{uses}/ 20 Left</p>
          )}
          </div>
          {/* uses - left aligned closed */}
          

          {/* SUMMARIZE and CLEAR BUTTON RIGHT ALINED */}
          <div className="flex-shrink-0 space-x-4">
            {/* BUTTON FOR SUMMARIZE */}
          <button
            onClick={handleSummarize}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-white font-medium ${
            isLoading ? 'bg-gray-400' : 'bg-[#8e7ab5] hover:bg-[#b784b7]'
            } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
          >
            {isLoading ? (
            <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Summarizing...
            </span>
            ) : 'Summarize'}
          </button>

          {/* Button for clearing */}
          <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
          Clear
          </button>
          </div> {/*buttons right aligned div closed*/}
          </div> {/* uses and BUTTON ALIGNMENT closed */}
          </div> {/* INPUT DIV CLOSED */}



      {/* Output box */}
      <div className="flex-1 bg-[#fff] shadow rounded-lg p-6">
        
        <div className="flex justify-between items-center mt-3 mb-6"> {/* ALIGING LABEL AND copy BUTTONS */}
        {/* Left Label */}
        <label htmlFor="input-text" className="block text-sm  font-medium text-gray-700">
          Summary
        </label>

        {/* Right: Copy Button */}
        <div className="flex items-center gap-2">
          <button
          onClick={handleCopy}
          disabled={!summary}
          className={`text-sm px-3 py-1 rounded ${
            !summary 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-[#8e7ab5] text-white hover:bg-[#b784b7]'
          }`}
        >
          Copy
        </button>
        </div>
      </div> {/* aligment closed*/}


        <div
          id="output-text"
          className={`min-h-[330px] p-3 border border-gray-500 rounded-md ${
            summary ? 'text-gray-800' : 'text-gray-400'
          }`}
        >
          {summary || 'Your summarized text will appear here...'}
        </div>

        <div className="flex justify-between items-start mt-3 mb-6"> {/* FOR STATS BUTTON ALIGNMENT */}
        {/* Stats container - left aligned */}
        <div className="flex-1">
        {stats && (
        <div className="text-sm text-gray-600 space-y-1">
          <p>Original: {stats.original} characters</p>
          <p>Summary: {stats.summary} characters</p>
          <p>Reduction: {stats.ratio}% of original</p>
        </div>
        )}
        </div>
  
      {/* Download button - fixed on right */}
      {isAuthenticated ? (
    <div className="flex-shrink-0">
        <button
          onClick={handleClear}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            isLoading ? 'bg-gray-400' : 'bg-[#8e7ab5] hover:bg-[#b784b7]'
          } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
          >
          download
        </button>
        </div> //*download button closed*/}
      ) : (null) } 
    </div> {/* stats BUTTON ALIGNMENT closed */}
    
      </div> {/* OUTPUT DIV CLOSED */}
     
    </div> {/* DIV 3 CLOSED*/}
 
      


        {isAuthenticated ? (
          <Translate 
          onLanguageChange={handleLanguageChange} 
          translatedText={translate}
          />  
            ): (null)}

    
</div> {/* DIV 2 CLOSED*/} 

<FeatureSection/>
<Highlights/>

</div> //Main Container closed
  )
}

export default Homes