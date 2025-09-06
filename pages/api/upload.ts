// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File as FormidableFile, Files } from "formidable";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const config = { api: { bodyParser: false, sizeLimit: "50mb" } };

type Json = { ok: boolean; url?: string; error?: string };

function parseForm(req: NextApiRequest) {
  const form = formidable({ multiples: false, keepExtensions: true });
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
  });
}

function firstFile(files: Files): FormidableFile | null {
  for (const v of Object.values(files)) {
    if (!v) continue;
    if (Array.isArray(v)) { for (const f of v) if (f) return f as FormidableFile; }
    else { return v as FormidableFile; }
  }
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Json>) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(500).json({ ok: false, error: "Cloudinary envs missing" });
  }
  cloudinary.config({ cloud_name: CLOUDINARY_CLOUD_NAME, api_key: CLOUDINARY_API_KEY, api_secret: CLOUDINARY_API_SECRET });

  try {
    const { files } = await parseForm(req);
    const f = firstFile(files);
    const filepath = (f as any)?.filepath || (f as any)?.path;
    if (!filepath || !fs.existsSync(filepath)) return res.status(400).json({ ok: false, error: "No file received" });

    const up = await cloudinary.uploader.upload(filepath.toString(), {
      resource_type: "auto",
      folder: "postara",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });
    if (!up?.secure_url) return res.status(500).json({ ok: false, error: "No secure_url" });

    return res.status(200).json({ ok: true, url: up.secure_url });
  } catch (e: any) {
    const msg = (e && e.error && e.error.message) || e?.message || "upload_error";
    return res.status(500).json({ ok: false, error: msg });
  }
}
