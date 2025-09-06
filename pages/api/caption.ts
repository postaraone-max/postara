import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "OPENAI_API_KEY missing" });

  try {
    const { prompt = "", tone = "neutral", length = "medium", url = "" } = (req.body || {}) as {
      prompt?: string; tone?: "neutral"|"playful"|"professional"|"hype"; length?: "short"|"medium"|"long"; url?: string;
    };

    const sys = `You write high-conversion social captions. Return strict JSON with keys: caption (single paragraph) and hashtags (array of 3-8 hashtag strings). Tone=${tone}. Length=${length}. Avoid duplicate hashtags. No markdown.`;
    const user = `Post context: ${prompt || "(no context provided)"}\nMedia URL: ${url || "(none)"}`;

    const model = process.env.CAPTION_MODEL || "gpt-4o-mini";
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: sys },
          { role: "user", content: user }
        ],
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      const msg = data?.error?.message || `OpenAI error ${resp.status}`;
      return res.status(500).json({ error: msg });
    }

    const raw = data?.choices?.[0]?.message?.content || "{}";
    let parsed: any;
    try { parsed = JSON.parse(raw); } catch { parsed = { caption: raw, hashtags: [] }; }

    return res.status(200).json({ ok: true, caption: parsed.caption || "", hashtags: parsed.hashtags || [] });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Caption failed" });
  }
}
