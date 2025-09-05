// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs"; // required for raw body access

// Read raw body for signature verification
async function getRawBody(req: NextRequest): Promise<Buffer> {
  const text = await req.text();
  return Buffer.from(text);
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!secret || !stripeSecretKey) {
    console.error("Missing STRIPE_WEBHOOK_SECRET or STRIPE_SECRET_KEY");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  try {
    const raw = await getRawBody(req);
    const evt = stripe.webhooks.constructEvent(raw, sig, secret);

    // Handle key events
    switch (evt.type) {
      case "checkout.session.completed": {
        const session = evt.data.object as Stripe.Checkout.Session;
        console.log("checkout.session.completed", {
          id: session.id,
          customer: session.customer,
          subscription: session.subscription,
          email: session.customer_details?.email,
        });
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = evt.data.object as Stripe.Subscription;
        console.log(`subscription event: ${evt.type}`, {
          id: sub.id,
          status: sub.status,
          customer: sub.customer,
          items: sub.items?.data?.map(i => ({ price: i.price?.id })),
        });
        break;
      }
      default:
        console.log("Unhandled event", evt.type);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("webhook error:", err?.message || err);
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
}
