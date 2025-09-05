// app/api/post/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure Node, not edge

type Payload = {
  caption: string;
  mediaUrl?: string;
  platforms: string[];
  profileKeys?: string[];
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Payload;

    if (!process.env.AYRSHARE_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "Missing AYRSHARE_API_KEY on server." },
        { status: 500 }
      );
    }

    if (!body.caption || !body.platforms?.length) {
      return NextResponse.json(
        { ok: false, error: "Caption and at least one platform are required." },
        { status: 400 }
      );
    }

    const ayPayload: Record<string, any> = {
      post: body.caption,
      platforms: body.platforms,
    };

    if (body.mediaUrl?.trim()) {
      ayPayload.mediaUrls = [body.mediaUrl.trim()];
    }

    if (body.profileKeys?.length) {
      ayPayload.profileKeys = body.profileKeys;
    }

    const res = await fetch("https://app.ayrshare.com/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AYRSHARE_API_KEY}`,
      },
      body: JSON.stringify(ayPayload),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: data?.error || "Ayrshare error", details: data },
        { status: res.status }
      );
    }

    return NextResponse.json({ ok: true, result: data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Unknown server error" },
      { status: 500 }
    );
  }
}
