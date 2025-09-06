// pages/api/caption.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

type Out = {
  ok: boolean;
  captions?: string[];
  hashtags?: string[];
  mode?: "vision" | "text";
  model?: string;
  error?: string;
  raw?: string; // debug in dev
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function sanitizeHashtags(tags: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of tags || []) {
    const t = String(raw || "")
      .replace(/#/g, "")
      .replace(/[^\p{Letter}\p{Number}]/gu, "")
      .toLowerCase();
    if (!t || t.length > 24 || seen.has(t)) continue;
    seen.add(t);
    out.push("#" + t);
    if (out.length >= 12) break;
  }
  return out;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Out>
) {
  if (req.method !== "POST")
    return res.status(405).json({ ok: false, error: "Method not allowed" });

  if (!process.env.OPENAI_API_KEY)
    return res.status(500).json({ ok: false, error: "Missing OPENAI_API_KEY" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const url: string | undefined = body?.url;
    const tone: string = String(body?.tone || "Neutral");
    const platform: string = String(body?.platform || "generic");
    const Nraw = parseInt(String(body?.n ?? "5"), 10);
    const N: number = Math.min(Math.max(Number.isFinite(Nraw) ? Nraw : 5, 1), 8);

    const hasImage = typeof url === "string" && /^https?:\/\//i.test(url);
    const model = "gpt-4o-mini";

    const sys = [
      "You write short, varied social captions that avoid clichés.",
      'Return ONLY valid JSON: {"captions":[...],"hashtags":[...]}',
      `Tone: ${tone}. Platform: ${platform}. Count: ${N}.`,
      "Each caption 80–160 chars. Avoid openings like 'Discover the beauty', 'Elevate your', 'Perfect for any occasion'.",
      "Mix structures: questions, CTAs, fragments. No emojis.",
      "Hashtags: 6–10 items, lowercase, no spaces, no emojis, no brand names, no duplicates. Do not include '#'.",
    ].join("\n");

    const userText = `Create ${N} distinct captions and hashtags for a social post. Use image context if provided. Output JSON exactly.`;

    const messages: any[] = [{ role: "system", content: sys }];
    const content: any[] = [{ type: "text", text: userText }];
    if (hasImage) content.push({ type: "image_url", image_url: { url } });
    messages.push({ role: "user", content });

    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      top_p: 0.95,
      response_format: { type: "json_object" },
      max_tokens: 400,
    });

    const raw = completion.choices?.[0]?.message?.content || "{}";

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error("caption-json-parse-failed", raw);
      return res
        .status(502)
        .json({ ok: false, error: "Bad JSON from model", model, mode: hasImage ? "vision" : "text", raw });
    }

    let captions: string[] = Array.isArray(parsed.captions) ? parsed.captions : [];
    let hashtags: string[] = Array.isArray(parsed.hashtags) ? parsed.hashtags : [];

    captions = captions
      .map((c) => String(c || "").trim())
      .filter(Boolean)
      .filter((c, i, arr) => arr.findIndex((x) => x.toLowerCase() === c.toLowerCase()) === i)
      .slice(0, N);

    hashtags = sanitizeHashtags(hashtags);

    if (captions.length === 0) {
      console.error("caption-empty", { raw, parsed });
      return res
        .status(502)
        .json({ ok: false, error: "Model returned empty captions", model, mode: hasImage ? "vision" : "text", raw });
    }

    return res
      .status(200)
      .json({ ok: true, captions, hashtags, model, mode: hasImage ? "vision" : "text", raw: process.env.NODE_ENV !== "production" ? raw : undefined });
  } catch (err: any) {
    console.error("caption-route-error", err?.status || err?.code || err?.message, err?.response?.data);
    return res.status(500).json({ ok: false, error: err?.message || "Unhandled error" });
  }
}
