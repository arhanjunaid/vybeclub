import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isSameOrigin, sessionCookieOptions } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!(await isSameOrigin(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, "", sessionCookieOptions(0));
  return res;
}
