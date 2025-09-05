import "./globals.css";

export const metadata = {
  title: "Postara",
  description: "One click. Post everywhere.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {children}

        {/* Floating Upload button (remove if you don’t want it) */}
        <a
          href="/tool"
          style={{
            position: "fixed",
            right: 20,
            bottom: 20,
            padding: "12px 16px",
            borderRadius: 999,
            background: "#111",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
            boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
          }}
        >
          Upload image / video
        </a>
      </body>
    </html>
  );
}
