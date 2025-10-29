import apiClient from './client';

// named export... import by exact name
export const forgotPassword = async (email) => { //taking arguments
  try {
    const response = await apiClient.post('/auth/forgot-password', { //GAVE PROPER PATH 
      email
    });
    return response.data;
  } catch (error) {
      console.error('API Error:', error); // <-- this will reveal more

    throw error.response?.data?.detail || 'Forgot password failed';
  }
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
//   const formData = new FormData();
//   formData.append('file', file);
// no need of form data for login because backend expects json data
  
  try {
    const response = await apiClient.post('/auth/reset-password', {
      token, 
      new_password: newPassword, 
      confirm_password :confirmPassword
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Fail to reset password';
  }
};

