// pages/tool.tsx
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import ShareButtons from "../components/ShareButtons";

type CaptionResp = {
  ok: boolean;
  captions?: string[];
  hashtags?: string[];
  error?: string;
  model?: string;
  mode?: "vision" | "text";
};

const TONES = ["Neutral", "Bold", "Friendly", "Professional", "Playful"] as const;

export default function ToolPage() {
  const [file, setFile] = useState<File | null>(null);
  const [publicUrl, setPublicUrl] = useState<string>("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Neutral");
  const [n, setN] = useState<number>(5);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingCaptions, setLoadingCaptions] = useState(false);
  const [error, setError] = useState<string>("");
  const [captions, setCaptions] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [selectedCaptionIdx, setSelectedCaptionIdx] = useState<number | null>(null);

  // read ?url=
  useEffect(() => {
    const u = new URL(window.location.href);
    const q = u.searchParams.get("url");
    if (q && /^https?:\/\//i.test(q)) setPublicUrl(q);
  }, []);

  const selectedCaption = useMemo(() => {
    if (selectedCaptionIdx == null) return "";
    const c = captions[selectedCaptionIdx] || "";
    const tags = hashtags?.length ? " " + hashtags.join(" ") : "";
    return c + tags;
  }, [captions, hashtags, selectedCaptionIdx]);

  async function handleUpload() {
    setError("");
    setCaptions([]);
    setHashtags([]);
    setSelectedCaptionIdx(null);
    if (!file) {
      setError("Select an image or video first.");
      return;
    }
    try {
      setLoadingUpload(true);
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const j = await r.json();
      if (!j?.ok || !j?.url) {
        throw new Error(j?.error || "Upload failed");
      }
      setPublicUrl(j.url);
    } catch (e: any) {
      setError(e?.message || "Upload error");
    } finally {
      setLoadingUpload(false);
    }
  }

  async function handleGenerate() {
    setError("");
    setCaptions([]);
    setHashtags([]);
    setSelectedCaptionIdx(null);
    if (!publicUrl) {
      setError("Provide a public URL (or upload first).");
      return;
    }
    try {
      setLoadingCaptions(true);
      const r = await fetch("/api/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: publicUrl, tone, n }),
      });
      const j: CaptionResp = await r.json();
      if (!j.ok) throw new Error(j.error || "Caption API error");
      const cs = Array.isArray(j.captions) ? j.captions : [];
      const hs = Array.isArray(j.hashtags) ? j.hashtags : [];
      if (!cs.length) throw new Error("No captions returned");
      setCaptions(cs);
      setHashtags(hs);
      setSelectedCaptionIdx(0);
    } catch (e: any) {
      setError(e?.message || "Generation error");
    } finally {
      setLoadingCaptions(false);
    }
  }

  return (
    <>
      <Head>
        <title>Postara Tool</title>
      </Head>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>AI Captions for Creators & Teams</h1>
        <p style={{ color: "#555", marginBottom: 16 }}>
          Upload or paste a public URL. Pick tone. Generate {n} options. Select one and share.
        </p>

        {/* Upload + URL */}
        <section style={card}>
          <div style={{ display: "grid", gap: 12 }}>
            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Upload media</div>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={handleUpload} disabled={!file || loadingUpload} style={btn}>
                {loadingUpload ? "Uploading..." : "Upload"}
              </button>
              <button
                onClick={() => {
                  setFile(null);
                  setPublicUrl("");
                  setCaptions([]);
                  setHashtags([]);
                  setSelectedCaptionIdx(null);
                }}
                style={btnGhost}
              >
                Clear
              </button>
            </div>

            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Or paste a public URL</div>
              <input
                type="url"
                placeholder="https://..."
                value={publicUrl}
                onChange={(e) => setPublicUrl(e.target.value)}
                style={input}
              />
            </label>

            {publicUrl ? (
              <div style={{ border: "1px solid #eee", padding: 8, borderRadius: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Preview</div>
                <img
                  src={publicUrl}
                  alt="preview"
                  style={{ maxWidth: "100%", maxHeight: 320, borderRadius: 12 }}
                  onError={() => setError("Preview failed. Ensure the URL is public.")}
                />
              </div>
            ) : null}
          </div>
        </section>

        {/* Controls */}
        <section style={card}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Tone</div>
              <select value={tone} onChange={(e) => setTone(e.target.value as any)} style={input}>
                {TONES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Options</div>
              <select value={n} onChange={(e) => setN(parseInt(e.target.value, 10))} style={input}>
                {[3, 4, 5, 6, 7, 8].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>

            <button onClick={handleGenerate} disabled={!publicUrl || loadingCaptions} style={btn}>
              {loadingCaptions ? "Generating..." : "Generate captions"}
            </button>
          </div>

          {error ? (
            <div style={{ marginTop: 12, color: "#b00020", fontWeight: 600 }}>Error: {error}</div>
          ) : null}
        </section>

        {/* Captions */}
        <section style={card}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Pick one caption</div>
          {!captions.length ? (
            <div style={{ color: "#777" }}>No captions yet.</div>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {captions.map((c, i) => (
                <label key={i} style={{ display: "grid", gap: 6, cursor: "pointer" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="radio"
                      name="caption"
                      checked={selectedCaptionIdx === i}
                      onChange={() => setSelectedCaptionIdx(i)}
                    />
                    <div style={{ fontWeight: 600 }}>Option {i + 1}</div>
                  </div>
                  <div style={{ background: "#fafafa", border: "1px solid #eee", padding: 10, borderRadius: 10 }}>
                    {c}
                    {hashtags?.length ? <div style={{ marginTop: 6, color: "#444" }}>{hashtags.join(" ")}</div> : null}
                  </div>
                </label>
              ))}
            </div>
          )}
        </section>

        {/* Share */}
        <section style={card}>
          <ShareButtons url={publicUrl} caption={selectedCaption} />
        </section>
      </main>
      <style jsx global>{`
        * { box-sizing: border-box; }
        body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
        svg, svg * { fill: currentColor; } /* ensure icons visible */
      `}</style>
    </>
  );
}

const card: React.CSSProperties = {
  border: "1px solid #eee",
  padding: 16,
  borderRadius: 16,
  marginBottom: 16,
  background: "#fff",
};

const input: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid #ddd",
  minWidth: 240,
};

const btn: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
  cursor: "pointer",
};

const btnGhost: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #ddd",
  background: "#fff",
  color: "#111",
  cursor: "pointer",
};
