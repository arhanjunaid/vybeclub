"use client";

import { motion } from "framer-motion";
import { Zap, Users, TrendingUp, Sparkles, ArrowUpRight } from "lucide-react";

interface Pillar {
  tag: string;
  title: string;
  description: string;
  icon: typeof Zap;
  accent: string;
  pattern: string;
}

export default function ComingSoonSection() {
  const pillars: Pillar[] = [
    {
      tag: "01 // FLOW",
      title: "SPEND",
      description: "Make better moves.",
      icon: Zap,
      accent: "from-[#CCFF00]/20 to-transparent",
      pattern: "kinetic-wave",
    },
    {
      tag: "02 // CIRCLE",
      title: "SHARE",
      description: "Money with your people.",
      icon: Users,
      accent: "from-white/15 to-transparent",
      pattern: "mesh-nodes",
    },
    {
      tag: "03 // MOMENTUM",
      title: "GROW",
      description: "Build your future.",
      icon: TrendingUp,
      accent: "from-[#CCFF00]/15 to-transparent",
      pattern: "pulse-orbit",
    },
    {
      tag: "04 // CULTURE",
      title: "LIVE",
      description: "Enjoy the now.",
      icon: Sparkles,
      accent: "from-white/10 to-transparent",
      pattern: "ripple-wave",
    },
  ];

  return (
    <section id="the-vybe" className="relative py-28 sm:py-36 px-5 sm:px-8 max-w-7xl mx-auto">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-[#CCFF00]/[0.04] blur-[120px] pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="max-w-3xl mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono tracking-widest text-[#CCFF00] uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
          MANIFESTO // 01
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-[-0.04em] uppercase text-white font-[family-name:var(--font-syne)] leading-[0.95]">
          WE’RE BUILDING <br className="hidden sm:inline" />
          <span className="text-[#CCFF00] drop-shadow-[0_0_35px_rgba(204,255,0,0.35)]">THE VYBE.</span>
        </h2>

        <div className="mt-8 space-y-2 text-lg sm:text-2xl text-white/70 font-light leading-relaxed">
          <p className="text-white font-medium">Not another boring money app.</p>
          <p className="text-white font-medium">Not another bank.</p>
          <p className="text-white/60">
            A new space for the way Gen-Z actually lives, spends, shares and plans.
          </p>
        </div>
      </div>

      {/* 4 Animated Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-[24px] p-7 sm:p-8 bg-gradient-to-b from-[#141414] to-[#0a0a0a] border border-white/[0.08] hover:border-[#CCFF00]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(204,255,0,0.12)] cursor-default"
            >
              {/* Subtle top glow line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#CCFF00]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Background gradient sweep */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${pillar.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              />

              {/* Card Top: Tag + Micro-icon */}
              <div className="relative z-10 flex items-center justify-between pb-8">
                <span className="text-[11px] font-mono tracking-wider text-white/40 group-hover:text-[#CCFF00] transition-colors">
                  {pillar.tag}
                </span>
                <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/80 group-hover:text-black group-hover:bg-[#CCFF00] group-hover:border-[#CCFF00] transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Card Abstract Kinetic Graphic (NO coins or cards!) */}
              <div className="relative z-10 my-6 h-28 flex items-center justify-center">
                {pillar.pattern === "kinetic-wave" && (
                  <div className="w-full flex items-center justify-center gap-1.5 h-16">
                    {[20, 50, 80, 40, 95, 30, 70, 45, 60].map((h, i) => (
                      <span
                        key={i}
                        className="w-1.5 rounded-full bg-white/20 group-hover:bg-[#CCFF00] transition-all duration-300"
                        style={{
                          height: `${h}%`,
                          transitionDelay: `${i * 30}ms`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {pillar.pattern === "mesh-nodes" && (
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="absolute w-20 h-20 rounded-full border border-white/10 group-hover:border-[#CCFF00]/30 transition-colors" />
                    <div className="absolute w-12 h-12 rounded-full border border-dashed border-white/20 group-hover:border-[#CCFF00]/50 animate-spin duration-[10000ms]" />
                    <div className="w-3 h-3 rounded-full bg-[#CCFF00] shadow-[0_0_12px_#CCFF00]" />
                    <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-white/60" />
                    <span className="absolute bottom-1 -left-1 w-2 h-2 rounded-full bg-white/40" />
                  </div>
                )}

                {pillar.pattern === "pulse-orbit" && (
                  <div className="relative flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-[#CCFF00]/30 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-[#CCFF00] shadow-[0_0_10px_#CCFF00] group-hover:scale-125 transition-transform" />
                      </div>
                    </div>
                  </div>
                )}

                {pillar.pattern === "ripple-wave" && (
                  <div className="relative flex items-center justify-center w-24 h-24">
                    <div className="absolute inset-0 rounded-2xl border border-white/10 rotate-12 group-hover:rotate-45 group-hover:border-[#CCFF00]/40 transition-all duration-500" />
                    <div className="absolute inset-2 rounded-2xl border border-white/20 -rotate-6 group-hover:rotate-12 transition-transform duration-500" />
                    <Sparkles className="w-6 h-6 text-[#CCFF00] relative z-10" />
                  </div>
                )}
              </div>

              {/* Card Bottom: Title + Short copy */}
              <div className="relative z-10 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-black tracking-tight text-white font-[family-name:var(--font-syne)] uppercase group-hover:text-[#CCFF00] transition-colors">
                    {pillar.title}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-[#CCFF00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <p className="text-sm text-white/60 font-sans group-hover:text-white/80 transition-colors">
                  “{pillar.description}”
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
