import React, { useMemo, useState } from "react";

type Props = { publicUrl: string | null; caption: string };

type Net = {
  id: string;
  name: string;
  oauthOnly?: boolean;
  buildUrl?: (u: string, c: string) => string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

const IconBox =
  (d: string) =>
  (p: React.SVGProps<SVGSVGElement>) =>
    (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...p}>
        <path d={d} />
      </svg>
    );

const icons = {
  x: IconBox("M3 3l7.5 8.5L3 21h3l6-6.8L18.7 21H21l-7.8-8.9L21 3h-3l-5.6 6.3L6 3H3z"),
  fb: IconBox("M13 3h3v3h-3v3h3v3h-3v9h-3v-9H7V9h3V6a3 3 0 013-3z"),
  li: IconBox("M4 4a2 2 0 114 0 2 2 0 01-4 0zM4 8h4v12H4zM10 8h4v2h.1a4 4 0 013.9-2c4 0 4 2.6 4 6v6h-4v-5c0-1.2 0-2.8-1.7-2.8S14 13.7 14 15v5h-4z"),
  rd: IconBox("M20 11a3 3 0 01-3 3v1a4 4 0 01-4 4H11a4 4 0 01-4-4v-1a3 3 0 113-3h6a3 3 0 013 3z"),
  pt: IconBox("M12 2a7 7 0 00-7 7c0 3.1 1.9 5.8 4.7 6.8-.1-.6-.2-1.5 0-2.1.2-.7 1.5-4.6 1.5-4.6s-.4-.9-.4-2c0-1.8 1-3.1 2.2-3.1s1.4 1 1.4 2.2-1 3.4-1.5 5.3c-.4 1.3.8 2.3 2 1.3 1.4-1.1 2.4-3 2.4-4.8 0-3.2-2.7-5.6-5.3-5.6z"),
  wa: IconBox("M20 3.5A10 10 0 004 17.3L3 21l3.8-1A10 10 0 1020 3.5zM7.6 17.2l-.2.1 1-.3.2-.1A8 8 0 1118 6a8 8 0 01-10.4 11.2z"),
  tg: IconBox("M9 15l.3 3c.4 0 .6-.2.8-.4l1.9-1.9 3.9 2.8c.7.4 1.2.2 1.4-.7l2.6-12c.2-.9-.3-1.3-1-.9L3.6 11c-.9.4-.9 1 0 1.3l3.8 1.2 8.8-5.5-7 7z"),
  th: IconBox("M4 7a5 5 0 015-5h6a5 5 0 110 10H9a5 5 0 01-5-5zm5 7h7a4 4 0 110 8H9a4 4 0 110-8z"),
};

const networks: Net[] = [
  { id: "x", name: "X", Icon: icons.x, buildUrl: (u, c) => `https://x.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(c)}` },
  { id: "facebook", name: "Facebook", Icon: icons.fb, buildUrl: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
  { id: "linkedin", name: "LinkedIn", Icon: icons.li, buildUrl: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}` },
  { id: "reddit", name: "Reddit", Icon: icons.rd, buildUrl: (u, c) => `https://www.reddit.com/submit?url=${encodeURIComponent(u)}&title=${encodeURIComponent(c)}` },
  { id: "pinterest", name: "Pinterest", Icon: icons.pt, buildUrl: (u, c) => `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(u)}&media=${encodeURIComponent(u)}&description=${encodeURIComponent(c)}` },
  { id: "whatsapp", name: "WhatsApp", Icon: icons.wa, buildUrl: (u, c) => `https://api.whatsapp.com/send?text=${encodeURIComponent(`${c} ${u}`)}` },
  { id: "telegram", name: "Telegram", Icon: icons.tg, buildUrl: (u, c) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(c)}` },
  { id: "threads", name: "Threads", Icon: icons.th, oauthOnly: true },
];

export default function ShareButtons({ publicUrl, caption }: Props) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const shareables = useMemo(() => networks.filter(n => !n.oauthOnly), []);
  const oauthOnly = useMemo(() => networks.filter(n => n.oauthOnly), []);
  const canShare = !!publicUrl;
  const anySelected = Object.values(selected).some(Boolean);

  const openShare = (href: string) => window.open(href, "_blank", "noopener,noreferrer");

  const onShareSelected = () => {
    if (!publicUrl) return;
    for (const n of shareables) {
      if (!selected[n.id]) continue;
      const href = n.buildUrl?.(publicUrl, caption);
      if (href) openShare(href);
    }
  };

  return (
    <div>
      <h3 style={{ fontWeight: 600, marginTop: 16 }}>Share</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginTop: 8 }}>
        {shareables.map(n => {
          const href = publicUrl && n.buildUrl ? n.buildUrl(publicUrl, caption) : "";
          return (
            <div key={n.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={!!selected[n.id]}
                  onChange={(e) => setSelected(s => ({ ...s, [n.id]: e.target.checked }))}
                  disabled={!canShare}
                />
                <n.Icon />
                <span>{n.name}</span>
              </label>
              <button
                type="button"
                onClick={() => href && openShare(href)}
                disabled={!canShare}
                style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #d1d5db", background: canShare ? "#fff" : "#f3f4f6", cursor: canShare ? "pointer" : "not-allowed" }}
              >
                Share now
              </button>
            </div>
          );
        })}
        {oauthOnly.map(n => (
          <div key={n.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, opacity: 0.8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <n.Icon />
              <span>{n.name}</span>
            </div>
            <button type="button" onClick={() => window.open("https://www.threads.net/", "_blank", "noopener")} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer" }}>
              Connect
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          onClick={onShareSelected}
          disabled={!canShare || !anySelected}
          style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #d1d5db", background: canShare && anySelected ? "#fff" : "#f3f4f6", cursor: canShare && anySelected ? "pointer" : "not-allowed", fontWeight: 600 }}
        >
          Share selected
        </button>
      </div>
      <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>Pop-up blockers can stop share windows. Allow pop-ups.</p>
    </div>
  );
}
