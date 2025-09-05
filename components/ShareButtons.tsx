"use client";

import React, { useMemo, useState } from "react";

type Props = { url?: string; text?: string; title?: string };

type Network =
  | "x" | "facebook" | "linkedin" | "reddit" | "pinterest"
  | "whatsapp" | "telegram" | "threads"
  | "youtube" | "instagram" | "tiktok" | "snapchat" | "discord" | "messenger";

const PROVIDERS: Record<Network, {
  label: string;
  kind: "link" | "oauth";
  build?: (p: { url: string; text: string; title: string }) => string;
}> = {
  x:        { label: "X (Twitter)", kind: "link",
              build: ({ url, text }) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}` },
  facebook: { label: "Facebook",    kind: "link",
              build: ({ url }) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  linkedin: { label: "LinkedIn",    kind: "link",
              build: ({ url }) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  reddit:   { label: "Reddit",      kind: "link",
              build: ({ url, title }) => `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  pinterest:{ label: "Pinterest",   kind: "link",
              build: ({ url, text }) => `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}` },
  whatsapp: { label: "WhatsApp",    kind: "link",
              build: ({ url, text }) => `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}%20${encodeURIComponent(url)}` },
  telegram: { label: "Telegram",    kind: "link",
              build: ({ url, text }) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}` },
  threads:  { label: "Threads",     kind: "link",
              build: ({ url, text }) => `https://www.threads.net/intent/post?text=${encodeURIComponent(`${text} ${url}`)}` },

  youtube:  { label: "YouTube",   kind: "oauth" },
  instagram:{ label: "Instagram", kind: "oauth" },
  tiktok:   { label: "TikTok",    kind: "oauth" },
  snapchat: { label: "Snapchat",  kind: "oauth" },
  discord:  { label: "Discord",   kind: "oauth" },
  messenger:{ label: "Messenger", kind: "oauth" },
};

const ORDER: Network[] = [
  "x","facebook","instagram","tiktok","youtube","linkedin","reddit","pinterest",
  "whatsapp","telegram","threads","snapchat","messenger","discord"
];

export default function ShareButtons({ url, text = "Posted with Postara", title = "Shared via Postara" }: Props) {
  const [selected, setSelected] = useState<Record<Network, boolean>>({
    x: true, facebook: true, linkedin: false, reddit: false, pinterest: false,
    whatsapp: true, telegram: false, threads: false,
    youtube: false, instagram: false, tiktok: false, snapchat: false, discord: false, messenger: false,
  });

  const ready = !!url;
  const chosen = useMemo(() => ORDER.filter(n => selected[n]), [selected]);

  const open = (href: string) =>
    window.open(href, "_blank", "noopener,noreferrer,width=900,height=700");

  const shareOne = (n: Network) => {
    const cfg = PROVIDERS[n];
    if (!ready) { alert("Upload to get a public link first."); return; }
    if (cfg.kind === "link" && cfg.build) {
      open(cfg.build({ url: url!, text, title }));
      return;
    }
    alert(`${cfg.label} needs account connection (OAuth).`);
  };

  const shareSelected = () => { chosen.forEach(n => shareOne(n)); };

  const tagStyle = (isLink: boolean) => ({
    marginLeft: 8, fontSize: 11,
    padding: "2px 6px", borderRadius: 8,
    border: "1px solid rgba(0,0,0,0.1)",
    background: isLink ? "#eef6ff" : "#fff7ed",
    color: isLink ? "#1e3a8a" : "#9a3412"
  });

  return (
    <div style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: 16, marginTop: 16, background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontWeight: 800 }}>Share</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          {ready ? "Public link ready." : "Upload first to enable sharing."}
        </div>
      </div>

      <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))" }}>
        {ORDER.map((n) => {
          const cfg = PROVIDERS[n];
          const isLink = cfg.kind === "link";
          return (
            <label key={n} style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, opacity: ready || !isLink ? 1 : 0.6 }}>
              <input
                type="checkbox"
                checked={selected[n]}
                onChange={(e) => setSelected(s => ({ ...s, [n]: e.target.checked }))}
              />
              <span style={{ textTransform: "capitalize", fontWeight: 600 }}>{cfg.label}</span>
              <span style={tagStyle(isLink)}>{isLink ? "link share" : "connect required"}</span>
              <button
                type="button"
                onClick={() => shareOne(n)}
                disabled={isLink && !ready}
                style={{ marginLeft: "auto", padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.15)", opacity: isLink && !ready ? 0.5 : 1 }}
              >
                {isLink ? "Share now" : "Connect"}
              </button>
            </label>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={shareSelected}
          disabled={!ready}
          style={{ padding: "10px 16px", borderRadius: 12, background: "#000", color: "#fff", border: "none", opacity: ready ? 1 : 0.6 }}
        >
          Share selected
        </button>
        <button
          type="button"
          onClick={async () => { if (!ready) { alert("Upload first."); return; } try { await navigator.clipboard.writeText(url!); alert("Link copied"); } catch { alert(url); } }}
          style={{ padding: "10px 16px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.15)", background: "transparent" }}
        >
          Copy link
        </button>
      </div>
    </div>
  );
}
