import { NextResponse } from "next/server";
import { isAdmin, isSameOrigin } from "@/lib/admin-auth";
import { ensureSchema, pool } from "@/lib/db";

export async function DELETE(
  request: Request,
  ctx: RouteContext<"/api/admin/users/[id]">
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
  const r = await pool.query(`DELETE FROM waitlist WHERE id = $1`, [id]);
  if (!r.rowCount) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
