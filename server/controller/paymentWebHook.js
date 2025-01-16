import Stripe from 'stripe';
import Payment from '../model/Payment.js';

const stripe = Stripe(process.env.STRIPE_SECRET);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Webhook endpoint to handle Stripe events
export const paymentWebhook = async (req, res) => {
  // const sig = req.headers['stripe-signature'];
  // console.log({ sig });
  let event = req.body;
  // const buff = await buffer(req);
  // console.log({ buff });
  try {
    // Verify the webhook signature
    // event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const paymentIntent = event.data.object;

      try {
        // Find the Payment document associated with the appointmentId
        const payment = await Payment.findOne({
          paymentIntentId: paymentIntent.payment_link,
        });

        if (!payment) {
          return res
            .status(404)
            .json({ error: 'Payment not found for this appointment.' });
        }

        payment.paymentStatus = 'Completed';
        await payment.save();

        return res.status(200).json({ received: true });
      } catch (error) {
        console.error('Error processing payment intent:', error);
        res.status(500).send('Internal Server Error');
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      console.log(
        `Payment failed for payment intent: ${failedPaymentIntent.id}`
      );
      res.status(200).send({ received: true });
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
      res.status(200).send({ received: true });
  }
};
