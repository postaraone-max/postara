import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import os from "os";
import { v2 as cloudinary } from "cloudinary";

export const config = { api: { bodyParser: false } };

function ensureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary env vars missing");
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") { res.setHeader("Allow", ["POST"]); return res.status(405).json({ error: "Method Not Allowed" }); }
  try {
    ensureCloudinary();

    const form = formidable({ multiples: false, maxFileSize: 200 * 1024 * 1024, uploadDir: os.tmpdir(), keepExtensions: true });
    const [fields, files] = await form.parse(req);
    const anyFile = (files as any)?.file;
    const file = Array.isArray(anyFile) ? anyFile[0] : anyFile;
    if (!file) return res.status(400).json({ error: "Missing file field 'file'." });

    const result = await cloudinary.uploader.upload(file.filepath, { resource_type: "auto", folder: "postara" });

    return res.status(200).json({
      ok: true,
      url: result.secure_url,
      secure_url: result.secure_url,
      public_id: result.public_id,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      duration: (result as any).duration || null,
      format: result.format,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Upload failed" });
  }
}
