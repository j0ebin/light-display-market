import { stripe } from '@/lib/stripe';
import type { Request, Response } from 'express';
import {
  handlePaymentIntentSucceeded,
  handlePaymentIntentFailed,
  handleAccountUpdated,
  handlePayoutCreated,
  handlePayoutPaid,
  handlePayoutFailed,
} from './webhook-handler';

export async function handleWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).send('No signature header found');
  }

  try {
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log('Received webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as any);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as any);
        break;

      case 'account.updated':
        await handleAccountUpdated(event.data.object as any);
        break;

      case 'payout.created':
        await handlePayoutCreated(event.data.object as any);
        break;

      case 'payout.paid':
        await handlePayoutPaid(event.data.object as any);
        break;

      case 'payout.failed':
        await handlePayoutFailed(event.data.object as any);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true, type: event.type });
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
} 