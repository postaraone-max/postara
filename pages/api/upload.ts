import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import os from "os";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const form = formidable({
      multiples: false,
      maxFileSize: 200 * 1024 * 1024, // 200 MB
      uploadDir: os.tmpdir(),
      keepExtensions: true,
    });

    // v3: promise API returns [fields, files]
    const [fields, files] = await form.parse(req);

    // Access your field name "file"
    const anyFile = (files as any)?.file;
    const file = Array.isArray(anyFile) ? anyFile[0] : anyFile;

    if (!file) {
      return res.status(400).json({ error: "Missing file field 'file'." });
    }

    return res.status(200).json({
      ok: true,
      name: file.originalFilename || file.newFilename,
      size: file.size,
      type: file.mimetype,
      storedAt: file.filepath,
      fields,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Upload failed" });
  }
}
