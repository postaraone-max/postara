// app/success/page.tsx
export const runtime = "nodejs";

import Stripe from "stripe";
import Link from "next/link";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

type LineInfo = {
  planLabel: string;
  amountLabel: string;
};

async function getSessionInfo(sessionId?: string | null) {
  if (!sessionId) {
    return { ok: false, message: "Missing session_id in URL." };
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"],
    });

    const status = session.payment_status;
    const email = session.customer_details?.email ?? "";
    const line = session.line_items?.data?.[0];

    let info: LineInfo = { planLabel: "Unknown plan", amountLabel: "" };

    if (line) {
      const price = line.price!;
      const product = price.product as Stripe.Product;
      const nickname = price.nickname || (product?.name ?? "Plan");
      const unitAmount = price.unit_amount ?? 0;
      const currency = price.currency?.toUpperCase() ?? "USD";
      info.planLabel = nickname;
      info.amountLabel =
        unitAmount > 0 ? `${(unitAmount / 100).toFixed(2)} ${currency}/mo` : "Free";
    }

    return {
      ok: true,
      status,
      email,
      planLabel: info.planLabel,
      amountLabel: info.amountLabel,
    };
  } catch (e: any) {
    return { ok: false, message: e?.message ?? "Failed to load session." };
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const data = await getSessionInfo(searchParams.session_id);

  if (!data.ok) {
    return (
      <main className="max-w-xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Payment result</h1>
        <p className="text-sm text-red-600">{data.message}</p>
        <div className="flex gap-3">
          <Link className="underline" href="/pricing">Back to Pricing</Link>
          <Link className="underline" href="/">Home</Link>
        </div>
      </main>
    );
  }

  const paid = data.status === "paid";

  return (
    <main className="max-w-xl mx-auto p-6 space-y-5">
      <h1 className="text-3xl font-bold">Payment {paid ? "successful" : "received"}</h1>
      <p className="text-sm text-gray-600">
        {paid ? "Thanks for your purchase." : "Payment status recorded."}
      </p>

      <div className="rounded-2xl border p-4 space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">Plan</span>
          <span>{data.planLabel}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Amount</span>
          <span>{data.amountLabel}</span>
        </div>
        {data.email ? (
          <div className="flex justify-between">
            <span className="font-medium">Receipt email</span>
            <span>{data.email}</span>
          </div>
        ) : null}
      </div>

      <div className="flex gap-3">
        <Link href="/tool" className="px-4 py-2 rounded-xl border hover:bg-gray-50 transition">
          Open the Tool
        </Link>
        <Link href="/pricing" className="px-4 py-2 rounded-xl border hover:bg-gray-50 transition">
          Back to Pricing
        </Link>
      </div>

      <p className="text-xs text-gray-500">© 2025 Postara.one</p>
    </main>
  );
}
