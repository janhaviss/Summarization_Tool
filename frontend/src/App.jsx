import { useState } from 'react'
import Navbar from './components/navbar'

function App() {
  const [inputText, setInputText] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to summarize')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('http://localhost:8000/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setSummary(data.summary)
      setStats({
        original: data.original_length,
        summary: data.summary_length,
        ratio: data.reduction_ratio
      })
    } catch (err) {
      setError(err.message || 'An unknown error occurred')
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setInputText('')
    setSummary('')
    setStats(null)
    setError(null)
  }

  return (
    <div>
    <Navbar />
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"> 
  <div className="max-w-6xl mx-auto"> {/* Increased max-width to accommodate side-by-side layout */}
    <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Text Summarizer</h1>
    
    {error && (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-red-500">!</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    )}
    
    {/* Main content container with flex for side-by-side layout */}
    <div className="flex flex-col md:flex-row gap-6 mb-6"> {/* Stack on mobile, side-by-side on medium screens and up */}
      {/* Input box */}
      <div className="flex-1 bg-white shadow rounded-lg p-6">
        <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 mb-2">
          Enter your text to summarize:
        </label>
        <textarea
          id="input-text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          rows={15}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your article, essay, or any long text here..."
        />
        <div className="flex justify-center space-x-4 mt-3 mb-6">
          {/* Button for Summarize */}
      <button
        onClick={handleSummarize}
        disabled={isLoading}
        className={`px-4 py-2 rounded-md text-white font-medium ${
          isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
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
    </div>
      </div>

      {/* Output box */}
      <div className="flex-1 bg-white shadow rounded-lg p-6">
        <label htmlFor="output-text" className="block text-sm font-medium text-gray-700 mb-2">
          Summary:
        </label>
        <div
          id="output-text"
          className={`min-h-[370px] p-3 border border-gray-300 rounded-md ${
            summary ? 'text-gray-800' : 'text-gray-400'
          }`}
        >
          {summary || 'Your summarized text will appear here...'}
        </div>

        {stats && (
          <div className="mt-4 text-sm text-gray-600 space-y-1">
            <p>Original: {stats.original} characters</p>
            <p>Summary: {stats.summary} characters</p>
            <p>Reduction: {stats.ratio}% of original</p>
          </div>
        )}
      </div>
      
    </div>

    {/* Buttons remain centered below the boxes */}
    
  </div>
</div>

</div> /* root */
  )
}

export default App