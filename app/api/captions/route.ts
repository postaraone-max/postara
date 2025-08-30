// app/api/captions/route.ts
import { NextResponse } from "next/server";

type CaptionsRequest = {
  tone?: string;
  platform?: string;
  hashtags?: string;
};

// Quick GET for testing in the browser: /api/captions
export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/captions" });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CaptionsRequest;
    const tone = body.tone ?? "Casual";
    const platform = body.platform ?? "Instagram";
    const hashtags = body.hashtags ?? "";

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in environment variables." },
        { status: 500 }
      );
    }

    const prompt = `
You are a social media copywriter. Write 5 short, catchy ${platform} captions.
Tone: ${tone}.
Include or adapt these hashtags if they fit: ${hashtags || "(none)"}.
Each caption must be under 140 characters.
Return ONLY a JSON array of 5 strings, no extra text.
`.trim();

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      }),
    });

    if (!r.ok) {
      const txt = await r.text();
      return NextResponse.json({ error: txt }, { status: 500 });
    }

    // OpenAI response is dynamic; treat as unknown and narrow carefully
    const data: unknown = await r.json();
    const content =
      typeof data === "object" &&
      data !== null &&
      Array.isArray((data as any).choices) &&
      (data as any).choices[0]?.message?.content
        ? String((data as any).choices[0].message.content)
        : "[]";

    let captions: string[] = [];
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) captions = parsed.slice(0, 5).map(String);
    } catch {
      captions = content
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 5);
    }

    if (captions.length === 0) {
      captions = ["Sorry—couldn’t generate captions right now. Try again."];
    }

    return NextResponse.json({ captions });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
