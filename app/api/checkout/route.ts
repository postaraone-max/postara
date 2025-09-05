// app/api/checkout/route.ts
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const secretKey = process.env.STRIPE_SECRET_KEY ?? "";
const pricePro = process.env.STRIPE_PRICE_PRO ?? "";

if (!secretKey) console.error("Missing STRIPE_SECRET_KEY");
if (!pricePro) console.error("Missing STRIPE_PRICE_PRO");

const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });

function keyModeFromSecret(sk: string): "test" | "live" | "unknown" {
  if (sk.startsWith("sk_test_")) return "test";
  if (sk.startsWith("sk_live_")) return "live";
  return "unknown";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const plan = searchParams.get("plan") || "pro";

    if (!secretKey || !pricePro) {
      return NextResponse.json(
        { error: "config_error", detail: "Missing Stripe env vars" },
        { status: 500 }
      );
    }

    const mode = keyModeFromSecret(secretKey);
    if (mode === "unknown") {
      return NextResponse.json(
        { error: "stripe_key_invalid", detail: "Secret key must start with sk_test_ or sk_live_" },
        { status: 400 }
      );
    }

    if (plan !== "pro") {
      return NextResponse.json(
        { error: "unknown_plan", detail: `Unsupported plan: ${plan}` },
        { status: 400 }
      );
    }

    // Derive origin from the incoming request (e.g., https://postara-xxxx.vercel.app)
    const origin = new URL(req.url).origin; // robust on localhost and Vercel

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: pricePro, quantity: 1 }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      allow_promotion_codes: true,
    });

    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (err: any) {
    const detail =
      err?.raw?.message ||
      err?.message ||
      "Unknown error creating Stripe Checkout session";
    console.error("checkout_failed:", detail);
    return NextResponse.json(
      { error: "checkout_failed", detail },
      { status: 500 }
    );
  }
}
