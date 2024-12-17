import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MedicalHistorySchema = Schema(
  {
    conditionName: String,
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient' },
  },
  { timestamps: true }
);

const MedicalHistory = mongoose.model('MedicalHistory', MedicalHistorySchema);
export default MedicalHistory;
