import { NextResponse } from "next/server";
import { isAdmin, isSameOrigin } from "@/lib/admin-auth";
import { ensureSchema, pool } from "@/lib/db";
import {
  DOCUMENT_TYPES,
  IMAGE_TYPES,
  MAX_FILE_BYTES,
  extensionOf,
  normaliseUrl,
  safeFilename,
} from "@/lib/assets";

const clean = (v: FormDataEntryValue | unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/** Checks the file's leading bytes match the claimed image type. */
function looksLikeImage(ext: string, b: Buffer): boolean {
  if (ext === "png") return b.subarray(0, 4).toString("hex") === "89504e47";
  if (ext === "jpg" || ext === "jpeg") return b.subarray(0, 3).toString("hex") === "ffd8ff";
  if (ext === "gif") return b.subarray(0, 3).toString("ascii") === "GIF";
  if (ext === "webp")
    return b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP";
  return false;
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!(await isSameOrigin(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await ensureSchema();
    const contentType = request.headers.get("content-type") ?? "";

    // ---- Links (JSON) ----
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const title = clean(body.title, 200);
      const url = normaliseUrl(clean(body.url, 2000));
      if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
      if (!url) return NextResponse.json({ error: "Enter a valid http(s) link" }, { status: 400 });

      await pool.query(
        `INSERT INTO admin_assets (kind, title, description, category, url)
         VALUES ('link', $1, $2, $3, $4)`,
        [title, clean(body.description, 1000) || null, clean(body.category, 60) || null, url]
      );
      return NextResponse.json({ success: true });
    }

    // ---- Files (multipart) ----
    const form = await request.formData();
    const kind = clean(form.get("kind"), 20);
    const file = form.get("file");

    if (kind !== "document" && kind !== "image") {
      return NextResponse.json({ error: "Invalid asset type" }, { status: 400 });
    }
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Choose a file to upload" }, { status: 400 });
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "File is larger than 4 MB" }, { status: 413 });
    }

    const filename = safeFilename(file.name);
    const ext = extensionOf(filename);
    const allowed = kind === "image" ? IMAGE_TYPES : DOCUMENT_TYPES;
    const mime = allowed[ext];
    if (!mime) {
      return NextResponse.json(
        { error: `.${ext || "?"} files are not allowed for ${kind}s` },
        { status: 400 }
      );
    }

    const data = Buffer.from(await file.arrayBuffer());
    if (kind === "image" && !looksLikeImage(ext, data)) {
      return NextResponse.json({ error: "File content does not match its image type" }, { status: 400 });
    }

    const title = clean(form.get("title"), 200) || filename;
    await pool.query(
      `INSERT INTO admin_assets (kind, title, description, category, filename, mime, size_bytes, data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        kind,
        title,
        clean(form.get("description"), 1000) || null,
        clean(form.get("category"), 60) || null,
        filename,
        mime,
        data.length,
        data,
      ]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin asset upload error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Could not save. Please try again." }, { status: 500 });
  }
}
