import api from './index';

const textToSpeech = async (text, lang) => {
  try {
      const response = await api.post('/tts', {
        text: text,
        lang: lang,
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