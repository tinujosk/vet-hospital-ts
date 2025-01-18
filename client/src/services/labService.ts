import axios from 'axios';
import { API_URL } from '../constants';

export const uploadImageToCloudinary = async <T>(formData:T):Promise<T> => {
  try {
    const response = await axios.post(`${API_URL}/lab/uploadimages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.data;
  } catch (error: unknown) {
    if(error instanceof Error && 'response' in Error) {
      console.error('Image upload failed:', (error as any).response || error.message);
    }
    throw new Error('Image upload failed');
  }
};

export const createLabDetails = async <T>(labData: T): Promise<T> => {
  try {
    const response = await axios.post(`${API_URL}/lab/createlab`, labData);
    return response.data.data;
  } catch (error:unknown) {
    if(error instanceof Error && 'response' in Error) {
      console.error('Failed to create lab report:', (error as any).response || error.message);
    }
    throw new Error('Failed to create lab report');
  }
};
