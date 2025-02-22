import axios from 'axios';
import { API_URL } from '../constants';

export const createAppointment = async <T>(appointmentData: T): Promise<T> => {
  console.log('Creating appointment:', appointmentData);
  try {
    const response = await axios.post(
      `${API_URL}/appointments`,
      appointmentData
    );
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export const getAppointments = async <T>():Promise<T> => {
  try {
    const response = await axios.get(`${API_URL}/appointments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const getAppointment = async <T>(id:string):Promise<T> => {
  try {
    const response = await axios.get(`${API_URL}/appointments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointment details:', error);
    throw error;
  }
};

export const updateAppointment = async <T>(id:string, updatedData:T): Promise<T> => {
  try {
    const response = await axios.put(
      `${API_URL}/appointments/${id}`,
      updatedData
    );
    console.log('Updated Appointment:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating appointment11:', error);
    throw error;
  }
};
