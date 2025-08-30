// app/tool/page.tsx
'use client';

import { useState } from 'react';

export default function ToolPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tone, setTone] = useState('Funny');
  const [platform, setPlatform] = useState('Instagram');
  const [hashtags, setHashtags] = useState('#vibes #goodtimes');
  const [captions, setCaptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const wrap = { padding: 24, fontFamily: 'system-ui, sans-serif', background: '#f7f7f8', minHeight: '100vh' } as const;
  const card = { maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' } as const;
  const label = { display: 'block', fontSize: 14, color: '#444', marginBottom: 8 } as const;
  const input = { width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 8 } as const;
  const btn = { padding: '12px 18px', borderRadius: 10, background: '#6c47ff', color: '#fff', fontWeight: 700, border: 0, cursor: 'pointer' } as const;

  // Calls our /api/captions route (real AI)
  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      setCaptions([]);

      const res = await fetch("/api/captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tone, platform, hashtags }),
      });

      const json = await res.json();
      if (!res.ok || !json?.captions) {
        throw new Error(json?.error || "Failed to generate captions");
      }

      setCaptions(json.captions);
    } catch (err: any) {
      setErrorMsg(err?.message || "AI is busy. Try again.");
      setCaptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={wrap}>
      <div style={card}>
        <h1 style={{ fontSize: 32, margin: 0, textAlign: 'center', backgroundImage: 'linear-gradient(90deg,#7c3aed,#3b82f6)', WebkitBackgroundClip: 'text', color: 'transparent', fontWeight: 800 }}>
          Postara Creator
        </h1>
        <p style={{ color: '#666', textAlign: 'center', marginTop: 8, marginBottom: 24 }}>
          AI-powered captions. One click. Post everywhere.
        </p>

        {/* Upload (placeholder for future image analysis) */}
        <div style={{ marginBottom: 18 }}>
          <span style={label}>Upload your media</span>
          <input
            type="file"
            accept="image/*,video/*"
            style={input}
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          />
          <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>
            {selectedFile ? `Selected: ${selectedFile.name}` : 'No file selected yet'}
          </div>
        </div>

        {/* Tone & Platform */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
          <div>
            <label htmlFor="tone" style={label}>Tone</label>
            <select id="tone" style={input} value={tone} onChange={(e) => setTone(e.target.value)}>
              <option>Funny</option>
              <option>Professional</option>
              <option>Casual</option>
              <option>Inspirational</option>
              <option>Witty</option>
            </select>
          </div>
          <div>
            <label htmlFor="platform" style={label}>Platform</label>
            <select id="platform" style={input} value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option>Instagram</option>
              <option>TikTok</option>
              <option>Twitter</option>
              <option>Facebook</option>
              <option>LinkedIn</option>
              <option>YouTube</option>
            </select>
          </div>
        </div>

        {/* Hashtags */}
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="hashtags" style={label}>Suggested Hashtags</label>
          <input
            id="hashtags"
            type="text"
            style={input}
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="#fun #sun #goodtimes"
          />
        </div>

        {/* Generate */}
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <button style={btn} onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                  <path d="M4 12a8 8 0 0 1 8-8" fill="currentColor" opacity="0.75" />
                </svg>
                Generating…
              </span>
            ) : "Generate 5 Captions 🚀"}
          </button>
        </div>

        {errorMsg && (
          <div style={{ marginBottom: 12, color: '#b91c1c', fontSize: 14 }}>
            {errorMsg}
          </div>
        )}

        {/* Results */}
        {captions.length > 0 && (
          <div>
            <h2 style={{ fontSize: 18, marginTop: 0, marginBottom: 8 }}>Your Captions</h2>
            {captions.map((c, i) => (
              <div key={i} style={{ background: '#f0f5ff', border: '1px solid #d6e2ff', borderRadius: 10, padding: 12, marginBottom: 8 }}>
                <div style={{ marginBottom: 6 }}>{c}</div>
                <button
                  onClick={() => navigator.clipboard.writeText(c)}
                  style={{ background: 'transparent', border: 0, color: '#2a5bd7', cursor: 'pointer', padding: 0 }}
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <a href="/" style={{ color: '#2a5bd7', textDecoration: 'none' }}>← Back home</a>
        </div>
      </div>
    </main>
  );
}
