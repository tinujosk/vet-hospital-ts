import axios from 'axios';
import { API_URL } from '../constants';

export const getDoctors = async () => {
    try {
      const response = await axios.get(`${API_URL}/doctors`);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  };