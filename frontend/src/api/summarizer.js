import apiClient from './client';

// named export... import by exact name
export const summarizeText = async (text, method, tone) => { //taking arguments
  try {
    const response = await apiClient.post('/api/summarize/text', { //GAVE PROPER PATH 
      text,
      method,
      tone,
    });
    return response.data;
  } catch (error) {
      console.error('API Error:', error); // <-- this will reveal more

    throw error.response?.data?.detail || 'Summarization failed';
  }
};

export const summarizeFile = async (file, method = 'transformers') => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await apiClient.post('/api/summarize/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'File summarization failed';
  }
};

