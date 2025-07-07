import apiClient from './client';

const translateText = async (text, targetLang) => {
  try {
    const response = await apiClient.post('api/translate/translate', { text, target_lang: targetLang }); //takes what user has input
    return response.data; //returns response for it
  } catch (error) {
    // Enhanced error handling
    const errorData = {
      status: error.response?.status || 500,
      message: error.response?.data?.detail || 
              error.response?.data?.message || 
              error.message || 
              'Translation Failed'
    };
    throw errorData;
  }
};

export default { translateText };