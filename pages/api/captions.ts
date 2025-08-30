// pages/api/captions.ts
import type { NextApiRequest, NextApiResponse } from "next";

type CaptionsResponse = { captions: string[] } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CaptionsResponse>
) {
  if (req.method === "GET") {
    return res.status(200).json({ captions: ["API is up. Use POST to generate captions."] });
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { tone = "Casual", platform = "Instagram", hashtags = "" } = req.body || {};
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

    const prompt = `
You are a social media copywriter. Write 5 short, catchy ${platform} captions.
Tone: ${tone}.
Include or adapt these hashtags if they fit: ${hashtags || "(none)"}.
Each caption must be under 140 characters.
Return ONLY a JSON array of 5 strings, no extra text.
`.trim();

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8
      })
    });

    if (!r.ok) return res.status(500).json({ error: await r.text() });

    const data: any = await r.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "[]";

    let captions: string[] = [];
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) captions = parsed.slice(0, 5).map(String);
    } catch {
      captions = content.split("\n").map(s => s.trim()).filter(Boolean).slice(0, 5);
    }
    if (captions.length === 0) captions = ["Sorry—couldn’t generate captions right now. Try again."];

    return res.status(200).json({ captions });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: msg });
  }
}
