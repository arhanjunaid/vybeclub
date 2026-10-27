"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, ImageIcon, Link2, Loader2, Plus } from "lucide-react";

type Kind = "document" | "image" | "link";

const TABS: { kind: Kind; label: string; icon: typeof FileText }[] = [
  { kind: "document", label: "Document", icon: FileText },
  { kind: "image", label: "Image", icon: ImageIcon },
  { kind: "link", label: "Link", icon: Link2 },
];

const ACCEPT: Record<Exclude<Kind, "link">, string> = {
  document: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.md,.zip",
  image: ".png,.jpg,.jpeg,.webp,.gif",
};

const MAX_BYTES = 4 * 1024 * 1024;

const inputCls =
  "w-full rounded-xl bg-white/[0.05] border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#FCCA59]/80 disabled:opacity-50";

export default function AssetForms() {
  const router = useRouter();
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [kind, setKind] = useState<Kind>("document");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setOk(false);
    const fd = new FormData(e.currentTarget);

    let init: RequestInit;
    if (kind === "link") {
      init = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: fd.get("title"),
          url: fd.get("url"),
          category: fd.get("category"),
          description: fd.get("description"),
        }),
      };
    } else {
      const file = fd.get("file");
      if (!(file instanceof File) || file.size === 0) {
        setError("Choose a file to upload");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError("File is larger than 4 MB");
        return;
      }
      fd.set("kind", kind);
      init = { method: "POST", body: fd };
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/assets", init);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Could not save");
        return;
      }
      formRef.current?.reset();
      setOk(true);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div role="tablist" aria-label="Asset type" className="flex gap-2 mb-5">
        {TABS.map(({ kind: k, label, icon: Icon }) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={kind === k}
            onClick={() => {
              setKind(k);
              setError("");
              setOk(false);
            }}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-mono uppercase tracking-wider border transition-colors cursor-pointer ${
              kind === k
                ? "bg-[#FCCA59] text-black border-[#FCCA59]"
                : "border-white/15 text-white/60 hover:text-white"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      <form key={kind} ref={formRef} onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
        {kind === "link" ? (
          <>
            <input name="title" required maxLength={200} placeholder="Title (e.g. Investor deck folder)" aria-label="Title" disabled={loading} className={inputCls} />
            <input name="url" required placeholder="https://…" aria-label="Link URL" inputMode="url" disabled={loading} className={inputCls} />
          </>
        ) : (
          <>
            <input name="title" maxLength={200} placeholder="Title (optional, defaults to file name)" aria-label="Title" disabled={loading} className={inputCls} />
            <input
              id={`${uid}-file`}
              name="file"
              type="file"
              accept={ACCEPT[kind]}
              aria-label={`${kind} file`}
              disabled={loading}
              className={`${inputCls} file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1 file:text-xs file:text-white`}
            />
          </>
        )}
        <input name="category" maxLength={60} placeholder="Category (e.g. Legal, Brand, Finance)" aria-label="Category" disabled={loading} className={inputCls} />
        <input name="description" maxLength={1000} placeholder="Notes (optional)" aria-label="Notes" disabled={loading} className={inputCls} />

        <div className="sm:col-span-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FCCA59] text-black font-extrabold text-xs tracking-wider uppercase px-5 py-2.5 hover:bg-[#FED77A] transition-colors disabled:opacity-70 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {loading ? "Saving..." : `Add ${kind}`}
          </button>
          {kind !== "link" && (
            <span className="text-[11px] font-mono text-white/40">Max 4 MB</span>
          )}
          {error && (
            <span role="alert" className="text-xs font-mono text-rose-400">
              {error}
            </span>
          )}
          {ok && !error && (
            <span role="status" className="text-xs font-mono text-emerald-400">
              Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
