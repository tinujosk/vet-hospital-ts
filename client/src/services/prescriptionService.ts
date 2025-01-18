import axios from 'axios';
import { API_URL } from '../constants';

export const createPrescription = async <T>(prescription:T):Promise<T> => {
  console.log('prescription:', prescription);
  try {
    const response = await axios.post(`${API_URL}/prescriptions`, prescription);
    return response.data;
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw error;
  }
};

export const getPrescription = async <T>(id:string):Promise<T> => {
  try {
    const response = await axios.get(`${API_URL}/prescriptions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching prescription details:', error);
    throw error;
  }
};
