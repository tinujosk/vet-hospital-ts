import mongoose from 'mongoose';

const labReportSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: { type: String, required: true },
  images: [
    {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
  ],
  testType: { type: String, required: true },
  technician: { type: String, required: true },
  datePerformed: { type: Date, required: true },
  generalObservations: { type: String },
  medicalFindings: { type: String },
  recommendedFollowUp: { type: String },
  pdfPath: String,
  status: { type: String, default: 'Completed', enum: ['Pending', 'Completed'] },
});

export default mongoose.model('LabReport', labReportSchema);
