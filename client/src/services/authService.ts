import axios from 'axios';
import { API_URL } from '../constants';

export const loginUser = async <T>(email:string, password:string):Promise<T> => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const sendForgotPasswordEmail = async <T>(email:string):Promise<T> => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};
