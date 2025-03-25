import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Initialize Stripe
export const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY!);

// Initialize Stripe server instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// Supported currencies with their minimum and maximum amounts
export const SUPPORTED_CURRENCIES = {
  USD: { symbol: '$', min: 0, max: 15000 }, // $150.00
  GBP: { symbol: '£', min: 0, max: 12000 }, // ~£120.00
  EUR: { symbol: '€', min: 0, max: 13500 }, // ~€135.00
  AUD: { symbol: 'A$', min: 0, max: 22500 }, // ~A$225.00
} as const;

// Platform fee percentage (10%)
export const PLATFORM_FEE_PERCENTAGE = 10;

// Minimum payout amount in cents
export const MIN_PAYOUT_AMOUNT = 2000; // $20.00

// Helper function to calculate platform fee
export const calculatePlatformFee = (amount: number): number => {
  return Math.round((amount * PLATFORM_FEE_PERCENTAGE) / 100);
};

// Helper function to format amount based on currency
export const formatAmount = (amount: number, currency: keyof typeof SUPPORTED_CURRENCIES): string => {
  const { symbol } = SUPPORTED_CURRENCIES[currency];
  return `${symbol}${(amount / 100).toFixed(2)}`;
};

// Helper function to validate price
export const validatePrice = (amount: number, currency: keyof typeof SUPPORTED_CURRENCIES): boolean => {
  const { min, max } = SUPPORTED_CURRENCIES[currency];
  return amount >= min && amount <= max;
}; 