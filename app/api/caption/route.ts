// app/api/caption/route.ts
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

type ImagePayload = { dataUrl: string; type: string }; // dataUrl = "data:image/png;base64,....."
type Body = {
  text?: string;
  image?: ImagePayload | null;
  platform?: string;
  tone?: string;
  n?: number;
};

function bad(msg: string, code = 400) {
  return NextResponse.json({ error: { code: "bad_request", message: msg } }, { status: code });
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "caption", version: "v4-image" });
}

function approxBytesFromDataUrl(dataUrl: string) {
  // Rough size check for base64 data URLs
  const comma = dataUrl.indexOf(",");
  if (comma < 0) return dataUrl.length;
  const b64 = dataUrl.slice(comma + 1);
  return Math.floor((b64.length * 3) / 4);
}

export async function POST(req: NextRequest) {
  try {
    const { text, image, platform = "instagram", tone = "neutral", n = 5 } = (await req.json()) as Body;

    if ((!text || !text.trim()) && !image) {
      return bad("Provide { text } OR { image: { dataUrl, type } } in JSON body");
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const projectId = process.env.OPENAI_PROJECT_ID;
    if (!apiKey) return NextResponse.json({ error: { message: "OPENAI_API_KEY missing" } }, { status: 500 });
    if (!projectId) return NextResponse.json({ error: { message: "OPENAI_PROJECT_ID missing" } }, { status: 500 });

    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "OpenAI-Project": projectId,
    };

    const system = `You write short, human, platform-specific captions. Platform: ${platform}. Tone: ${tone}. Return ${n} options.`;

    // Build messages for text or image
    let messages: any[];

    if (image) {
      const { dataUrl, type } = image;
      if (!dataUrl?.startsWith("data:")) return bad("image.dataUrl must be a data URL");
      if (!type?.startsWith("image/")) return bad("Only image uploads are supported right now");
      const sz = approxBytesFromDataUrl(dataUrl);
      if (sz > 2_000_000) return bad("Image too large. Max ~2 MB for now.");

      messages = [
        { role: "system", content: system },
        {
          role: "user",
          content: [
            { type: "text", text: `Write ${n} distinct captions for this image.` },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ];
    } else {
      messages = [
        { role: "system", content: system },
        { role: "user", content: `Write ${n} distinct captions for: ${text}` },
      ];
    }

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
      }),
    });

    if (!resp.ok) {
      let details: any = {};
      try {
        details = await resp.json();
      } catch {}
      const msg = details?.error?.message || `Upstream HTTP ${resp.status}`;
      return NextResponse.json({ error: { message: "OpenAI request failed", details: msg } }, { status: 502 });
    }

    const data = await resp.json();
    const textResp: string = data.choices?.[0]?.message?.content ?? "";
    const captions = (textResp.split(/\r?\n/) as string[])
      .map((s: string) => s.replace(/^\d+\.\s*/, "").trim())
      .filter((s: string) => Boolean(s))
      .slice(0, n);

    return new NextResponse(JSON.stringify({ ok: true, captions, model: data.model ?? "unknown" }), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: { message: err?.message || "Unhandled server error" } }, { status: 500 });
  }
}
