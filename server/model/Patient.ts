import mongoose from 'mongoose';
import Counter from './Counter.js';



const Schema = mongoose.Schema;

const PatientSchema = new Schema(
  {
    patientId: { type: String, unique: true },
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    image: { type: String },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    weight: { type: Number, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'Owner' },
  },
  { timestamps: true }
);

PatientSchema.pre('save', async function (next) {
  if (!this.patientId) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'patientId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.patientId = `VCPRO-P${counter.seq}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Patient = mongoose.model('Patient', PatientSchema);
export default Patient;
