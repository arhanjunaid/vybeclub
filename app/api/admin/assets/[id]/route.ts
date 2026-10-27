import { NextResponse } from "next/server";
import { isAdmin, isSameOrigin } from "@/lib/admin-auth";
import { ensureSchema, pool } from "@/lib/db";

/** Streams a stored file. Images show inline; everything else downloads. */
export async function GET(
  request: Request,
  ctx: RouteContext<"/api/admin/assets/[id]">
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await ensureSchema();
  const r = await pool.query<{
    kind: string;
    filename: string | null;
    mime: string | null;
    data: Buffer | null;
  }>(`SELECT kind, filename, mime, data FROM admin_assets WHERE id = $1`, [id]);

  const row = r.rows[0];
  if (!row || !row.data || !row.mime) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const inline = row.kind === "image";
  const name = encodeURIComponent(row.filename ?? "file");
  return new NextResponse(new Uint8Array(row.data), {
    headers: {
      "Content-Type": row.mime,
      "Content-Length": String(row.data.length),
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${name}`,
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; img-src 'self'; sandbox",
      "Cache-Control": "private, no-store",
    },
  });
}

export async function DELETE(
  request: Request,
  ctx: RouteContext<"/api/admin/assets/[id]">
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!(await isSameOrigin(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await ctx.params;
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await ensureSchema();
  const r = await pool.query(`DELETE FROM admin_assets WHERE id = $1`, [id]);
  if (!r.rowCount) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
