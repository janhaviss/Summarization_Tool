import apiClient from './client';

const textToSpeech = async (translatedText, targetLanguage, speed = 1.0) => {
  try {
      const response = await apiClient.post('/api/tts/synthesize', {
  text: translatedText,
  language: targetLanguage,
  speed // optional
      })
    return response.data; //returns response for it

  } catch (error) {
    // Enhanced error handling
    const errorData = {
      status: error.response?.status || 500,
      message: error.response?.data?.detail || 
              error.response?.data?.message || 
              error.message || 
              'Text to Speech Failed'
    };
    throw errorData;
  }
};

export default { textToSpeech };