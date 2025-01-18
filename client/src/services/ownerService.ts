import axios from 'axios';
import { API_URL } from '../constants';

export const getOwners = async () => {
  try {
    const response = await axios.get(`${API_URL}/owners`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Owners:', error);
    throw error;
  }
};
