import express from 'express';
import cors from 'cors';
import multer from 'multer';
import {} from './configs/db.js';
import login from './controller/loginController.js';
import {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  uploadImage,
} from './controller/patientController.js';
import {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
} from './controller/appointmentController.js';
import { getOwners } from './controller/ownerController.js';
import { getMedications } from './controller/medicationController.js';
import {
  createPrescription,
  getPrescription,
} from './controller/prescriptionController.js';
import {
  createUser,
  getUserDetails,
  getLoggedInUser,
  resetPassword,
  sendForgotPasswordEmail,
  resetPasswordWithToken,
} from './controller/userController.js';

import { getDoctors } from './controller/doctorController.js';
import { paymentWebhook } from './controller/paymentWebHook.js';

import {
  createLabDetails,
  uploadImages,
} from './controller/labReportController.js';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.post('/login', login);

// Patient routes and handlers
app.get('/patients', getPatients);
app.post('/patients', createPatient);
app.get('/patients/:id', getPatient);
app.put('/patients/:id', updatePatient);
app.post('/patients/upload-image', upload.single('image'), uploadImage);

// Appointment routes and handlers
app.get('/appointments', getAppointments);
app.post('/appointments', createAppointment);
app.get('/appointments/:id', getAppointment);
app.put('/appointments/:id', updateAppointment);

// Owner routes and handlers
app.get('/owners', getOwners);

// Medication routes and handlers
app.get('/medications/search', getMedications);

// Prescription routes and handlers
app.post('/prescriptions', createPrescription);
app.get('/prescriptions/:id', getPrescription);

// User routes and handlers
app.post('/user', createUser);
app.get('/user', getUserDetails);
app.get('/user/details', getLoggedInUser);
app.post('/user/resetpassword', resetPassword);
app.post('/forgot-password', sendForgotPasswordEmail);
app.post('/reset-password', resetPasswordWithToken);

//Doctor routes and handlers
app.get('/doctors', getDoctors);

app.post('/lab/createlab', createLabDetails);
app.post('/lab/uploadimages', upload.array('file'), uploadImages);

// let it be here, but I will call it from controller after diagnosis
// app.post('/create-payment-link', processPayment);
app.post(
  '/payment-webhook',
  express.raw({ type: 'application/json' }),
  paymentWebhook
);

app.listen(3001, '0.0.0.0', () => {
  console.log('Server listening on port 3001');
});
