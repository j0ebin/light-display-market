
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import Stripe from "https://esm.sh/stripe@12.6.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": 
    "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  sequenceId: string;
  userId: string;
  price: number;
  title: string;
  sellerUserId: string;
  songTitle: string;
  songArtist: string;
  callbackUrl: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create Stripe client
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16", // Update with your preferred API version
    });

    // Get request body
    const { 
      sequenceId, 
      userId, 
      price, 
      title, 
      sellerUserId,
      songTitle,
      songArtist,
      callbackUrl
    }: RequestBody = await req.json();

    // Validate required fields
    if (!sequenceId || !userId || !price || !callbackUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Format price for Stripe (convert to cents)
    const stripeAmount = Math.round(price * 100);

    // Platform fee is 10%
    const platformFeeAmount = Math.round(stripeAmount * 0.1);
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
              description: `${songTitle} by ${songArtist}`,
            },
            unit_amount: stripeAmount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: platformFeeAmount,
        transfer_data: {
          destination: sellerUserId, // Seller's Stripe account ID
        },
      },
      mode: "payment",
      success_url: callbackUrl,
      cancel_url: `${new URL(callbackUrl).origin}/sequence/${sequenceId}`,
      metadata: {
        sequenceId,
        userId,
        sellerUserId,
      },
    });

    // Create a pending purchase record in the database
    const { error: insertError } = await supabase
      .from("purchases")
      .insert({
        user_id: userId,
        sequence_id: sequenceId,
        amount_paid: price,
        seller_id: sellerUserId,
        status: "pending",
        stripe_session_id: session.id,
      });

    if (insertError) {
      console.error("Error creating purchase record:", insertError);
      // Continue with checkout even if DB insert fails
      // We can reconcile later with webhooks
    }

    // Return the Stripe checkout URL
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
