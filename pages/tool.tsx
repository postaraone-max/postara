import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";

const MediaUploader = dynamic(() => import("../components/MediaUploader"), { ssr: false });
const ShareButtons = dynamic(() => import("../components/ShareButtons"), { ssr: false });

type Status = "idle" | "uploading" | "success" | "error";

export default function ToolPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [publicUrl, setPublicUrl] = useState("");

  const uploading = status === "uploading";
  const canUpload = useMemo(() => !!file && !uploading, [file, uploading]);

  async function handleUpload() {
    if (!file) { setStatus("error"); setMessage("Please choose a file first."); return; }
    try {
      setStatus("uploading"); setMessage("");
      const fd = new FormData(); fd.append("file", file, file.name);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status} — ${text.slice(0,200)}`);
      const data: any = JSON.parse(text);
      const url = data?.url || data?.secure_url;
      if (!url) throw new Error("No public URL returned");
      setPublicUrl(url); setStatus("success"); setMessage("Uploaded.");
    } catch (err: any) { setStatus("error"); setMessage(err?.message || "Upload failed."); }
  }

  function handleClear() { setStatus("idle"); setMessage(""); setFile(null); setPublicUrl(""); }

  const mainStyle: React.CSSProperties = { minHeight: "100vh", paddingBottom: 120, background: "linear-gradient(#fff,#f7f7f7)" };
  const container: React.CSSProperties = { maxWidth: 960, margin: "0 auto", padding: "40px 16px" };
  const row: React.CSSProperties = { marginTop: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" };
  const btnPrimary: React.CSSProperties = { padding: "10px 16px", borderRadius: 12, border: "none", background: "#000", color: "#fff", opacity: canUpload ? 1 : 0.6, cursor: canUpload ? "pointer" : "not-allowed" };
  const btnGhost: React.CSSProperties = { padding: "10px 16px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.15)", background: "transparent" };
  const statusStyle: React.CSSProperties = { fontSize: 14, color: status==="error" ? "#b91c1c" : status==="success" ? "#065f46" : "rgba(0,0,0,0.6)" };

  // sticky action bar
  const barStyle: React.CSSProperties = { position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 9999, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(6px)", borderTop: "1px solid rgba(0,0,0,0.08)", padding: "10px 16px" };
  const barInner: React.CSSProperties = { maxWidth: 960, margin: "0 auto", display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" };

  return (
    <main style={mainStyle}>
      <section style={container}>
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>Upload media</h1>
          <p style={{ marginTop: 8, opacity: 0.8, fontSize: 14 }}>Images or videos. No page reload.</p>
        </header>

        <MediaUploader name="file" onFileChange={(f) => { setFile(f); setStatus("idle"); setMessage(""); }} helperText="Images or videos. Max 200 MB." />

        {/* Inline controls under preview */}
        <div style={row}>
          <button type="button" onClick={handleUpload} disabled={!canUpload} style={btnPrimary}>
            {uploading ? "Uploading…" : "Upload"}
          </button>
          <button type="button" onClick={handleClear} style={btnGhost}>Clear</button>
          <span style={statusStyle} aria-live="polite">{status==="idle" ? "" : message}</span>
        </div>

        {/* Share grid always visible; disabled until we have a URL */}
        <ShareButtons url={publicUrl || undefined} text="Posted with Postara" />
      </section>

      {/* Sticky duplicate for always-on-screen action */}
      <div style={barStyle}>
        <div style={barInner}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button type="button" onClick={handleUpload} disabled={!canUpload} style={btnPrimary}>
              {uploading ? "Uploading…" : "Upload"}
            </button>
            <button type="button" onClick={handleClear} style={btnGhost}>Clear</button>
          </div>
          <div style={statusStyle} aria-live="polite">{status==="idle" ? "" : message}</div>
        </div>
      </div>
    </main>
  );
}
