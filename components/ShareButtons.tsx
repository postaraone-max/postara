// components/ShareButtons.tsx
import { useMemo, useState } from "react";

type NetKey =
  | "x"
  | "facebook"
  | "linkedin"
  | "pinterest"
  | "reddit"
  | "whatsapp"
  | "telegram"
  | "email"
  | "instagram"
  | "tiktok";

export default function ShareButtons({
  url,
  caption,
}: {
  url: string;
  caption: string;
}) {
  const [selected, setSelected] = useState<Record<NetKey, boolean>>({
    x: false,
    facebook: false,
    linkedin: false,
    pinterest: false,
    reddit: false,
    whatsapp: false,
    telegram: false,
    email: false,
    instagram: false, // shown but disabled
    tiktok: false, // shown but disabled
  });

  const hasUrl = typeof url === "string" && /^https?:\/\//i.test(url || "");
  const hasCaption = typeof caption === "string" && caption.trim().length > 0;

  const encodedUrl = encodeURIComponent(url || "");
  const encodedText = encodeURIComponent(caption || "");
  const encodedSubject = encodeURIComponent(
    caption.slice(0, 60).replace(/\s+\S*$/, "") || "Post"
  );

  const templates: Record<
    NetKey,
    {
      name: string;
      color: string;
      supportsShare: boolean;
      buildUrl: () => string;
      icon: JSX.Element;
    }
  > = {
    x: {
      name: "X",
      color: "#111",
      supportsShare: true,
      buildUrl: () =>
        `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
          <path d="M18.244 2H21l-6.49 7.41L22 22h-6.78l-4.27-5.61L5.8 22H3l6.92-7.9L2 2h6.86l3.86 5.18L18.244 2zm-2.37 18h1.77L8.21 4H6.35l9.52 16z" />
        </svg>
      ),
    },
    facebook: {
      name: "Facebook",
      color: "#0866FF",
      supportsShare: true,
      buildUrl: () =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
          <path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.35 2 1.86 6.48 1.86 12.07c0 4.99 3.65 9.13 8.43 9.93v-7.03H7.9v-2.9h2.39V9.41c0-2.36 1.4-3.67 3.54-3.67 1.03 0 2.11.18 2.11.18v2.32h-1.19c-1.17 0-1.54.73-1.54 1.48v1.78h2.63l-.42 2.9h-2.21V22c4.78-.8 8.43-4.94 8.43-9.93z" />
        </svg>
      ),
    },
    linkedin: {
      name: "LinkedIn",
      color: "#0A66C2",
      supportsShare: true,
      buildUrl: () =>
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
          <path d="M6.94 7.5H3.56V20h3.38V7.5zM5.25 3.5a2 2 0 100 4 2 2 0 000-4zM20.44 20h-3.37v-6.5c0-1.55-.55-2.61-1.93-2.61-1.05 0-1.67.71-1.95 1.39-.1.24-.13.56-.13.88V20H9.69s.04-10.96 0-12.1h3.37v1.71c.45-.69 1.27-1.66 3.08-1.66 2.25 0 4.3 1.47 4.3 4.63V20z" />
        </svg>
      ),
    },
    pinterest: {
      name: "Pinterest",
      color: "#E60023",
      supportsShare: true,
      buildUrl: () =>
        `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
          <path d="M12.04 2C6.5 2 3 5.8 3 10.2c0 2.5 1.38 5.6 3.59 6.58.34.16.52.09.6-.24.06-.26.36-1.54.5-2.14.05-.2.03-.37-.12-.58-.73-.95-1.32-2.68-1.32-4.3 0-4.15 3.14-7.91 8.54-7.91 4.66 0 7.96 3.18 7.96 7.72 0 4.66-2.46 7.92-5.66 7.92-1.77 0-3.09-1.46-2.66-3.25.51-2.12 1.49-4.41 1.49-5.94 0-1.37-.73-2.51-2.25-2.51-1.78 0-3.21 1.84-3.21 4.3 0 1.57.54 2.63.54 2.63s-1.85 7.84-2.18 9.21c-.37 1.57-.22 3.49-.13 3.97.07.35.48.47.73.18.38-.47 1.52-2.31 1.95-3.86.14-.5.8-3.11.8-3.11.4.77 1.57 1.46 2.82 1.46 3.71 0 6.39-3.39 6.39-7.95C21.5 6.03 17.45 2 12.04 2z" />
        </svg>
      ),
    },
    reddit: {
      name: "Reddit",
      color: "#FF4500",
      supportsShare: true,
      buildUrl: () =>
        `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
          <path d="M22 12.07c0-5.27-4.46-9.54-9.96-9.54C6.54 2.53 2.07 6.8 2.07 12.07c0 4.02 2.74 7.41 6.52 8.63-.09-.74-.17-1.88.03-2.7.18-.76 1.18-4.86 1.18-4.86s-.3-.6-.3-1.48c0-1.38.8-2.41 1.8-2.41.85 0 1.26.64 1.26 1.41 0 .86-.55 2.15-.83 3.35-.24 1.01.51 1.84 1.52 1.84 1.83 0 3.23-1.93 3.23-4.72 0-2.46-1.77-4.18-4.3-4.18-2.93 0-4.66 2.19-4.66 4.45 0 .88.34 1.83.77 2.35.08.1.09.2.07.31-.08.34-.25 1.09-.28 1.24-.04.19-.15.23-.35.14-1.3-.61-2.11-2.53-2.11-4.07 0-3.32 2.41-6.36 6.96-6.36 3.66 0 6.49 2.6 6.49 6.08 0 3.62-2.28 6.53-5.45 6.53-1.07 0-2.07-.56-2.41-1.23l-.65 2.48c-.24.94-.88 2.12-1.31 2.84.99.3 2.03.46 3.12.46 5.49 0 9.96-4.27 9.96-9.54z" />
        </svg>
      ),
    },
    whatsapp: {
      name: "WhatsApp",
      color: "#25D366",
      supportsShare: true,
      buildUrl: () => `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
          <path d="M20.52 3.48A11.94 11.94 0 0012.02 0C5.42 0 .08 5.34.08 11.93c0 2.1.55 4.12 1.6 5.93L0 24l6.29-1.63a11.9 11.9 0 005.73 1.47h.01c6.58 0 11.92-5.34 11.92-11.93 0-3.19-1.24-6.19-3.43-8.43zM12.02 21.5h-.01a9.52 9.52 0 01-4.85-1.33l-.35-.21-3.73.96.99-3.64-.23-.37a9.52 9.52 0 01-1.47-5.01c0-5.26 4.28-9.53 9.55-9.53 2.55 0 4.95 1 6.76 2.82a9.43 9.43 0 012.79 6.71c0 5.26-4.28 9.53-9.45 9.53zm5.51-7.14c-.3-.15-1.76-.87-2.03-.96-.27-.1-.47-.14-.68.14-.2.29-.78.96-.95 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.77-1.47-1.72-1.64-2.01-.17-.29-.02-.45.13-.6.13-.13.3-.34.45-.5.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.07-.15-.68-1.64-.93-2.25-.24-.58-.49-.5-.68-.51l-.58-.01c-.2 0-.52.07-.78.37-.27.29-1.02 1-1.02 2.44s1.05 2.83 1.2 3.02c.15.2 2.08 3.18 5.04 4.46.7.3 1.25.48 1.68.61.71.22 1.36.19 1.87.12.57-.08 1.76-.72 2-1.41.25-.69.25-1.28.18-1.41-.07-.12-.27-.19-.57-.34z" />
        </svg>
      ),
    },
    telegram: {
      name: "Telegram",
      color: "#26A5E4",
      supportsShare: true,
      buildUrl: () => `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
          <path d="M9.036 15.87l-.375 5.29c.538 0 .77-.231 1.047-.509l2.516-2.416 5.216 3.84c.956.529 1.64.252 1.9-.885l3.44-16.1h.001c.306-1.435-.518-1.996-1.448-1.65L1.2 9.6c-1.394.54-1.373 1.312-.237 1.66l5.88 1.835L17.99 6.87c.584-.382 1.114-.17.677.212" />
        </svg>
      ),
    },
    email: {
      name: "Email",
      color: "#444",
      supportsShare: true,
      buildUrl: () =>
        `mailto:?subject=${encodedSubject}&body=${encodedText}%0A%0A${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
          <path d="M2 6a2 2 0 012-2h16a2 2 0 012 2v.4l-10 6.25L2 6.4V6zm0 3.2v8.8A2 2 0 004 20h16a2 2 0 002-2V9.2l-9.51 5.94a2 2 0 01-2.04 0L2 9.2z" />
        </svg>
      ),
    },
    instagram: {
      name: "Instagram",
      color: "#C13584",
      supportsShare: false, // no public web share intent
      buildUrl: () => "",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
          <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 4.5A5.5 5.5 0 1017.5 12 5.5 5.5 0 0012 6.5zm0 2A3.5 3.5 0 1115.5 12 3.5 3.5 0 0112 8.5zm5.75-.5a1.25 1.25 0 10-1.25-1.25A1.25 1.25 0 0017.75 8z" />
        </svg>
      ),
    },
    tiktok: {
      name: "TikTok",
      color: "#000000",
      supportsShare: false, // no public web share intent
      buildUrl: () => "",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
          <path d="M14.5 3.2c.9 1.5 2.3 2.7 4 3.3v3.1c-1.6-.05-3.1-.55-4.4-1.4v6.8a6 6 0 11-5.9-6.1c.4 0 .8.03 1.2.1v3.2a2.8 2.8 0 00-1.2-.3 2.9 2.9 0 102.9 2.9V2.5h3.4v.7z" />
        </svg>
      ),
    },
  };

  const ordered: NetKey[] = [
    "x",
    "facebook",
    "instagram",
    "tiktok",
    "linkedin",
    "pinterest",
    "reddit",
    "whatsapp",
    "telegram",
    "email",
  ];

  const canBulkShare = useMemo(() => {
    const anySelected = ordered.some((k) => selected[k]);
    return anySelected && hasUrl && hasCaption;
  }, [selected, hasUrl, hasCaption]);

  function openOnce(u: string) {
    if (!u) return;
    window.open(u, "_blank", "noopener,noreferrer");
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ fontWeight: 700 }}>Share</div>

      {/* Horizontal, responsive tile row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          alignItems: "stretch",
        }}
      >
        {ordered.map((k) => {
          const t = templates[k];
          const checked = selected[k];
          const disabled =
            !t.supportsShare || !hasUrl || !hasCaption || (k === "email" && !hasUrl);

        return (
          <div key={k} style={{ display: "grid", justifyItems: "center" }}>
            <button
              type="button"
              onClick={() => {
                if (t.supportsShare && hasUrl && hasCaption) openOnce(t.buildUrl());
              }}
              style={{
                ...tile,
                borderColor: checked ? t.color : "#ddd",
                color: t.color,
                opacity: disabled ? 0.45 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
              }}
              title={
                t.supportsShare
                  ? `${t.name} · click to share now`
                  : `${t.name} · requires app/API`
              }
              aria-pressed={checked}
              disabled={disabled && t.supportsShare}
            >
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                {t.name}
              </div>
              <div style={{ display: "grid", placeItems: "center" }}>{t.icon}</div>
            </button>

            {/* Selector below each tile */}
            <label style={{ display: "flex", gap: 6, fontSize: 12, marginTop: 4 }}>
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) =>
                  setSelected((s) => ({ ...s, [k]: e.target.checked }))
                }
                disabled={!t.supportsShare}
                title={
                  t.supportsShare ? `Select ${t.name}` : `${t.name} not shareable via URL`
                }
              />
              Select
            </label>
          </div>
        );
        })}
      </div>

      {/* Bulk actions */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => {
            ordered
              .filter((k) => selected[k] && templates[k].supportsShare)
              .forEach((k) => openOnce(templates[k].buildUrl()));
          }}
          disabled={!canBulkShare}
          style={primary}
          title="Share to all selected networks"
        >
          Share selected
        </button>

        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(url || "")}
          disabled={!hasUrl}
          style={ghost}
          title="Copy link"
        >
          Copy link
        </button>

        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(caption || "")}
          disabled={!hasCaption}
          style={ghost}
          title="Copy caption"
        >
          Copy caption
        </button>
      </div>

      {/* Hint about disabled platforms */}
      <div style={{ fontSize: 12, color: "#666" }}>
        Instagram and TikTok tiles are shown for completeness but cannot be shared via
        URL. They require their apps or API integrations.
      </div>
    </div>
  );
}

const tile: React.CSSProperties = {
  width: 120,
  height: 100,
  border: "2px solid #ddd",
  borderRadius: 14,
  background: "#fff",
  display: "grid",
  alignContent: "center",
  justifyItems: "center",
  padding: 10,
  gap: 6,
};

const primary: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
  cursor: "pointer",
};

const ghost: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #ddd",
  background: "#fff",
  color: "#111",
  cursor: "pointer",
};
