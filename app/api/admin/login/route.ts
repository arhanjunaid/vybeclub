import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  checkAdminPassword,
  clearFailedAttempts,
  createSessionToken,
  getClientIp,
  isLockedOut,
  isSameOrigin,
  recordFailedAttempt,
  sessionCookieOptions,
} from "@/lib/admin-auth";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(request: Request) {
  if (!(await isSameOrigin(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let password = "";
  try {
    const body = await request.json();
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const ip = await getClientIp();

    if (await isLockedOut(ip)) {
      return NextResponse.json(
        { error: "Too many failed attempts. Try again in 15 minutes." },
        { status: 429 }
      );
    }

    if (!password || !checkAdminPassword(password)) {
      await recordFailedAttempt(ip);
      await sleep(600); // slow down guessing
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    await clearFailedAttempts(ip);
    const { token, maxAge } = createSessionToken();
    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions(maxAge));
    return res;
  } catch (err) {
    console.error("Admin login error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Admin sign-in is not configured correctly." },
      { status: 500 }
    );
  }
}
