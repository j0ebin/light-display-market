import express, { Request, Response } from 'express';
import cors from 'cors';
import asyncHandler from 'express-async-handler';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { createConnectAccount, getConnectAccount, createPaymentIntent } from './api/stripe/connect';
import { handleWebhook } from './api/stripe/webhook';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const app = express();

app.use(cors());
app.use(express.json());

// Create Stripe Connect account
app.post('/api/stripe/connect/account', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;
  const result = await createConnectAccount(userId);
  res.json(result);
}));

// Get Stripe Connect account status
app.get('/api/stripe/connect/account/:userId', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const account = await getConnectAccount(userId);
  res.json(account);
}));

// Create payment intent
app.post('/api/stripe/payment-intent', asyncHandler(async (req: Request, res: Response) => {
  const { amount, currency, sequenceId, buyerId, sellerId } = req.body;
  const result = await createPaymentIntent({
    amount,
    currency,
    sequenceId,
    buyerId,
    sellerId,
  });
  res.json(result);
}));

// Stripe webhook endpoint - uses raw body parser
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 