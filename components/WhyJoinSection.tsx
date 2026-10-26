"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";

export default function WhyJoinSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const statements = [
    {
      num: "01",
      title: "Built for your generation.",
      meta: "CULTURE FIRST // NO LEGACY BAGGAGE",
    },
    {
      num: "02",
      title: "Designed around real life.",
      meta: "FITS YOUR SCHEDULE, NOT BANK HOURS",
    },
    {
      num: "03",
      title: "Less boring finance.",
      meta: "ZERO SUITS // PURE UTILITY & STYLE",
    },
    {
      num: "04",
      title: "More control. More freedom.",
      meta: "YOUR PACE // UNRESTRICTED ACCESS",
    },
    {
      num: "05",
      title: "Your money. Your people. Your rules.",
      meta: "THE NEW PARADIGM // PRIVATE ACCESS",
    },
  ];

  return (
    <section id="why-join" className="relative py-28 sm:py-36 px-5 sm:px-8 border-t border-white/[0.08] bg-[#070707]">
      {/* Background radial glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#FCCA59]/[0.04] blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-20">
          
          {/* Left Column: Heading and Brand Stance */}
          <div className="lg:w-5/12 lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono tracking-widest text-[#FCCA59] uppercase mb-6">
              <Flame className="w-3.5 h-3.5 text-[#FCCA59]" />
              THE CLUB PHILOSOPHY
            </div>

            <h2 className="text-4xl sm:text-6xl font-black tracking-[-0.04em] uppercase text-white font-[family-name:var(--font-syne)] leading-[0.95]">
              WHY JOIN <br />
              <span className="text-[#FCCA59]">THE CLUB?</span>
            </h2>

            <p className="mt-6 text-base sm:text-lg text-white/60 font-light max-w-md leading-relaxed">
              We ditched the spreadsheets, branch visits, and stiff corporate language. VYBE CLUB is built from the ground up for culture, speed, and real social rhythm.
            </p>

            <div className="mt-10 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] max-w-sm backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-mono text-white/40 mb-2">
                <span>FOUNDING ROSTER</span>
                <span className="text-[#FCCA59] font-bold">STAGE 01</span>
              </div>
              <p className="text-sm text-white/90 font-medium">
                Waitlist spots are prioritized chronologically. Early members unlock perpetual founding privileges.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Editorial Statement List */}
          <div className="lg:w-7/12 flex flex-col divide-y divide-white/[0.08]">
            {statements.map((item, idx) => {
              const isHovered = hoveredIdx === idx;
              const hasActiveHover = hoveredIdx !== null;

              return (
                <motion.div
                  key={item.num}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`group relative py-8 sm:py-10 transition-all duration-300 cursor-pointer flex flex-col justify-center ${
                    hasActiveHover && !isHovered ? "opacity-35" : "opacity-100"
                  }`}
                >
                  {/* Subtle hover neon bar on left */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 bg-[#FCCA59] rounded-r-full transition-transform duration-300 origin-left ${
                      isHovered ? "scale-y-100" : "scale-y-0"
                    }`}
                  />

                  <div className="flex items-start justify-between gap-4 pl-3 sm:pl-5">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono tracking-widest text-[#FCCA59] font-bold">
                          {item.num}
                        </span>
                        <span className="text-[10px] font-mono tracking-wider text-white/40 uppercase">
                          {item.meta}
                        </span>
                      </div>

                      <h3
                        className={`text-2xl sm:text-4xl font-extrabold tracking-tight transition-colors duration-200 font-[family-name:var(--font-syne)] ${
                          isHovered ? "text-[#FCCA59]" : "text-white"
                        }`}
                      >
                        “{item.title}”
                      </h3>
                    </div>

                    <div
                      className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isHovered
                          ? "bg-[#FCCA59] text-black border-[#FCCA59] translate-x-1 shadow-[0_0_15px_rgba(252,202,89,0.6)]"
                          : "border-white/10 text-white/40"
                      }`}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
