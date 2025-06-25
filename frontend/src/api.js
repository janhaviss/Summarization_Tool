import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000'
});

export const getHello = async () => {
  try {
    const response = await api.get('/api/hello');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};