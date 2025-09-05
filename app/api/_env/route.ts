// app/api/_env/route.ts
import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function GET() {
  return NextResponse.json({
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "SET" : "MISSING",
    AYRSHARE_API_KEY: process.env.AYRSHARE_API_KEY ? "SET" : "MISSING",
  });
}
