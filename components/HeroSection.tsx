"use client";

import { motion } from "framer-motion";
import WaitlistForm from "./WaitlistForm";
import HeroVisual from "./HeroVisual";
import { ArrowDown, Radio } from "lucide-react";

export default function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen pt-32 sm:pt-40 pb-20 px-5 sm:px-8 flex flex-col justify-between overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col items-center justify-center text-center">
        
        {/* Small badge above headline */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono tracking-widest text-[#FCCA59] uppercase mb-8 backdrop-blur-xl shadow-[0_0_20px_rgba(252,202,89,0.2)]"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse text-[#FCCA59]" />
          <span>THE NEXT MONEY CLUB • COMING SOON // 2027</span>
        </motion.div>

        {/* Large Centered Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-5xl"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-[-0.05em] text-white font-[family-name:var(--font-syne)] leading-[0.92] select-none">
            YOUR MONEY. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-[#fff8ec] to-[#FCCA59] drop-shadow-[0_0_40px_rgba(252,202,89,0.4)]">
              YOUR VYBE.
            </span>
          </h1>
        </motion.div>

        {/* Supporting Lines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-8 max-w-2xl space-y-3"
        >
          <p className="text-lg sm:text-xl font-medium text-[#FCCA59] tracking-wide uppercase font-mono">
            “Something different is coming.”
          </p>
          <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed">
            VYBE CLUB is building a new way for the next generation to experience money, friends, goals and everyday life.
          </p>
        </motion.div>

        {/* Waitlist Form with Primary CTA & Exclusive feel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 sm:mt-12 w-full max-w-lg"
        >
          <WaitlistForm variant="hero" ctaText="GET IN" />
        </motion.div>

        {/* Action Buttons row (Primary CTA: JOIN THE WAITLIST / Secondary CTA: FOLLOW THE VYBE) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono tracking-wider uppercase"
        >
          <button
            onClick={() => scrollTo("waitlist")}
            className="text-white/60 hover:text-white underline underline-offset-4 decoration-[#FCCA59]/50 hover:decoration-[#FCCA59] transition-colors cursor-pointer"
          >
            [ JOIN THE WAITLIST ]
          </button>
          <span className="text-white/20">•</span>
          <button
            onClick={() => scrollTo("the-vybe")}
            className="text-white/60 hover:text-[#FCCA59] transition-colors cursor-pointer"
          >
            FOLLOW THE VYBE ↓
          </button>
        </motion.div>

        {/* Abstract Hero Visual (Flowing waves, glowing orbs, micro-particles, 3D token) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="w-full mt-10 sm:mt-14"
        >
          <HeroVisual />
        </motion.div>

      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-8 text-white/30 text-[11px] font-mono tracking-widest uppercase">
        <span className="mb-2">EXPLORE PROTOCOL</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#FCCA59]" />
      </div>
    </section>
  );
}
