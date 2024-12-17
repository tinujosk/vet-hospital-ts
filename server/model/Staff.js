import mongoose from 'mongoose';
import Counter from './Counter.js';

const Schema = mongoose.Schema;

const StaffSchema = new Schema(
  {
    staffId: { type: String, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    specialization: { type: String, required: true },
    phone: { type: Number, required: true },
    email: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

StaffSchema.pre('save', async function (next) {
  if (!this.staffId) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'staffId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.staffId = `VCPRO-S${counter.seq}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Staff = mongoose.model('Staff', StaffSchema);

export default Staff;
