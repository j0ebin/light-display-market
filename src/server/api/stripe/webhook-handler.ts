import type Stripe from 'stripe';
import { prisma } from '@/lib/db';

type AccountStatus = 'pending' | 'active';
type PayoutStatus = 'pending' | 'paid' | 'failed';

export async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing successful payment:', paymentIntent.id);
  
  // Find the order
  const order = await prisma.order.findUnique({
    where: { paymentIntentId: paymentIntent.id },
  });

  if (!order) {
    console.error('Order not found for payment intent:', paymentIntent.id);
    return;
  }

  // Update the order status
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: 'paid',
      paidAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

export async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing failed payment:', paymentIntent.id);
  
  // Find the order
  const order = await prisma.order.findUnique({
    where: { paymentIntentId: paymentIntent.id },
  });

  if (!order) {
    console.error('Order not found for payment intent:', paymentIntent.id);
    return;
  }

  // Update the order status
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: 'failed',
      lastError: paymentIntent.last_payment_error?.message,
      updatedAt: new Date(),
    },
  });
}

export async function handleAccountUpdated(account: Stripe.Account) {
  console.log('Processing account update:', account.id);
  
  // Find the user
  const user = await prisma.user.findUnique({
    where: { stripeAccountId: account.id },
  });

  if (!user) {
    console.error('User not found for Stripe account:', account.id);
    return;
  }

  const accountStatus: AccountStatus = account.charges_enabled ? 'active' : 'pending';

  // Update the user's Stripe account status
  await prisma.user.update({
    where: { id: user.id },
    data: {
      stripeAccountStatus: accountStatus,
      stripeAccountDetailsSubmitted: account.details_submitted,
      updatedAt: new Date(),
    },
  });
}

export async function handlePayoutCreated(payout: Stripe.Payout) {
  console.log('Processing payout created:', payout.id);
  
  // Record the payout
  await prisma.payout.create({
    data: {
      id: payout.id,
      userId: payout.metadata.userId,
      amount: payout.amount,
      currency: payout.currency,
      status: payout.status as PayoutStatus,
      createdAt: new Date(payout.created * 1000),
      updatedAt: new Date(),
    },
  });
}

export async function handlePayoutPaid(payout: Stripe.Payout) {
  console.log('Processing payout paid:', payout.id);
  
  // Update the payout status
  await prisma.payout.update({
    where: { id: payout.id },
    data: {
      status: 'paid',
      paidAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

export async function handlePayoutFailed(payout: Stripe.Payout) {
  console.log('Processing payout failed:', payout.id);
  
  // Update the payout status
  await prisma.payout.update({
    where: { id: payout.id },
    data: {
      status: 'failed',
      failureMessage: payout.failure_message,
      failureCode: payout.failure_code,
      updatedAt: new Date(),
    },
  });
} 