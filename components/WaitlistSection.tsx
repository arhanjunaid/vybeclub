"use client";

import { useState, useEffect } from "react";
import WaitlistForm from "./WaitlistForm";
import { ShieldCheck, Lock, Users } from "lucide-react";

export default function WaitlistSection() {
  const [memberCount, setMemberCount] = useState(14892);

  // Subtle live ticker effect to create natural urgency and community feel
  useEffect(() => {
    const interval = setInterval(() => {
      setMemberCount((prev) => prev + (Math.random() > 0.4 ? 1 : 0));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="waitlist" className="relative py-28 sm:py-36 px-5 sm:px-8 border-t border-white/[0.08] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#CCFF00]/[0.06] blur-[150px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Live members queued pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-white/80 mb-8 backdrop-blur-md">
          <Users className="w-3.5 h-3.5 text-[#CCFF00]" />
          <span>
            <strong className="text-[#CCFF00] font-bold">
              {memberCount.toLocaleString()}
            </strong>{" "}
            PEOPLE ON THE PRIVATE LIST
          </span>
        </div>

        {/* Big Headline */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-[-0.04em] uppercase text-white font-[family-name:var(--font-syne)] leading-[0.95]">
          GET IN BEFORE <br />
          <span className="text-[#CCFF00] drop-shadow-[0_0_35px_rgba(204,255,0,0.3)]">
            EVERYONE ELSE.
          </span>
        </h2>

        {/* Subtext */}
        <p className="mt-6 text-base sm:text-xl text-white/70 max-w-xl mx-auto font-light leading-relaxed">
          The club is opening soon. Leave your email and be first in.
        </p>

        {/* Waitlist Form with CTA: JOIN THE CLUB */}
        <div className="mt-10 sm:mt-12">
          <WaitlistForm variant="section" ctaText="JOIN THE CLUB" />
        </div>

        {/* Security / Privacy trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-white/40">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-white/30" />
            <span>NO SPAM EVER</span>
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#CCFF00]" />
            <span>ENCRYPTED ACCESS</span>
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-1.5">
            <span>DROP COHORT 01 // 2027</span>
          </div>
        </div>
      </div>
    </section>
  );
}
