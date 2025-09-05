import { NextResponse } from "next/server";

export async function GET() {
  // Return only safe, non-secret info
  return NextResponse.json({
    ok: true,
    nodeEnv: process.env.NODE_ENV || "development",
    now: new Date().toISOString(),
  });
}

export async function POST() {
  // Mirror GET for compatibility
  return GET();
}
