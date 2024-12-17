import mongoose from 'mongoose';
import Counter from './Counter.js';

const Schema = mongoose.Schema;

const AppointmentSchema = new Schema(
  {
    appointmentId: { type: String, unique: true },
    appointmentDate: { type: String, required: true },
    timeSlot: { type: String, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Pending',
    },
    doctor: { type: Schema.Types.ObjectId, ref: 'Staff' },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient' },
    prescription: {
      type: Schema.Types.ObjectId,
      ref: 'Prescription',
      default: null,
    },
    labreport: { type: Schema.Types.ObjectId, ref: 'LabReport', default: null },
    payment: { type: Schema.Types.ObjectId, ref: 'Payment', default: null },
  },
  { timestamps: true }
);

AppointmentSchema.pre('save', async function (next) {
  if (!this.appointmentId) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'appointmentId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.appointmentId = `VCPRO-A${counter.seq}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

export default Appointment;
