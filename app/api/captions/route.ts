// app/api/captions/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { tone = "Casual", platform = "Instagram", hashtags = "" } = await req.json();

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

    const data = await r.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "[]";

    let captions: string[] = [];
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) captions = parsed.slice(0, 5).map(String);
    } catch {
      captions = content
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean)
        .slice(0, 5);
    }

    if (captions.length === 0) {
      captions = ["Sorry—couldn’t generate captions right now. Try again."];
    }

    return NextResponse.json({ captions });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
