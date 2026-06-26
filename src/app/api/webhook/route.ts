import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// In-memory subscription store (resets on deploy — fine for MVP)
// In production, replace with Vercel KV / Supabase / your DB
const subscriptions = new Map<string, { tier: string; expires: number }>();

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey);
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle successful subscription
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email;
    const subId = session.subscription as string;

    if (email) {
      // Store subscription — valid for 30 days from now (Stripe handles renewal)
      subscriptions.set(email, {
        tier: "pro",
        expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
      });
      console.log(`✅ Pro activated: ${email} (sub: ${subId})`);
    }
  }

  // Handle cancellation
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    // In production, look up email from subscription ID
    console.log(`❌ Subscription cancelled: ${sub.id}`);
    // For now, the localStorage expiry handles this
  }

  return NextResponse.json({ received: true });
}

// API endpoint for the frontend to check subscription status
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ tier: "free" });
  }

  const sub = subscriptions.get(email);
  if (sub && sub.expires > Date.now()) {
    return NextResponse.json({ tier: "pro", expires: sub.expires });
  }

  return NextResponse.json({ tier: "free" });
}
