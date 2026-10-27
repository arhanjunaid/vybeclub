"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const uid = useId();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Enter the admin password");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Sign-in failed");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-sm space-y-4" noValidate>
      <div>
        <label htmlFor={uid} className="block text-xs font-mono uppercase tracking-widest text-white/50 mb-2">
          Admin password
        </label>
        <input
          id={uid}
          type="password"
          autoComplete="current-password"
          value={password}
          disabled={loading}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError("");
          }}
          aria-invalid={Boolean(error)}
          className="w-full rounded-xl bg-white/[0.05] border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FCCA59]/80 disabled:opacity-50"
        />
      </div>

      {error && (
        <p role="alert" className="text-rose-400 text-xs font-mono">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#FCCA59] text-black font-extrabold text-sm tracking-wider uppercase py-3 hover:bg-[#FED77A] transition-colors disabled:opacity-70 cursor-pointer"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
