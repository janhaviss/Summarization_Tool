import api from './index';

const summarizeText = async (text) => {
  try {
    const response = await api.post('/summarize', { text }); //takes what user has input
    return response.data; //returns response for it
  } catch (error) {
    // Enhanced error handling
    const errorData = {
      status: error.response?.status || 500,
      message: error.response?.data?.detail || 
              error.response?.data?.message || 
              error.message || 
              'Summarization failed'
    };
    throw errorData;
  }
};

export default { summarizeText };