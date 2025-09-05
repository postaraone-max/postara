// app/pricing/page.tsx
import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold">Simple, honest pricing</h1>
          <p className="text-sm text-gray-600 mt-2">
            Choose Free to try, or Pro for unlimited captions.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Free */}
          <div className="border rounded-2xl p-6">
            <h2 className="text-xl font-semibold">Free</h2>
            <p className="text-3xl font-bold mt-2">$0</p>
            <ul className="mt-4 text-sm list-disc list-inside space-y-1 text-gray-700">
              <li>5 captions per day</li>
              <li>Basic tones</li>
              <li>Manual copy/paste</li>
            </ul>
            <Link
              href="/"
              className="inline-block mt-6 px-4 py-2 rounded-xl border hover:bg-gray-50 transition"
            >
              Home
            </Link>
          </div>

          {/* Pro */}
          <div className="border rounded-2xl p-6">
            <h2 className="text-xl font-semibold">Pro</h2>
            <p className="text-3xl font-bold mt-2">
              $5<span className="text-base font-medium"> / mo</span>
            </p>
            <ul className="mt-4 text-sm list-disc list-inside space-y-1 text-gray-700">
              <li>Unlimited AI captions</li>
              <li>All tones + updates</li>
              <li>Priority improvements</li>
            </ul>
            <a
              href="/api/checkout?plan=pro"
              className="inline-block mt-6 px-4 py-2 rounded-xl border hover:bg-gray-50 transition"
            >
              Go Pro
            </a>
          </div>
        </div>

        {/* Cancel demo link */}
        <div className="mt-6 text-sm text-gray-500">
          <a href="/cancel" className="underline">Cancel and return</a>
        </div>

        <footer className="mt-10 text-xs text-gray-500">
          © 2025 Postara.one
        </footer>
      </div>
    </main>
  );
}
