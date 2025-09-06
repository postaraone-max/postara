// pages/api/cloudinary-ping.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";

type Out = { ok: boolean; status?: number; error?: string };

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Out>
) {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(500).json({ ok: false, error: "Cloudinary envs missing" });
  }
  try {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
    const r = await cloudinary.api.ping();
    return res.status(200).json({ ok: true, status: r.status });
  } catch (e: any) {
    const msg = (e && e.error && e.error.message) || e?.message || "error";
    return res.status(500).json({ ok: false, error: msg });
  }
}
