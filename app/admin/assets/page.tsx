import { Suspense } from "react";
import { Download, ExternalLink, FileText } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AssetForms from "@/components/admin/AssetForms";
import DeleteButton from "@/components/admin/DeleteButton";
import { requireAdmin } from "@/lib/admin-auth";
import { ensureSchema, pool } from "@/lib/db";
import { formatBytes } from "@/lib/assets";

interface Asset {
  id: string;
  kind: "document" | "image" | "link";
  title: string;
  description: string | null;
  category: string | null;
  url: string | null;
  filename: string | null;
  size_bytes: number | null;
  created_at: Date;
}

function Section({ id, title, count, children }: { id: string; title: string; count: number; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-10">
      <h2 id={id} className="text-sm font-mono uppercase tracking-widest text-[#FCCA59] mb-3">
        {title} <span className="text-white/40">({count})</span>
      </h2>
      {count === 0 ? <p className="text-xs font-mono text-white/40">Nothing here yet.</p> : children}
    </section>
  );
}

export default function AdminAssetsPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm font-mono text-white/40">Loading…</p>}>
      <AssetsView />
    </Suspense>
  );
}

async function AssetsView() {
  await requireAdmin();
  await ensureSchema();

  // Never select the file bytes for listings.
  const { rows } = await pool.query<Asset>(
    `SELECT id, kind, title, description, category, url, filename, size_bytes, created_at
     FROM admin_assets ORDER BY created_at DESC`
  );

  const docs = rows.filter((r) => r.kind === "document");
  const images = rows.filter((r) => r.kind === "image");
  const links = rows.filter((r) => r.kind === "link");
  const fmt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" });

  const meta = (a: Asset) => (
    <p className="mt-1 text-[11px] font-mono text-white/40">
      {[a.category, fmt.format(new Date(a.created_at))].filter(Boolean).join(" · ")}
    </p>
  );

  return (
    <AdminShell active="assets">
      <h1 className="text-3xl font-black uppercase tracking-tight font-[family-name:var(--font-syne)]">Business assets</h1>
      <p className="text-xs font-mono text-white/40 mt-1 mb-6">Documents, images and links. Only visible to signed-in admins.</p>

      <AssetForms />

      <Section id="docs" title="Documents" count={docs.length}>
        <ul className="divide-y divide-white/[0.06] rounded-2xl border border-white/10">
          {docs.map((a) => (
            <li key={a.id} className="flex items-center gap-4 px-4 py-3">
              <FileText className="w-5 h-5 text-white/40 shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white">{a.title}</p>
                {meta(a)}
                {a.description && <p className="mt-1 text-xs text-white/50">{a.description}</p>}
              </div>
              <span className="hidden sm:block text-[11px] font-mono text-white/40">{formatBytes(a.size_bytes)}</span>
              <a
                href={`/api/admin/assets/${a.id}`}
                aria-label={`Download ${a.title}`}
                className="p-1.5 rounded-lg text-white/50 hover:text-[#FCCA59] hover:bg-white/5"
              >
                <Download className="w-4 h-4" />
              </a>
              <DeleteButton endpoint={`/api/admin/assets/${a.id}`} confirmText={`Delete “${a.title}”? This cannot be undone.`} label={`Delete ${a.title}`} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="images" title="Images" count={images.length}>
        <ul className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((a) => (
            <li key={a.id} className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.03]">
              <a href={`/api/admin/assets/${a.id}`} target="_blank" rel="noopener noreferrer" className="block aspect-video bg-black/40">
                {/* Auth-protected dynamic URL, so next/image optimisation does not apply. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/admin/assets/${a.id}`} alt={a.title} loading="lazy" className="h-full w-full object-cover" />
              </a>
              <div className="flex items-start justify-between gap-2 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-white">{a.title}</p>
                  {meta(a)}
                </div>
                <DeleteButton endpoint={`/api/admin/assets/${a.id}`} confirmText={`Delete “${a.title}”? This cannot be undone.`} label={`Delete ${a.title}`} />
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="links" title="Links" count={links.length}>
        <ul className="divide-y divide-white/[0.06] rounded-2xl border border-white/10">
          {links.map((a) => (
            <li key={a.id} className="flex items-center gap-4 px-4 py-3">
              <ExternalLink className="w-5 h-5 text-white/40 shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <a
                  href={a.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate text-sm text-white hover:text-[#FCCA59]"
                >
                  {a.title}
                </a>
                <p className="truncate text-[11px] font-mono text-white/40">{a.url}</p>
                {meta(a)}
                {a.description && <p className="mt-1 text-xs text-white/50">{a.description}</p>}
              </div>
              <DeleteButton endpoint={`/api/admin/assets/${a.id}`} confirmText={`Delete “${a.title}”?`} label={`Delete ${a.title}`} />
            </li>
          ))}
        </ul>
      </Section>
    </AdminShell>
  );
}
