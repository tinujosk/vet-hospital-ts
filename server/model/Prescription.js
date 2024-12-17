import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PrescriptionSchema = Schema(
  {
    notes: String,
    medicalCondition: { type: String, required: true },
    medications: [
      {
        medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication' },
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
        price: Number,
      },
    ],
    labTests: [{ type: String }],
  },
  { timestamps: true }
);

const Prescription = mongoose.model('Prescription', PrescriptionSchema);
export default Prescription;
