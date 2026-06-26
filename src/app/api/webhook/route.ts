import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const stripe = new Stripe(stripeKey);
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook config" }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle checkout completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    const subscriptionId = session.subscription;

    console.log(`🎉 New subscriber: ${customerEmail} (sub: ${subscriptionId})`);

    // In production, store this in a DB (Supabase, Vercel KV, etc.)
    // For now, log it — the user gets access via the in-memory check
  }

  // Handle subscription cancellation
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    console.log(`❌ Cancelled: ${sub.id}`);
  }

  return NextResponse.json({ received: true });
}
