import axios from 'axios';
import { API_URL } from '../constants';
import { type Medicine } from '../types';

export const searchMedication = async (term:string): Promise<Medicine[]> => {
  try {
    const response = await axios.get<Medicine[]>(
      `${API_URL}/medications/search?query=${term}`
    );
    return response.data;
  } catch (error) {
    console.error('Error gettong', error);
    throw error;
  }
};
