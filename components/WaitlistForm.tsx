"use client";

import { useId, useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Check, Copy, Sparkles, ArrowRight, Loader2, MailCheck } from "lucide-react";

interface WaitlistFormProps {
  variant?: "hero" | "section";
  ctaText?: string;
  placeholder?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9][0-9\s().-]{6,19}$/;

export default function WaitlistForm({
  variant = "hero",
  ctaText = "GET IN",
  placeholder = "Enter your email",
}: WaitlistFormProps) {
  const uid = useId();
  const consentId = `${uid}-consent`;
  const errorId = `${uid}-error`;

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [passNumber, setPassNumber] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Restore state if this visitor already joined on this device
    const savedPass = localStorage.getItem("vybe_club_pass");
    const savedEmail = localStorage.getItem("vybe_club_email");
    if (savedPass && savedEmail) {
      setPassNumber(savedPass);
      setEmail(savedEmail);
      setSubmitted(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!EMAIL_RE.test(trimmedEmail)) {
      setError("Enter a valid email address");
      return;
    }
    if (trimmedPhone && !PHONE_RE.test(trimmedPhone)) {
      setError("Enter a valid phone number or leave it blank");
      return;
    }
    if (!consent) {
      setError("Please tick the consent box to join the waitlist");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          phone: trimmedPhone || undefined,
          consent,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data?.error || "Something went wrong. Please try again.");
        return;
      }

      const finalPass: string = data.passNumber;
      setPassNumber(finalPass);
      setDuplicate(Boolean(data.duplicate));
      setEmail(trimmedEmail);
      setSubmitted(true);
      localStorage.setItem("vybe_club_pass", finalPass);
      localStorage.setItem("vybe_club_email", trimmedEmail);

      if (!data.duplicate) {
        try {
          confetti({
            particleCount: 85,
            spread: 75,
            origin: { y: 0.65 },
            colors: ["#FCCA59", "#FED77A", "#FFFFFF", "#FFA500"],
          });
        } catch {
          // confetti is decorative only
        }
      }
    } catch (err) {
      console.warn("Waitlist request failed:", err);
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyInvite = () => {
    const text = `I just joined the VYBE CLUB waitlist ${passNumber}. Get in before everyone else: https://vybeclub.co.in`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-b from-[#141414] to-[#0a0a0a] border border-[#FCCA59]/35 shadow-[0_0_30px_rgba(252,202,89,0.18)] animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FCCA59] shadow-[0_0_10px_#FCCA59] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#FCCA59] font-bold">
              ACCESS PASS RESERVED
            </span>
          </div>
          <span className="font-mono text-sm font-bold text-white tracking-widest">
            {passNumber}
          </span>
        </div>

        <div className="text-center py-3">
          <h4 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-[family-name:var(--font-syne)] mb-1">
            {duplicate ? "YOU’RE ALREADY IN. 👀" : "YOU’RE IN. 👀"}
          </h4>
          <p className="text-sm text-white/70 font-sans mt-2">
            {duplicate
              ? "This email is already on the waitlist. Here is your original pass for "
              : "We’ve saved your spot for "}
            <span className="text-white font-medium">{email}</span>.
          </p>
          {!duplicate && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FCCA59]/10 border border-[#FCCA59]/25 text-[11px] font-mono text-[#FCCA59]">
              <MailCheck className="w-3.5 h-3.5" />
              <span>Confirmation sent from info@vybeclub.co.in</span>
            </div>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={copyInvite}
            type="button"
            className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-[#FCCA59] hover:text-black text-white text-xs font-mono font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 active:scale-98 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>LINK COPIED TO CLIPBOARD</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>SHARE WITH FRIENDS</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      data-variant={variant}
      className="w-full max-w-md mx-auto"
    >
      <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 sm:p-2 rounded-2xl sm:rounded-full bg-white/[0.05] border border-white/15 backdrop-blur-xl focus-within:border-[#FCCA59]/80 focus-within:shadow-[0_0_25px_rgba(252,202,89,0.25)] transition-all duration-300">
        <input
          type="email"
          value={email}
          disabled={loading}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          placeholder={placeholder}
          aria-label="Email address"
          autoComplete="email"
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="flex-1 bg-transparent px-4 sm:px-6 py-3.5 sm:py-3 text-sm text-white placeholder-white/40 focus:outline-none font-sans disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={loading}
          className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-3 rounded-xl sm:rounded-full bg-[#FCCA59] text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(252,202,89,0.35)] hover:shadow-[0_0_30px_rgba(252,202,89,0.6)] hover:bg-[#FED77A] active:scale-95 transition-all duration-200 cursor-pointer whitespace-nowrap disabled:opacity-80"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span>SAVING...</span>
            </>
          ) : (
            <>
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-black" />
            </>
          )}
        </button>
      </div>

      {/* Optional phone number */}
      <div className="mt-2.5 px-1.5 sm:px-2">
        <input
          type="tel"
          value={phone}
          disabled={loading}
          onChange={(e) => {
            setPhone(e.target.value);
            if (error) setError("");
          }}
          placeholder="Phone number (optional)"
          aria-label="Phone number (optional)"
          autoComplete="tel"
          inputMode="tel"
          className="w-full rounded-full bg-white/[0.03] border border-white/10 px-5 py-2.5 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#FCCA59]/60 font-sans disabled:opacity-50"
        />
      </div>

      {/* Consent */}
      <div className="mt-3 flex items-start gap-2.5 px-2 text-left">
        <input
          id={consentId}
          type="checkbox"
          checked={consent}
          disabled={loading}
          onChange={(e) => {
            setConsent(e.target.checked);
            if (error) setError("");
          }}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#FCCA59]"
        />
        <label
          htmlFor={consentId}
          className="text-[11px] leading-relaxed text-white/60 font-sans cursor-pointer"
        >
          I agree to VYBE CLUB storing my email (and phone, if provided) to
          contact me about launch updates and early access. I have read the{" "}
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FCCA59] underline underline-offset-2 hover:text-[#FED77A]"
          >
            Privacy Policy
          </Link>
          .
        </label>
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-rose-400 text-xs font-mono mt-2 ml-2 text-left animate-in fade-in"
        >
          {error}
        </p>
      )}

      {/* Micro-copy */}
      <div className="mt-3.5 flex items-center justify-center gap-2 text-[11px] font-mono text-white/40">
        <Sparkles className="w-3 h-3 text-[#FCCA59]" />
        <span>EARLY ACCESS WAITLIST • COMING 2027</span>
      </div>
    </form>
  );
}
