import { Pool } from "pg";

/**
 * Singleton Postgres pool.
 *
 * Next.js dev mode hot-reloads modules, which would otherwise create a new
 * pool on every reload and exhaust connections. We cache the pool on
 * `globalThis` so it survives reloads.
 */
declare global {
  var __vybePgPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add the Supabase Postgres connection string to .env.local."
    );
  }

  return new Pool({
    connectionString,
    // Supabase requires TLS. `rejectUnauthorized: false` avoids self-signed
    // chain issues with the pooler while still encrypting the connection.
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
}

export const pool: Pool = globalThis.__vybePgPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalThis.__vybePgPool = pool;
}

let schemaReady: Promise<void> | null = null;

/**
 * Ensures the waitlist table exists. Runs once per process (memoized).
 */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = pool
      .query(
        `
        CREATE TABLE IF NOT EXISTS waitlist (
          id           BIGSERIAL PRIMARY KEY,
          email        TEXT NOT NULL,
          email_norm   TEXT NOT NULL UNIQUE,
          phone        TEXT,
          pass_number  TEXT NOT NULL,
          consent      BOOLEAN NOT NULL DEFAULT FALSE,
          source       TEXT,
          created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        `
      )
      .then(() => undefined)
      .catch((err) => {
        // Reset so a later request can retry schema creation.
        schemaReady = null;
        throw err;
      });
  }
  return schemaReady;
}

export interface WaitlistEntry {
  email: string;
  phone?: string | null;
  passNumber: string;
  consent: boolean;
  source?: string | null;
}

export interface InsertResult {
  status: "created" | "duplicate";
  passNumber: string;
  email: string;
}

/**
 * Inserts a waitlist entry. If the (normalized) email already exists, no new
 * row is written and the existing pass number is returned instead.
 */
export async function insertWaitlistEntry(
  entry: WaitlistEntry
): Promise<InsertResult> {
  await ensureSchema();

  const emailNorm = entry.email.trim().toLowerCase();

  const result = await pool.query<{ pass_number: string; email: string }>(
    `
    INSERT INTO waitlist (email, email_norm, phone, pass_number, consent, source)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (email_norm) DO NOTHING
    RETURNING pass_number, email;
    `,
    [
      entry.email.trim(),
      emailNorm,
      entry.phone?.trim() || null,
      entry.passNumber,
      entry.consent,
      entry.source ?? "web_waitlist_form",
    ]
  );

  if (result.rowCount && result.rowCount > 0) {
    return {
      status: "created",
      passNumber: result.rows[0].pass_number,
      email: result.rows[0].email,
    };
  }

  // Conflict: fetch the existing record's pass number.
  const existing = await pool.query<{ pass_number: string; email: string }>(
    `SELECT pass_number, email FROM waitlist WHERE email_norm = $1 LIMIT 1;`,
    [emailNorm]
  );

  return {
    status: "duplicate",
    passNumber: existing.rows[0]?.pass_number ?? entry.passNumber,
    email: existing.rows[0]?.email ?? entry.email.trim(),
  };
}
