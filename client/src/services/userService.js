import axios from 'axios';
import { API_URL } from '../constants';

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/user`, userData);
    console.log('User created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserDetails = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`);
    console.log('User data fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

export const fetchLoggedInUserDetails = async (userId) => {
  const response = await axios.get(`${API_URL}/user/details`, {
    params: { userId },
  });
  return response.data;
};

export const resetPassword = async (userId, newPassword) =>{
  console.log('Reset Password Payload:', { userId, newPassword });
  const response = await axios.post(`${API_URL}/user/resetpassword`,{
    userId, 
    newPassword
  });
  return response.data;
}

export const resetPasswordWithToken = async (token, newPassword) =>{
  console.log('Reset Password Payload:', { token, newPassword });
  const response = await axios.post(`${API_URL}/reset-password`,{
    token, 
    newPassword
  });
  return response.data;
}
