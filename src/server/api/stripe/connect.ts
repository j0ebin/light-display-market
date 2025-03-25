import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export async function createConnectAccount(userId: string) {
  try {
    // Create a Stripe Connect account
    const account = await stripe.accounts.create({
      type: 'standard',
      metadata: {
        userId,
      },
    });

    // Create an account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.VITE_APP_URL}/account/connect/refresh`,
      return_url: `${process.env.VITE_APP_URL}/account/connect/complete`,
      type: 'account_onboarding',
    });

    // Store the account info in Supabase
    await supabase
      .from('stripe_accounts')
      .insert({
        user_id: userId,
        stripe_account_id: account.id,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
      });

    return { accountLink: accountLink.url };
  } catch (error) {
    console.error('Error creating Connect account:', error);
    throw error;
  }
}

export async function getConnectAccount(userId: string) {
  try {
    // Get the Stripe account ID from Supabase
    const { data: accountData, error: dbError } = await supabase
      .from('stripe_accounts')
      .select('stripe_account_id, charges_enabled, payouts_enabled')
      .eq('user_id', userId)
      .single();

    if (dbError) throw dbError;
    if (!accountData) return null;

    // Get the account details from Stripe
    const account = await stripe.accounts.retrieve(accountData.stripe_account_id);

    return {
      id: account.id,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      requirements: account.requirements,
    };
  } catch (error) {
    console.error('Error getting Connect account:', error);
    throw error;
  }
}

export async function createPaymentIntent({
  amount,
  currency,
  sequenceId,
  buyerId,
  sellerId,
}: {
  amount: number;
  currency: string;
  sequenceId: string;
  buyerId: string;
  sellerId: string;
}) {
  try {
    // Get the seller's Stripe account
    const { data: sellerAccount, error: dbError } = await supabase
      .from('stripe_accounts')
      .select('stripe_account_id')
      .eq('user_id', sellerId)
      .single();

    if (dbError) throw dbError;
    if (!sellerAccount) throw new Error('Seller not connected to Stripe');

    // Calculate platform fee (10%)
    const applicationFee = Math.round(amount * 0.1);

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      application_fee_amount: applicationFee,
      transfer_data: {
        destination: sellerAccount.stripe_account_id,
      },
      metadata: {
        sequenceId,
        buyerId,
        sellerId,
      },
    });

    // Store the transaction in Supabase
    await supabase.from('stripe_transactions').insert({
      stripe_payment_intent_id: paymentIntent.id,
      buyer_id: buyerId,
      seller_id: sellerId,
      sequence_id: sequenceId,
      amount,
      platform_fee: applicationFee,
      currency,
      status: paymentIntent.status,
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
} 