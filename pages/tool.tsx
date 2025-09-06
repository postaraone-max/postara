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
    if (!file) { setStatus("error"); setMessage("Choose a file."); return; }
    try {
      setStatus("uploading"); setMessage("");
      const fd = new FormData(); fd.append("file", file, file.name);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data: any = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      const url = data?.url || data?.secure_url;
      if (!url) throw new Error("No public URL returned. Check Cloudinary env.");
      setPublicUrl(url);
      setStatus("success"); setMessage("Uploaded.");
    } catch (err: any) { setStatus("error"); setMessage(err?.message || "Upload failed."); }
  }

  function handleClear() { setStatus("idle"); setMessage(""); setFile(null); setPublicUrl(""); }

  const container: React.CSSProperties = { maxWidth: 960, margin: "0 auto", padding: "40px 16px" };
  const row: React.CSSProperties = { marginTop: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" };
  const btnPrimary: React.CSSProperties = { padding: "10px 16px", borderRadius: 12, border: "none", background: "#000", color: "#fff", opacity: canUpload ? 1 : 0.6, cursor: canUpload ? "pointer" : "not-allowed" };
  const btnGhost: React.CSSProperties = { padding: "10px 16px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.15)", background: "transparent" };
  const statusStyle: React.CSSProperties = { fontSize: 14, color: status==="error" ? "#b91c1c" : status==="success" ? "#065f46" : "rgba(0,0,0,0.6)" };
  const urlStyle: React.CSSProperties = { fontSize: 13, color: "#065f46", wordBreak: "break-all" };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(#fff,#f7f7f7)" }}>
      <section style={container}>
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>Upload media</h1>
        </header>

        <MediaUploader
          name="file"
          onFileChange={(f) => { setFile(f); setStatus("idle"); setMessage(""); }}
          helperText="Images or videos. Max 200 MB."
        />

        <div style={row}>
          <button type="button" onClick={handleUpload} disabled={!canUpload} style={btnPrimary}>
            {uploading ? "Uploading…" : "Upload"}
          </button>
          <button type="button" onClick={handleClear} style={btnGhost}>Clear</button>
          <span style={statusStyle} aria-live="polite">{status==="idle" ? "" : message}</span>
        </div>

        {publicUrl && <div style={{ marginTop: 8 }}><div style={urlStyle}>URL: {publicUrl}</div></div>}

        {/* Share grid: enabled only when publicUrl exists */}
        <ShareButtons url={publicUrl || undefined} text="Posted with Postara" />
      </section>
    </main>
  );
}
