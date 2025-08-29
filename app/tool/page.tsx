'use client';

import { useState } from 'react';

export default function ToolPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tone, setTone] = useState('Funny');
  const [platform, setPlatform] = useState('Instagram');
  const [hashtags, setHashtags] = useState('#vibes #goodtimes');
  const [captions, setCaptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    setIsLoading(true);
    setCaptions([]);
    setTimeout(() => {
      const mock = [
        'Just living my best life! 😎 #DoItForTheGram',
        'This right here? This is the content you came for. 🙌',
        'Mood: Better than expected. ✨',
        'Caption couldn’t do this moment justice. 🤩',
        `Feeling ${tone.toLowerCase()} today! ${hashtags}`
      ];
      setCaptions(mock);
      setIsLoading(false);
    }, 1200);
  };

  const wrap = { padding: 24, fontFamily: 'system-ui, sans-serif', background: '#f7f7f8', minHeight: '100vh' } as const;
  const card = { maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' } as const;
  const label = { display: 'block', fontSize: 14, color: '#444', marginBottom: 8 } as const;
  const input = { width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 8 } as const;
  const btn = { padding: '12px 18px', borderRadius: 10, background: '#6c47ff', color: '#fff', fontWeight: 700, border: 0, cursor: 'pointer' } as const;

  return (
    <main style={wrap}>
      <div style={card}>
        <h1 style={{ fontSize: 28, margin: 0, textAlign: 'center' }}>Postara Tool</h1>
        <p style={{ color: '#666', textAlign: 'center', marginTop: 8, marginBottom: 24 }}>
          Upload media, pick tone, and generate 5 captions (mock for now).
        </p>

        {/* Upload */}
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
            {isLoading ? 'Generating… ⏳' : 'Generate 5 Captions 🚀'}
          </button>
        </div>

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
