import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
  {
    labTestBill: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    medicineBill: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    totalBill: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'Online'],
      default: 'Online',
    },
    paymentIntentId: {
      type: String,
    },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
  },
  { timestamps: true }
);

// Middleware to calculate totalBill before saving
PaymentSchema.pre('save', function (next) {
  this.totalBill = this.labTestBill + this.medicineBill;
  next();
});

const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;
