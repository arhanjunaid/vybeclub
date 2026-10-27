import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ensureSchema, pool } from "@/lib/db";

export const ADMIN_COOKIE = "vybe_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MINUTES = 15;

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or shorter than 32 characters."
    );
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

/** Constant-time string comparison that is safe for different lengths. */
function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 12) {
    throw new Error("ADMIN_PASSWORD is missing or shorter than 12 characters.");
  }
  return safeEqual(candidate, expected);
}

export function createSessionToken(): { token: string; maxAge: number } {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ role: "admin", exp })).toString(
    "base64url"
  );
  return { token: `${payload}.${sign(payload)}`, maxAge: SESSION_TTL_SECONDS };
}

function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.role === "admin" && typeof data.exp === "number"
      ? data.exp > Math.floor(Date.now() / 1000)
      : false;
  } catch {
    return false;
  }
}

export const sessionCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge,
});

/** True when the current request carries a valid admin session. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

/** For pages: redirect to the login screen if not signed in. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

/**
 * For mutating route handlers: blocks cross-site requests by requiring the
 * Origin header to match the Host header.
 */
export async function isSameOrigin(request: Request): Promise<boolean> {
  const origin = request.headers.get("origin");
  const host = (await headers()).get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (forwarded || h.get("x-real-ip") || "unknown").slice(0, 64);
}

/** Number of failed logins from this IP inside the lockout window. */
export async function recentFailedAttempts(ip: string): Promise<number> {
  await ensureSchema();
  const r = await pool.query<{ n: number }>(
    `SELECT count(*)::int AS n FROM admin_login_attempts
     WHERE ip = $1 AND attempted_at > now() - ($2 || ' minutes')::interval`,
    [ip, String(LOCKOUT_WINDOW_MINUTES)]
  );
  return r.rows[0]?.n ?? 0;
}

export async function isLockedOut(ip: string): Promise<boolean> {
  return (await recentFailedAttempts(ip)) >= MAX_FAILED_ATTEMPTS;
}

export async function recordFailedAttempt(ip: string): Promise<void> {
  await ensureSchema();
  await pool.query(`INSERT INTO admin_login_attempts (ip) VALUES ($1)`, [ip]);
  // Opportunistic cleanup of old rows.
  await pool.query(
    `DELETE FROM admin_login_attempts WHERE attempted_at < now() - interval '1 day'`
  );
}

export async function clearFailedAttempts(ip: string): Promise<void> {
  await pool.query(`DELETE FROM admin_login_attempts WHERE ip = $1`, [ip]);
}
