import mongoose from 'mongoose';
import Counter from './Counter.js';
const Schema = mongoose.Schema;

const OwnerSchema = new Schema({
  ownerId: { type: String, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  lastUpdated: { type: Date, default: new Date() }
});

// Pre-save hook to generate ownerId
OwnerSchema.pre('save', async function (next) {

  if (!this.ownerId) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'ownerId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.ownerId = `VCPRO-O${counter.seq}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Owner = mongoose.models.Owner || mongoose.model('Owner', OwnerSchema);
export default Owner;
