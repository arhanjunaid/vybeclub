import { Suspense } from "react";
import Link from "next/link";
import { Download, Search } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import DeleteButton from "@/components/admin/DeleteButton";
import { requireAdmin } from "@/lib/admin-auth";
import { ensureSchema, pool } from "@/lib/db";

const PAGE_SIZE = 50;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function AdminUsersPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<p className="p-8 text-sm font-mono text-white/40">Loading…</p>}>
      <UsersView searchParams={searchParams} />
    </Suspense>
  );
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

async function UsersView({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const sp = await searchParams;
  const q = first(sp.q).trim().slice(0, 100);
  const page = Math.max(1, Number.parseInt(first(sp.page), 10) || 1);

  await ensureSchema();

  // Escape LIKE wildcards so the search term is matched literally.
  const like = `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
  const where = q
    ? `WHERE email ILIKE $1 OR COALESCE(phone,'') ILIKE $1 OR pass_number ILIKE $1`
    : "";
  const filterParams = q ? [like] : [];

  const [stats, list] = await Promise.all([
    pool.query<{ total: number; matching: number; with_phone: number; last7: number }>(
      `SELECT
         (SELECT count(*)::int FROM waitlist) AS total,
         (SELECT count(*)::int FROM waitlist ${where}) AS matching,
         (SELECT count(*)::int FROM waitlist WHERE phone IS NOT NULL) AS with_phone,
         (SELECT count(*)::int FROM waitlist WHERE created_at > now() - interval '7 days') AS last7`,
      filterParams
    ),
    pool.query<{
      id: string;
      email: string;
      phone: string | null;
      pass_number: string;
      consent: boolean;
      created_at: Date;
    }>(
      `SELECT id, email, phone, pass_number, consent, created_at
       FROM waitlist ${where}
       ORDER BY created_at DESC
       LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`,
      filterParams
    ),
  ]);

  const s = stats.rows[0];
  const totalPages = Math.max(1, Math.ceil(s.matching / PAGE_SIZE));
  const pageHref = (p: number) => `/admin?${new URLSearchParams({ ...(q && { q }), page: String(p) })}`;
  const fmt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  return (
    <AdminShell active="users">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight font-[family-name:var(--font-syne)]">Waitlist</h1>
          <p className="text-xs font-mono text-white/40 mt-1">People who joined from the website</p>
        </div>
        {/* File download from a route handler, not a page navigation. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/admin/users/export"
          download
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-xs font-mono uppercase tracking-wider text-white/80 hover:border-[#FCCA59] hover:text-[#FCCA59] transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </a>
      </div>

      <dl className="grid grid-cols-3 gap-3 mb-6">
        {[
          ["Total", s.total],
          ["Last 7 days", s.last7],
          ["With phone", s.with_phone],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <dt className="text-[11px] font-mono uppercase tracking-widest text-white/40">{label}</dt>
            <dd className="mt-1 text-2xl font-black text-[#FCCA59]">{value}</dd>
          </div>
        ))}
      </dl>

      <form action="/admin" method="get" role="search" className="mb-4 flex gap-2">
        <input
          name="q"
          defaultValue={q}
          maxLength={100}
          placeholder="Search email, phone or pass number"
          aria-label="Search waitlist"
          className="flex-1 rounded-xl bg-white/[0.05] border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#FCCA59]/80"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-[#FCCA59] hover:text-black px-4 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          Search
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <caption className="sr-only">Waitlist sign-ups</caption>
          <thead className="bg-white/[0.04] text-left text-[11px] font-mono uppercase tracking-widest text-white/40">
            <tr>
              <th scope="col" className="px-4 py-3">Email</th>
              <th scope="col" className="px-4 py-3">Phone</th>
              <th scope="col" className="px-4 py-3">Pass</th>
              <th scope="col" className="px-4 py-3">Consent</th>
              <th scope="col" className="px-4 py-3">Joined (IST)</th>
              <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {list.rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-white/40 font-mono text-xs">
                  {q ? "No matches." : "No sign-ups yet."}
                </td>
              </tr>
            )}
            {list.rows.map((u) => (
              <tr key={u.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 text-white">{u.email}</td>
                <td className="px-4 py-3 text-white/70 font-mono">{u.phone ?? "—"}</td>
                <td className="px-4 py-3 text-[#FCCA59] font-mono">{u.pass_number}</td>
                <td className="px-4 py-3 text-white/70">{u.consent ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-white/60 whitespace-nowrap">{fmt.format(new Date(u.created_at))}</td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton
                    endpoint={`/api/admin/users/${u.id}`}
                    confirmText={`Remove ${u.email} from the waitlist? This cannot be undone.`}
                    label={`Remove ${u.email}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-4 flex items-center justify-between text-xs font-mono text-white/50">
          <span>
            Page {page} of {totalPages} · {s.matching} results
          </span>
          <span className="flex gap-4">
            {page > 1 && (
              <Link href={pageHref(page - 1)} className="hover:text-[#FCCA59]">
                ← Previous
              </Link>
            )}
            {page < totalPages && (
              <Link href={pageHref(page + 1)} className="hover:text-[#FCCA59]">
                Next →
              </Link>
            )}
          </span>
        </nav>
      )}
    </AdminShell>
  );
}
