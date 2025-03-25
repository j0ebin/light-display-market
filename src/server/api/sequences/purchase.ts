import { prisma } from '@/lib/db';
import { nanoid } from 'nanoid';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
});

export type CreateSequencePaymentIntentRequest = {
  sequenceIds: string[];
  userId: string;
};

export type CreateSequencePaymentIntentResponse = {
  clientSecret: string;
  orderId: string;
};

export async function createSequencePaymentIntent(
  req: CreateSequencePaymentIntentRequest
): Promise<CreateSequencePaymentIntentResponse> {
  // Get sequences from database
  const selectedSequences = await prisma.sequence.findMany({
    where: {
      id: req.sequenceIds[0],
    },
  });

  if (selectedSequences.length === 0) {
    throw new Error('No sequences found');
  }

  // Calculate total amount
  const totalAmount = selectedSequences.reduce((sum, seq) => sum + seq.price, 0);

  // Create order record
  const orderId = nanoid();
  await prisma.order.create({
    data: {
      id: orderId,
      userId: req.userId,
      amount: totalAmount,
      currency: 'USD',
      status: 'pending',
    },
  });

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount,
    currency: 'USD',
    metadata: {
      orderId,
      userId: req.userId,
      sequenceIds: req.sequenceIds.join(','),
    },
  });

  // Update order with payment intent ID
  await prisma.order.update({
    where: { id: orderId },
    data: { paymentIntentId: paymentIntent.id },
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    orderId,
  };
}

export type RecordSequencePurchaseRequest = {
  orderId: string;
  userId: string;
  sequenceIds: string[];
};

export async function recordSequencePurchase(
  req: RecordSequencePurchaseRequest
): Promise<void> {
  // Create sequence purchase records
  const purchases = req.sequenceIds.map((sequenceId) => ({
    id: nanoid(),
    userId: req.userId,
    sequenceId: sequenceId,
    orderId: req.orderId,
    downloadCount: 0,
  }));

  await prisma.sequencePurchase.createMany({
    data: purchases,
  });
}

export type GetUserPurchasesResponse = {
  purchases: Array<{
    id: string;
    sequenceId: string;
    sequenceName: string;
    downloadCount: number;
    purchaseDate: Date;
  }>;
};

export async function getUserPurchases(userId: string): Promise<GetUserPurchasesResponse> {
  const purchases = await prisma.sequencePurchase.findMany({
    where: { userId },
    select: {
      id: true,
      sequenceId: true,
      sequence: {
        select: {
          name: true,
        },
      },
      downloadCount: true,
      createdAt: true,
    },
  });

  return {
    purchases: purchases.map((purchase) => ({
      id: purchase.id,
      sequenceId: purchase.sequenceId,
      sequenceName: purchase.sequence.name,
      downloadCount: purchase.downloadCount,
      purchaseDate: purchase.createdAt,
    })),
  };
}

export type IncrementDownloadCountRequest = {
  purchaseId: string;
  userId: string;
};

export async function incrementDownloadCount(
  req: IncrementDownloadCountRequest
): Promise<void> {
  await prisma.sequencePurchase.update({
    where: { id: req.purchaseId },
    data: {
      downloadCount: {
        increment: 1,
      },
    },
  });
} 