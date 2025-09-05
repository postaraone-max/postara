import Link from "next/link";
import Image from "next/image";

const styles = {
  container: { maxWidth: 1100, margin: "0 auto", padding: "16px" },
  h1: {
    fontSize: "clamp(2rem, 6vw, 3.2rem)",
    fontWeight: 800 as const,
    color: "#111",
    lineHeight: 1.15,
    margin: "0 0 12px 0",
  },
  h2: {
    fontSize: "clamp(1.6rem, 5vw, 2.5rem)",
    fontWeight: 800 as const,
    color: "#111",
    margin: "0 0 16px 0",
    textAlign: "center" as const,
  },
  pLead: {
    fontSize: "clamp(1.05rem, 3.2vw, 1.25rem)",
    color: "#555",
    margin: "0 auto 24px auto",
    maxWidth: 800,
    textAlign: "center" as const,
  },
  card: {
    padding: 16,
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
  },
  ctaPrimary: {
    display: "inline-block",
    padding: "14px 22px",
    borderRadius: 999,
    background:
      "linear-gradient(90deg, rgba(108,71,255,1) 0%, rgba(59,130,246,1) 100%)",
    color: "#fff",
    fontWeight: 700,
    textDecoration: "none",
  },
  ctaSecondary: {
    display: "inline-block",
    padding: "14px 22px",
    borderRadius: 999,
    border: "1px solid #ddd",
    color: "#333",
    fontWeight: 700,
    textDecoration: "none",
  },
  heroGradientWord: {
    background:
      "linear-gradient(90deg, rgba(108,71,255,1) 0%, rgba(59,130,246,1) 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  } as React.CSSProperties,
};

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Top Navigation */}
      <header>
        <div
          style={{
            ...styles.container,
            paddingTop: 20,
            paddingBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: ONLY the image logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Image
              src="/postara-logo.jpg"
              alt="Postara Logo"
              width={140}
              height={42}
              style={{ height: "auto", display: "block" }}
            />
          </div>

          {/* Right: Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <a href="#features" style={{ fontWeight: 600, color: "#111" }}>
              Features
            </a>
            <a href="#pricing" style={{ fontWeight: 600, color: "#111" }}>
              Pricing
            </a>
            <Link
              href="/tool"
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: "#111",
                color: "#fff",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Try It Free
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: "56px 16px", textAlign: "center" }}>
        <div style={styles.container}>
          <h1 style={styles.h1}>
            One Click. <span style={styles.heroGradientWord}>Post Everywhere.</span>
          </h1>
          <p style={styles.pLead}>
            Create and post captions, ads, and promotions to TikTok, Instagram,
            Facebook, Shopify, Amazon, and more — all from one simple dashboard.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/tool" style={styles.ctaPrimary}>
              Try It Free
            </Link>
            <a href="#demo" style={styles.ctaSecondary}>
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Platform Logos (use real icons) */}
      <section style={{ background: "#f7f7f8", padding: "28px 16px" }}>
        <div style={styles.container}>
          <p
            style={{
              textAlign: "center",
              color: "#666",
              margin: "0 0 18px 0",
            }}
          >
            Trusted by creators, brands, and campaigns
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.95,
            }}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/3046/3046120.png" alt="TikTok" width={40} height={40} />
            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width={40} height={40} />
            <img src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png" alt="Facebook" width={40} height={40} />
            <img src="https://cdn-icons-png.flaticon.com/512/5968/5968871.png" alt="Shopify" width={40} height={40} />
            <img src="https://cdn-icons-png.flaticon.com/512/5968/5968913.png" alt="Etsy" width={40} height={40} />
            <img src="https://cdn-icons-png.flaticon.com/512/5968/5968910.png" alt="Amazon" width={40} height={40} />
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section style={{ padding: "64px 16px" }}>
        <div style={{ ...styles.container }}>
          <h2 style={styles.h2}>Built for Everyone</h2>
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              marginTop: 24,
            }}
          >
            <div style={styles.card}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 8px 0" }}>
                For E-Commerce
              </h3>
              <p style={{ color: "#555" }}>
                Sell more, promote new products, and reach buyers on every platform — from one dashboard.
              </p>
            </div>
            <div style={styles.card}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 8px 0" }}>
                For Creators & Teams
              </h3>
              <p style={{ color: "#555" }}>
                Go viral with AI-generated posts and seamless multi-platform scheduling.
              </p>
            </div>
            <div style={styles.card}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 8px 0" }}>
                For Campaigns
              </h3>
              <p style={{ color: "#555" }}>
                Reach voters, amplify messages, and automate ads — one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ background: "#f7f7f8", padding: "64px 16px" }}>
        <div style={styles.container}>
          <h2 style={styles.h2}>Powerful Features</h2>
          <div style={{ display: "grid", gap: 16, maxWidth: 900, margin: "0 auto" }}>
            <div style={{ ...styles.card, padding: 18 }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 6px 0" }}>AI-Generated Captions</h3>
              <p style={{ color: "#555" }}>Get 5 perfect captions in seconds — funny, professional, or inspirational.</p>
            </div>
            <div style={{ ...styles.card, padding: 18 }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 6px 0" }}>One-Click Posting</h3>
              <p style={{ color: "#555" }}>Post to TikTok, Instagram, and more — no switching apps.</p>
            </div>
            <div style={{ ...styles.card, padding: 18 }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 6px 0" }}>Scheduling & Analytics</h3>
              <p style={{ color: "#555" }}>Plan posts and track performance from one dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" style={{ padding: "64px 16px", textAlign: "center" }}>
        <div style={styles.container}>
          <h2 style={styles.h2}>See Postara in Action</h2>
          <p style={styles.pLead}>Watch how easy it is to post everywhere in one click.</p>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <img
              src="https://placehold.co/900x420/6366f1/ffffff?text=Postara+Demo"
              alt="Postara Demo"
              style={{ width: "100%", borderRadius: 14, boxShadow: "0 10px 28px rgba(0,0,0,0.12)" }}
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: "64px 16px" }}>
        <div style={styles.container}>
          <h2 style={styles.h2}>Simple, Fair Pricing</h2>
          <div
            style={{
              display: "grid",
              gap: 18,
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              maxWidth: 900,
              margin: "24px auto 0 auto",
            }}
          >
            <div style={{ ...styles.card, padding: 22 }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 8px 0" }}>Free</h3>
              <p style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 14px 0" }}>$0</p>
              <ul style={{ color: "#555", margin: "0 0 18px 16px" }}>
                <li>5 captions/month</li>
                <li>Manual posting</li>
                <li>Basic AI</li>
              </ul>
              <button
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 10,
                  background: "#f5f5f5",
                  color: "#111",
                  fontWeight: 700,
                  border: "1px solid #e5e5e5",
                  cursor: "pointer",
                }}
              >
                Get Started
              </button>
            </div>

            <div
              style={{
                padding: 22,
                borderRadius: 16,
                background:
                  "linear-gradient(135deg, rgba(108,71,255,1) 0%, rgba(59,130,246,1) 100%)",
                color: "#fff",
                boxShadow: "0 10px 28px rgba(0,0,0,0.14)",
              }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 8px 0" }}>Pro</h3>
              <p style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 14px 0" }}>$15/month</p>
              <ul style={{ margin: "0 0 18px 16px", opacity: 0.92 }}>
                <li>Unlimited AI captions</li>
                <li>One-click posting</li>
                <li>Team access</li>
                <li>Scheduling & analytics</li>
              </ul>
              <button
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 10,
                  background: "#fff",
                  color: "#6c47ff",
                  fontWeight: 800,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        style={{
          padding: "64px 16px",
          textAlign: "center",
          color: "#fff",
          background:
            "linear-gradient(135deg, rgba(108,71,255,1) 0%, rgba(59,130,246,1) 100%)",
        }}
      >
        <div style={styles.container}>
          <h2 style={{ ...styles.h2, color: "#fff", marginBottom: 8 }}>
            Ready to Post Smarter?
          </h2>
          <p
            style={{
              ...styles.pLead,
              color: "rgba(255,255,255,0.9)",
              marginBottom: 24,
            }}
          >
            Join 5,000+ creators, brands, and campaigns using Postara to grow faster.
          </p>
          <Link href="/tool" style={{ ...styles.ctaSecondary, background: "#fff", color: "#6c47ff", border: "none" }}>
            Try It Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "28px 16px", textAlign: "center", color: "#666" }}>
        <p>© {new Date().getFullYear()} Postara. One Click. Post Everywhere.</p>
        <p style={{ marginTop: 8 }}>
          <a href="#" style={{ textDecoration: "none", color: "#666" }}>Privacy</a> •{" "}
          <a href="#" style={{ textDecoration: "none", color: "#666" }}>Terms</a> •{" "}
          <a href="#" style={{ textDecoration: "none", color: "#666" }}>Contact</a>
        </p>
      </footer>
    </div>
  );
}
