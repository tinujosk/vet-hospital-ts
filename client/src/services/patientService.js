import axios from 'axios';
import { API_URL } from '../constants';


export const createPatient = async (patientData) => {
  console.log('Creating patient with data:', patientData);
    try {
        const response = await axios.post(`${API_URL}/patients`, patientData);
        return response.data; 
    } catch (error) {
        console.error('Error creating patient:', error);
        throw error; 
    }
};

export const getPatients = async () => {
    try {
        const response = await axios.get(`${API_URL}/patients`);
        return response.data;
    } catch (error) {
        console.error('Error fetching patients:', error);
        throw error;
    }
};

export const getPatientById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/patients/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching patient details:', error);
        throw error;
    }
};
export const updatePatient = async (patientId, updatedPatientData) => {
    try {
      const response = await axios.put(`${API_URL}/patients/${patientId}`, updatedPatientData);  
      return response.data;
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  };
  export const deletePatient = async (patientId) => {
    try {
        const response = await axios.delete(`${API_URL}/patients/${patientId}`);
        return response.data; 
    } catch (error) {
        console.error('Error deleting patient:', error);
        throw error; 
    }
};
export const uploadPatientImage = async (imageFile) => {
  console.log('Uploading patient image:', imageFile);
    try {
      
      const formData = new FormData();
      formData.append('image', imageFile);
  
      const response = await axios.post(`${API_URL}/patients/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.url; // Return the image URL
    } catch (error) {
      console.error('Error uploading patient image:', error);
      throw error;
    }
  };