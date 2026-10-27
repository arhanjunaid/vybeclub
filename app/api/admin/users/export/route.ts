import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { ensureSchema, pool } from "@/lib/db";

/** Escapes a CSV cell and neutralises spreadsheet formula injection. */
function cell(value: unknown): string {
  let s = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureSchema();
  const { rows } = await pool.query(
    `SELECT id, email, phone, pass_number, consent, source, created_at
     FROM waitlist ORDER BY created_at DESC`
  );

  const header = ["id", "email", "phone", "pass_number", "consent", "source", "created_at"];
  const lines = [
    header.join(","),
    ...rows.map((r) =>
      [
        r.id,
        r.email,
        r.phone,
        r.pass_number,
        r.consent,
        r.source,
        new Date(r.created_at).toISOString(),
      ]
        .map(cell)
        .join(",")
    ),
  ];

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse("\uFEFF" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="vybeclub-waitlist-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
