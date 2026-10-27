"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteButtonProps {
  endpoint: string;
  confirmText: string;
  label: string;
}

export default function DeleteButton({ endpoint, confirmText, label }: DeleteButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const remove = async () => {
    if (!window.confirm(confirmText)) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Delete failed");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={remove}
        disabled={busy}
        aria-label={label}
        title={label}
        className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-white/5 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
      {error && (
        <span role="alert" className="text-[11px] font-mono text-rose-400">
          {error}
        </span>
      )}
    </span>
  );
}
