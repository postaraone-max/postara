// C:\dev\postara-clean\pages\checkout.tsx
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

type PlanKey = "free" | "pro";

const PLANS: Record<PlanKey, { name: string; priceLabel: string; priceCents: number; blurb: string }> = {
  free: { name: "Free", priceLabel: "$0", priceCents: 0, blurb: "Get started and test the flow." },
  pro: { name: "Pro", priceLabel: "$5/mo", priceCents: 500, blurb: "For serious creators." },
};

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const planKey: PlanKey = useMemo(() => {
    const raw = (router.query.plan as string)?.toLowerCase();
    return raw === "free" || raw === "pro" ? (raw as PlanKey) : "pro";
  }, [router.query.plan]);

  const plan = PLANS[planKey];

  async function onCheckout() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = (await res.json()) as { url?: string; error?: { message: string } };
      if (!res.ok || !data.url) throw new Error(data?.error?.message || "Checkout failed");
      window.location.href = data.url; // go to Stripe Checkout (or /tool for free)
    } catch (e: any) {
      setErr(e?.message || "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Checkout — {plan.name} | Postara</title>
        <meta name="description" content={`Checkout for ${plan.name} plan on Postara.`} />
      </Head>

      <main className="min-h-screen bg-[#0B0B10] text-white">
        {/* Header */}
        <header className="border-b border-white/10">
          <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-amber-400" />
              <span className="font-semibold">Postara</span>
            </Link>
            <Link href="/tool" className="rounded-xl px-3 py-1.5 bg-white text-black hover:opacity-90 text-sm">
              Open the Caption Tool
            </Link>
          </div>
        </header>

        {/* Checkout Card */}
        <section className="mx-auto max-w-3xl px-6 py-10">
          <div className="border border-white/10 rounded-2xl bg-white/5 p-6">
            <h1 className="text-2xl font-bold">Checkout</h1>
            <p className="mt-2 text-sm text-white/70">
              Secure payment via Stripe. VAT calculated automatically.
            </p>

            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-white/10 bg-black/30 p-5">
                <h2 className="text-lg font-semibold">Plan</h2>
                <p className="mt-1 text-sm text-white/70">{plan.blurb}</p>
                <div className="mt-4">
                  <div className="text-xl font-bold">{plan.name}</div>
                  <div className="text-white/80">{plan.priceLabel}</div>
                </div>

                <div className="mt-6 text-sm">
                  <p>Included:</p>
                  {planKey === "free" ? (
                    <ul className="mt-2 space-y-1 text-white/80">
                      <li>• 5 captions/day</li>
                      <li>• Basic tones</li>
                      <li>• Manual copy/paste</li>
                    </ul>
                  ) : (
                    <ul className="mt-2 space-y-1 text-white/80">
                      <li>• Unlimited AI captions</li>
                      <li>• All tones & platforms</li>
                      <li>• Priority support</li>
                    </ul>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-5">
                <h2 className="text-lg font-semibold">Payment</h2>
                <p className="mt-1 text-sm text-white/70">
                  {planKey === "pro" ? "You will be redirected to Stripe Checkout." : "No payment for Free plan."}
                </p>

                <div className="mt-6">
                  <button
                    onClick={onCheckout}
                    disabled={loading}
                    className={`w-full rounded-xl px-4 py-2 font-medium ${
                      loading ? "bg-white/50 text-black/60 cursor-wait" : "bg-white text-black hover:opacity-90"
                    }`}
                  >
                    {planKey === "pro" ? (loading ? "Redirecting…" : "Complete Purchase →") : "Continue with Free →"}
                  </button>
                  {err && <p className="mt-2 text-sm text-red-300">{err}</p>}
                </div>

                <div className="mt-6 text-sm">
                  <p className="font-medium">Notes</p>
                  <p className="text-white/70">
                    Success redirects to <code className="bg-white/10 px-1 rounded">/success?plan=pro</code>. Cancel returns to this page.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Link href="/?from=checkout#pricing" className="rounded border border-white/20 px-3 py-1.5 text-sm">
                      Back to Pricing
                    </Link>
                    <Link href={`/checkout?plan=${planKey === "free" ? "pro" : "free"}`} className="rounded border border-white/20 px-3 py-1.5 text-sm">
                      Switch to {planKey === "free" ? "Pro" : "Free"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6 text-sm text-white/70">
              <p>
                Selected plan: <span className="font-medium">{plan.name}</span> •{" "}
                <span className="font-medium">{plan.priceLabel}</span>
              </p>
              <p className="mt-1">
                URL param: <code className="rounded bg-white/10 px-1">{`?plan=${planKey}`}</code>
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10">
          <div className="mx-auto max-w-3xl px-6 py-8 text-sm text-white/50">
            © {new Date().getFullYear()} Postara.one
          </div>
        </footer>
      </main>
    </>
  );
}
