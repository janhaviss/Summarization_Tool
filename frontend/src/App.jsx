
import { RouterProvider } from 'react-router-dom';
import router from './routes';


export default function App() {
  return (
  <>
  <RouterProvider router={router} />
  </>
  )
}

















// import { useState } from 'react'
// import Navbar from './components/navbar'
// import summarizerApi from './api/summarizer';
// import Translate from './components/translator';
// import translateApi from './api/translator'
// import Footer from './components/footer';
// import { Outlet } from 'react-router-dom';




// function App() {
// // TO CHECK IF AUTHENTICATION IS TRUE OR FALSE
// // Shows login/register buttons when isAuthenticated is false
// // Shows profile dropdown when isAuthenticated is true
//   const [isAuthenticated, setIsAuthenticated] = useState(false)

//   const [inputText, setInputText] = useState('')
//   const [summary, setSummary] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [stats, setStats] = useState(null)
//   const [error, setError] = useState(null)
//   const [translate, setTranslate] = useState('')
//   const [targetLanguage, setTargetLanguage] = useState('hi');
//   const [isTranslating, setIsTranslating] = useState(false);



//   const handleSummarize = async () => {
//     setTranslate(''); 
//   if (!inputText.trim()) {
//     setError('Please enter some text to summarize');
//     return;
//   }

//   setIsLoading(true);
//   setError(null);
  
//   try {
//     const result = await summarizerApi.summarizeText(inputText);
    
//     setSummary(result.summary);
//     setStats({
//       original: inputText.length,
//       summary: result.summary.length,
//       ratio: Math.round(100 - (result.summary.length/inputText.length)*100)
//     });
    
//   } catch (error) {
//     setError(
//       error.response?.data?.detail || 
//       error.response?.data?.message || 
//       error.message ||
//       'Summarization failed'
//     );
//     console.error('API Error:', error);
//   } finally {
//     setIsLoading(false);
//   }
// };

//   const handleClear = () => {
//     setInputText('')
//     setSummary('')
//     setStats(null)
//     setError(null)
//   }

//   const handleTranslation = async () => {
//     setIsLoading(true);
//     setError(null);

//     if (!summary) return;
//     setIsTranslating(true);   
//     try {
//           const result = await translateApi.translateText(summary, targetLanguage);
//           setTranslate(result.translated_text || result);
//     }
//     catch (error) {
//     setError(
//       error.response?.data?.detail || 
//       error.response?.data?.message || 
//       error.message ||
//       'Translation failed'
//     );
//     console.error('API Error:', error);
//   } finally {
//     setIsLoading(false);
//   }
//   };

//   const handleLanguageChange = async (langCode) => {
//   setTargetLanguage(langCode);
//   if (summary) {  // Only translate if there's a summary
//     await handleTranslation();
//   }
// };

//   return (
//     <div> {/* Root Div */}

//       <Navbar isAuthenticated={isAuthenticated} />
//     <div className="min-h-screen bg-[#f5efff] py-8 px-4 sm:px-6 lg:px-8">  {/* Main Container */}
//       <div className="max-w-6xl mx-auto"> {/* Increased max-width to accommodate side-by-side layout ** DIV 2** */} 
//         <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Text Summarizer</h1>
    
//     {error && ( // Error Div
//       <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
//         <div className="flex">
//           <div className="flex-shrink-0">
//             <span className="text-red-500">!</span>
//           </div>
//           <div className="ml-3">
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         </div>
//       </div> // Error div closed
//     )}
    
//     {/* Main content container with flex for side-by-side layout */}
//     <div className="flex flex-col md:flex-row gap-6 mb-6"> {/* Stack on mobile, side-by-side on medium screens and up **DIV 3** */}
//       {/* Input box */}
//       <div className="flex-1 bg-white shadow rounded-lg p-6">
//         <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 mb-2">
//           Enter your text to summarize:
//         </label>
//         <textarea
//           id="input-text"
//           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//           rows={13}
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//           placeholder="Paste your article, essay, or any long text here..."
//         />
//         {/* FOR CENTERING THE BUTTONS */}
//         <div className="flex justify-center space-x-4 mt-3 mb-6">
//           {/* Button for Summarize */}
//           <button
//             onClick={handleSummarize}
//             disabled={isLoading}
//             className={`px-4 py-2 rounded-md text-white font-medium ${
//             isLoading ? 'bg-gray-400' : 'bg-[#8e7ab5] hover:bg-[#b784b7]'
//             } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
//           >
//             {isLoading ? (
//             <span className="flex items-center">
//             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             Summarizing...
//             </span>
//             ) : 'Summarize'}
//           </button>

//           {/* Button for clearing */}

//           <button
//           onClick={handleClear}
//           className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
//           >
//           Clear
//           </button>
//           </div> {/* CENTERING DIV CLOSED */}
//           </div> {/* INPUT DIV CLOSED */}

//       {/* Output box */}
//       <div className="flex-1 bg-white shadow rounded-lg p-6">
//         <label htmlFor="output-text" className="block text-sm font-medium text-gray-700 mb-2">
//           Summary:
//         </label>

//         <div
//           id="output-text"
//           className={`min-h-[335px] p-3 border border-gray-300 rounded-md ${
//             summary ? 'text-gray-800' : 'text-gray-400'
//           }`}
//         >
//           {summary || 'Your summarized text will appear here...'}
//         </div>

//       <div className="flex justify-between items-start mt-3 mb-6"> {/* FOR STATS BUTTON ALIGNMENT */}
//       {/* Stats container - left aligned */}
//       <div className="flex-1">
//       {stats && (
//       <div className="text-sm text-gray-600 space-y-1">
//         <p>Original: {stats.original} characters</p>
//         <p>Summary: {stats.summary} characters</p>
//         <p>Reduction: {stats.ratio}% of original</p>
//       </div>
//       )}
//       </div>
  
//       {/* Download button - fixed on right */}
//     <div className="flex-shrink-0">
//     <button
//       onClick={handleClear}
//       className={`px-4 py-2 rounded-md text-white font-medium ${
//         isLoading ? 'bg-gray-400' : 'bg-[#8e7ab5] hover:bg-[#b784b7]'
//       } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
//       >
//       download
//     </button>
//     </div> {/*download button*/}
//     </div> {/* stats BUTTON ALIGNMENT closed */}
//     <div className="text-sm text-gray-600 space-y-1"><p>You can now get summary in below languages !</p></div>
    
//       </div> {/* OUTPUT DIV CLOSED */}
     
//     </div> {/* DIV 3 CLOSED*/}

// <Translate 
//   onLanguageChange={handleLanguageChange} 
//   translatedText={translate}
// />  

// </div> {/* DIV 2 CLOSED*/} 


// </div> {/*Main Container closed*/}
// <Footer />

// </div> /* Root Div closed*/
//   )
// }

// export default App


// // src/components/AppLayout.jsx (replaces App.jsx)
// // import { Outlet } from 'react-router-dom'
// // import Navbar from './components/navbar'
// // import { useAuth } from './context/AuthContext'

// // export default function AppLayout() {
// //   const { isAuthenticated } = useAuth();

// //   return (
// //     <div className="app">
// //       <Navbar isAuthenticated={isAuthenticated} />
// //       <main>
// //         <Outlet />
// //       </main>
// //     </div>
// //   )
// // }

// src/App.jsx
