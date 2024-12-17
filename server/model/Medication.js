import mongoose from 'mongoose';
import Counter from './Counter.js';
import medicationsData from '../configs/medicationsData.js';

const Schema = mongoose.Schema;

const MedicationSchema = new Schema(
  {
    medicationId: { type: String, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    dosageForm: { type: String, required: true },
    manufacturer: { type: String, required: true },
    strength: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

MedicationSchema.pre('save', async function (next) {
  if (!this.medicationId) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'medicationId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.medicationId = `MED${counter.seq}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Medication = mongoose.model('Medication', MedicationSchema);

async function seedDatabase() {
  try {
    await Medication.deleteMany({});
    await Medication.insertMany(medicationsData);
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seedDatabase();

export default Medication;
