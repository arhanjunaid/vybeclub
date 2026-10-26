"use client";

import { ArrowUpRight } from "lucide-react";

export default function SocialSection() {
  const socials = [
    {
      name: "Instagram",
      handle: "@vybeclub",
      tag: "VISUALS // STORIES",
      href: "https://instagram.com",
    },
    {
      name: "TikTok",
      handle: "@vybeclub",
      tag: "DROPS // BEHIND THE SCENES",
      href: "https://tiktok.com",
    },
    {
      name: "X",
      handle: "@vybeclub",
      tag: "ANNOUNCEMENTS // UPDATES",
      href: "https://x.com",
    },
  ];

  return (
    <section className="relative py-20 px-5 sm:px-8 border-t border-white/[0.08] bg-[#090909]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#FCCA59] uppercase block mb-3">
            COMMUNITY & DROPS
          </span>
          <h3 className="text-3xl sm:text-5xl font-black uppercase text-white font-[family-name:var(--font-syne)] tracking-tight">
            FOLLOW THE VYBE.
          </h3>
        </div>

        {/* Social Links Cards */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 px-5 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#FCCA59] hover:bg-white/[0.08] transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <div>
                <span className="text-sm font-bold text-white block group-hover:text-[#FCCA59] transition-colors">
                  {s.name}
                </span>
                <span className="text-[10px] font-mono text-white/40 block">
                  {s.handle}
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-[#FCCA59] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
