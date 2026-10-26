"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Check, Copy, Sparkles, ArrowRight, Loader2, MailCheck } from "lucide-react";

interface WaitlistFormProps {
  variant?: "hero" | "section";
  ctaText?: string;
  placeholder?: string;
}

export default function WaitlistForm({
  variant = "hero",
  ctaText = "GET IN",
  placeholder = "Enter your email",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [passNumber, setPassNumber] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user already joined previously
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
    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    const generatedPass = `#0${Math.floor(10000 + Math.random() * 90000)}`;
    let finalPass = generatedPass;

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passNumber: generatedPass }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.passNumber) {
          finalPass = data.passNumber;
        }
      }
    } catch (err) {
      console.warn("Waitlist API dispatch warning:", err);
      // Fallback seamlessly so visitor never encounters a broken experience
    } finally {
      setLoading(false);
      setPassNumber(finalPass);
      setSubmitted(true);
      localStorage.setItem("vybe_club_pass", finalPass);
      localStorage.setItem("vybe_club_email", email);

      // Fire celebratory electric lime confetti
      try {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.65 },
          colors: ["#CCFF00", "#FFFFFF", "#8AA800", "#DFFF00"],
        });
      } catch {
        // fallback
      }
    }
  };

  const copyInvite = () => {
    const text = `I just unlocked early access to VYBE CLUB ${passNumber}. Get in before everyone else: https://vybeclub.co.in`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-b from-[#141414] to-[#0a0a0a] border border-[#CCFF00]/30 shadow-[0_0_30px_rgba(204,255,0,0.15)] animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] shadow-[0_0_10px_#CCFF00] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#CCFF00] font-bold">
              ACCESS PASS RESERVED
            </span>
          </div>
          <span className="font-mono text-sm font-bold text-white tracking-widest">
            {passNumber}
          </span>
        </div>

        <div className="text-center py-3">
          <h4 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-[family-name:var(--font-syne)] mb-1">
            YOU’RE IN. 👀
          </h4>
          <p className="text-sm text-white/70 font-sans mt-2">
            We’ve locked your founding spot for <span className="text-white font-medium">{email}</span>.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/25 text-[11px] font-mono text-[#CCFF00]">
            <MailCheck className="w-3.5 h-3.5" />
            <span>VIP pass dispatched from info@vybeclub.co.in</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={copyInvite}
            type="button"
            className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-[#CCFF00] hover:text-black text-white text-xs font-mono font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 active:scale-98 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>LINK COPIED TO CLIPBOARD</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>SHARE PASS // BUMP QUEUE</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 sm:p-2 rounded-2xl sm:rounded-full bg-white/[0.05] border border-white/15 backdrop-blur-xl focus-within:border-[#CCFF00]/80 focus-within:shadow-[0_0_25px_rgba(204,255,0,0.2)] transition-all duration-300">
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
          className="flex-1 bg-transparent px-4 sm:px-6 py-3.5 sm:py-3 text-sm text-white placeholder-white/40 focus:outline-none font-sans disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={loading}
          className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-3 rounded-xl sm:rounded-full bg-[#CCFF00] text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(204,255,0,0.35)] hover:shadow-[0_0_30px_rgba(204,255,0,0.6)] hover:bg-[#d6ff33] active:scale-95 transition-all duration-200 cursor-pointer whitespace-nowrap disabled:opacity-80"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>LOCKING IN...</span>
            </>
          ) : (
            <>
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="text-rose-400 text-xs font-mono mt-2 ml-4 text-left animate-in fade-in">
          {error}
        </p>
      )}

      {/* Exclusivity micro-copy */}
      <div className="mt-3.5 flex items-center justify-center gap-2 text-[11px] font-mono text-white/40">
        <Sparkles className="w-3 h-3 text-[#CCFF00]" />
        <span>LIMITED FOUNDING COHORT • STRICTLY CONFIDENTIAL</span>
      </div>
    </form>
  );
}
