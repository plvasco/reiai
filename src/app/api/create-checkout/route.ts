import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.error("Missing STRIPE_SECRET_KEY env var");
    return NextResponse.json({ error: "Stripe not configured — missing secret key" }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-03-31" as any });
  const { priceId } = await request.json();

  if (!priceId) {
    return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${request.headers.get("origin") || "https://reiai-mu.vercel.app"}/?success=true`,
      cancel_url: `${request.headers.get("origin") || "https://reiai-mu.vercel.app"}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
