import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import Payment from '../model/Payment.js';
import Appointment from '../model/Appointment.js';

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stripe = new Stripe(process.env.STRIPE_SECRET);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// export const processPayment = async (req, res) => {
export const processPayment = async paymentDetails => {
  const {
    email,
    labTestBill,
    medicineBill,
    totalBill,
    customerName,
    appointment,
  } = paymentDetails;
  console.log(paymentDetails);
  try {
    // Create a Stripe product and price
    const product = await stripe.products.create({
      name: 'VetClinic Pro Bill',
    });

    const price = await stripe.prices.create({
      unit_amount: totalBill * 100 || 0, // Convert to cents
      currency: 'cad',
      product: product.id,
    });

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
    });

    // update payment with Pending
    const newPayment = new Payment({
      labTestBill,
      medicineBill,
      totalBill,
      appointment,
      paymentIntentId: paymentLink?.id,
    });
    const savedPayment = await newPayment.save();

    await Appointment.findByIdAndUpdate(
      appointment,
      {
        payment: savedPayment._id,
      },
      { new: true }
    );

    const htmlFilePath = path.join(
      __dirname,
      '..',
      'templates',
      'billEmail.html'
    );
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

    const emailHtml = htmlContent
      .replace('{{customerName}}', customerName || 'Customer')
      .replace('{{labTestBill}}', labTestBill?.toFixed(2) || 0)
      .replace('{{medicineBill}}', medicineBill?.toFixed(2) || 0)
      .replace('{{totalAmount}}', totalBill?.toFixed(2) || 0)
      .replace('{{paymentLink}}', paymentLink.url);

    // Send the email with the payment link
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Veterinary Service Bill',
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    // we will trigger from appointment controller, no need to send response.
    // res.status(200).json({
    //   message: 'Payment link sent successfully',
    //   link: paymentLink.url,
    // });
  } catch (error) {
    console.error('Error processing payment:', error.message);
    // we will trigger from appointment controller, no need to send response.
    // res.status(500).json({ error: 'Failed to create and send payment link' });
  }
};
