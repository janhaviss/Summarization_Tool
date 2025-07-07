import apiClient from './client';

// named export... import by exact name
export const register = async (email, name, password) => { //taking arguments
  try {
    const response = await apiClient.post('/auth/register', { //GAVE PROPER PATH 
      email,
      name,
      password,
    });
    return response.data;
  } catch (error) {
      console.error('API Error:', error); // <-- this will reveal more

    throw error.response?.data?.detail || 'Registration failed';
  }
};

export const login = async (email, password) => {
//   const formData = new FormData();
//   formData.append('file', file);
// no need of form data for login because backend expects json data
  
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Login Failed';
  }
};

