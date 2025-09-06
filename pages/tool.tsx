import React, { useEffect, useMemo, useState } from "react";
import ShareButtons from "../components/ShareButtons";

type CapOut = { ok: boolean; caption?: string; hashtags?: string[]; error?: string };
type UpOut = { ok: boolean; url?: string; error?: string };

export default function ToolPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [err, setErr] = useState<string | null>(null);

  // NEW: accept ?url= to enable UI without uploading
  useEffect(() => {
    try {
      const u = new URL(window.location.href);
      const q = u.searchParams.get("url");
      if (q) setPublicUrl(q);
    } catch {}
  }, []);

  const canGenerate = !!publicUrl;
  const canUpload = !!file;

  const captionWithTags = useMemo(() => {
    const tags = hashtags?.length ? " " + hashtags.map(h => `#${h}`).join(" ") : "";
    return (caption || "").trim() + tags;
  }, [caption, hashtags]);

  const onPick = (f: File | null) => {
    setErr(null);
    setPublicUrl(null);
    setCaption("");
    setHashtags([]);
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const onUpload = async () => {
    if (!file) return;
    setErr(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const rsp = await fetch("/api/upload", { method: "POST", body: fd });
      const data: UpOut = await rsp.json();
      if (!rsp.ok || !data.ok || !data.url) throw new Error(data.error || "Upload failed");
      setPublicUrl(data.url);
    } catch (e: any) {
      setErr(e?.message || "Upload error");
    } finally {
      setUploading(false);
    }
  };

  const onGenerate = async () => {
    if (!publicUrl) return;
    setErr(null);
    setGenerating(true);
    try {
      const rsp = await fetch("/api/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: publicUrl, platform: "generic", tone: "neutral" }),
      });
      const data: CapOut = await rsp.json();
      if (!rsp.ok || !data.ok) throw new Error(data.error || "Caption failed");
      setCaption(data.caption || "");
      setHashtags(data.hashtags || []);
    } catch (e: any) {
      setErr(e?.message || "Caption error");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Postara Tool</h1>

      <section style={{ marginTop: 16, padding: 12, border: "1px solid #e5e7eb", borderRadius: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>Upload media</h2>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
          <input type="file" accept="image/*,video/*" onChange={(e) => onPick(e.target.files?.[0] || null)} />
          <button
            type="button"
            onClick={onUpload}
            disabled={!canUpload || uploading}
            style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #d1d5db", background: canUpload && !uploading ? "#fff" : "#f3f4f6", cursor: canUpload && !uploading ? "pointer" : "not-allowed", fontWeight: 600 }}
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </div>

        {preview && (
          <div style={{ marginTop: 12 }}>
            <p style={{ fontSize: 12, color: "#6b7280" }}>Preview (local)</p>
            {file?.type?.startsWith("video/") ? (
              <video src={preview} controls style={{ width: "100%", maxHeight: 360, borderRadius: 8 }} />
            ) : (
              <img src={preview} alt="preview" style={{ maxWidth: "100%", borderRadius: 8 }} />
            )}
          </div>
        )}

        {publicUrl && (
          <p style={{ marginTop: 8, fontSize: 12 }}>
            Uploaded URL: <a href={publicUrl} target="_blank" rel="noreferrer">{publicUrl}</a>
          </p>
        )}
      </section>

      <section style={{ marginTop: 16, padding: 12, border: "1px solid #e5e7eb", borderRadius: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>Caption</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
          <button
            type="button"
            onClick={onGenerate}
            disabled={!canGenerate || generating}
            style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #d1d5db", background: canGenerate && !generating ? "#fff" : "#f3f4f6", cursor: canGenerate && !generating ? "pointer" : "not-allowed", fontWeight: 600 }}
          >
            {generating ? "Generating…" : "Generate caption"}
          </button>
        </div>

        <div style={{ marginTop: 8 }}>
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption" rows={3} style={{ width: "100%", borderRadius: 8, border: "1px solid #e5e7eb", padding: 8 }} />
          {hashtags?.length > 0 && (
            <p style={{ fontSize: 12, color: "#374151", marginTop: 6 }}>
              {hashtags.map(h => `#${h}`).join(" ")}
            </p>
          )}
          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>Used in sharing: caption + hashtags + URL.</p>
        </div>
      </section>

      <section style={{ marginTop: 16, padding: 12, border: "1px solid #e5e7eb", borderRadius: 12 }}>
        <ShareButtons publicUrl={publicUrl} caption={captionWithTags} />
      </section>

      {err && <p style={{ marginTop: 12, color: "#b91c1c", fontWeight: 600 }}>Error: {err}</p>}
    </div>
  );
}
