
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import Stripe from "https://esm.sh/stripe@12.6.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response(JSON.stringify({ error: "No signature provided" }), {
      status: 400,
    });
  }

  try {
    // Get request body
    const body = await req.text();
    
    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(`Webhook signature verification failed: ${err.message}`, {
        status: 400,
      });
    }

    // Connect to Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        
        // Update purchase status in database
        const { error } = await supabase
          .from("purchases")
          .update({ status: "completed" })
          .eq("stripe_session_id", session.id);

        if (error) {
          console.error("Error updating purchase status:", error);
          throw error;
        }

        console.log(`Payment for session ${session.id} was successful!`);
        break;
      }
      
      case "checkout.session.expired": {
        const session = event.data.object;
        
        // Update purchase status in database
        const { error } = await supabase
          .from("purchases")
          .update({ status: "expired" })
          .eq("stripe_session_id", session.id);

        if (error) {
          console.error("Error updating purchase status:", error);
          throw error;
        }

        console.log(`Session ${session.id} expired`);
        break;
      }
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
    });
  } catch (err) {
    console.error(`Error processing webhook: ${err.message}`);
    return new Response(`Webhook error: ${err.message}`, {
      status: 500,
    });
  }
});
