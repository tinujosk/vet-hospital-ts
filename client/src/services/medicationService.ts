import axios from 'axios';
import { API_URL } from '../constants';

export const searchMedication = async <T>(term:T): Promise<T> => {
  try {
    const response = await axios.get(
      `${API_URL}/medications/search?query=${term}`
    );
    return response.data;
  } catch (error) {
    console.error('Error gettong', error);
    throw error;
  }
};
