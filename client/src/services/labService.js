import axios from 'axios';
import { API_URL } from '../constants';

export const uploadImageToCloudinary = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/lab/uploadimages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.data;
  } catch (error) {
    console.error('Image upload failed:', error.response || error.message);
    throw new Error('Image upload failed');
  }
};

export const createLabDetails = async (labData) => {
  try {
    const response = await axios.post(`${API_URL}/lab/createlab`, labData);
    return response.data.data;
  } catch (error) {
    console.error('Failed to create lab report:', error.response || error.message);
    throw new Error('Failed to create lab report');
  }
};
