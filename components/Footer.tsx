"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function Footer() {
  const [modalContent, setModalContent] = useState<{
    title: string;
    body: string;
  } | null>(null);

  const openModal = (type: "terms" | "contact") => {
    if (type === "terms") {
      setModalContent({
        title: "CLUB ACCESS TERMS",
        body: "VYBE CLUB founding cohort access is allocated strictly on invitation and waitlist chronological hierarchy. Membership tokens are non-transferable pre-launch. VYBE CLUB is not a licensed depository institution or chartered bank.",
      });
    } else {
      setModalContent({
        title: "COMMUNICATION CHANNELS",
        body: "For underground drops, partnerships, and press inquiries: info@vybeclub.co.in. Direct responses are issued exclusively to verified inquiries.",
      });
    }
  };

  return (
    <footer className="relative py-16 px-5 sm:px-8 border-t border-white/[0.08] bg-[#050505]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        
        {/* Brand & Slogan */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FCCA59]" />
            <span className="font-black tracking-[-0.03em] text-2xl text-white font-[family-name:var(--font-syne)] uppercase">
              VYBE<span className="text-[#FCCA59]">CLUB</span>
            </span>
          </div>
          <p className="text-sm text-white/50 font-mono tracking-wide">
            “Money. People. Life.”
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-mono uppercase tracking-wider text-white/60">
          <Link
            href="/privacy"
            className="hover:text-[#FCCA59] transition-colors cursor-pointer"
          >
            Privacy
          </Link>
          <button
            onClick={() => openModal("terms")}
            className="hover:text-[#FCCA59] transition-colors cursor-pointer"
          >
            Terms
          </button>
          <button
            onClick={() => openModal("contact")}
            className="hover:text-[#FCCA59] transition-colors cursor-pointer"
          >
            Contact
          </button>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="text-left md:text-right text-[11px] font-mono text-white/40 space-y-1">
          <p>© 2027 VYBE CLUB INC. ALL RIGHTS RESERVED.</p>
          <p className="text-white/25">NOT A BANK. A CULTURAL SHIFT.</p>
        </div>
      </div>

      {/* Info Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#111111] border border-white/15 text-white animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h4 className="font-mono text-sm tracking-wider font-bold text-[#FCCA59]">
                {modalContent.title}
              </h4>
              <button
                onClick={() => setModalContent(null)}
                className="p-1 text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-white/70 leading-relaxed font-sans">
              {modalContent.body}
            </p>
            <button
              onClick={() => setModalContent(null)}
              className="mt-6 w-full py-2.5 rounded-xl bg-white/10 hover:bg-[#FCCA59] hover:text-black text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
