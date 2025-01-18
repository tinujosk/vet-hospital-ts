import axios from 'axios';
import { API_URL } from '../constants';

export const createUser = async <T>(userData:T):Promise<T> => {
  try {
    const response = await axios.post(`${API_URL}/user`, userData);
    console.log('User created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserDetails = async <T>():Promise<T> => {
  try {
    const response = await axios.get(`${API_URL}/user`);
    console.log('User data fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

export const fetchLoggedInUserDetails = async <T>(userId:string):Promise<T> => {
  const response = await axios.get(`${API_URL}/user/details`, {
    params: { userId },
  });
  return response.data;
};

export const resetPassword = async <T>(userId:string, newPassword:string):Promise<T> =>{
  console.log('Reset Password Payload:', { userId, newPassword });
  const response = await axios.post(`${API_URL}/user/resetpassword`,{
    userId, 
    newPassword
  });
  return response.data;
}

export const resetPasswordWithToken = async <T>(token:string, newPassword:String):Promise<T> =>{
  console.log('Reset Password Payload:', { token, newPassword });
  const response = await axios.post(`${API_URL}/reset-password`,{
    token, 
    newPassword
  });
  return response.data;
}
