"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#070707]/85 backdrop-blur-xl border-b border-white/[0.08] py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#"
            className="group flex items-center gap-2.5 focus:outline-none"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#FCCA59] shadow-[0_0_10px_#FCCA59] group-hover:scale-125 transition-transform duration-200" />
            <span className="font-extrabold tracking-[-0.04em] text-xl sm:text-2xl text-white font-[family-name:var(--font-syne)] uppercase">
              VYBE<span className="text-[#FCCA59]">CLUB</span>
            </span>
          </a>

          {/* Center / Right Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo("about")}
              className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              ABOUT
            </button>
            <button
              onClick={() => scrollTo("the-vybe")}
              className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              THE VYBE
            </button>
            <button
              onClick={() => scrollTo("waitlist")}
              className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              JOIN
            </button>
          </nav>

          {/* Right Status Badge & CTA */}
          <div className="hidden md:flex items-center gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono tracking-wider text-white/70">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FCCA59] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FCCA59]"></span>
              </span>
              COMING SOON • 2027
            </div>

            <button
              onClick={() => scrollTo("waitlist")}
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-[#FCCA59] hover:text-black hover:shadow-[0_0_20px_rgba(252,202,89,0.5)] transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span>GET IN</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FCCA59] animate-pulse" />
              2027
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/80 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#FCCA59]" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#070707]/95 backdrop-blur-2xl pt-24 px-6 flex flex-col justify-between pb-12 md:hidden">
          <div className="flex flex-col gap-6">
            <button
              onClick={() => scrollTo("about")}
              className="text-left font-display text-3xl font-bold tracking-tight text-white hover:text-[#FCCA59] transition-colors py-2 border-b border-white/10"
            >
              ABOUT
            </button>
            <button
              onClick={() => scrollTo("the-vybe")}
              className="text-left font-display text-3xl font-bold tracking-tight text-white hover:text-[#FCCA59] transition-colors py-2 border-b border-white/10"
            >
              THE VYBE
            </button>
            <button
              onClick={() => scrollTo("why-join")}
              className="text-left font-display text-3xl font-bold tracking-tight text-white hover:text-[#FCCA59] transition-colors py-2 border-b border-white/10"
            >
              WHY THE CLUB
            </button>
            <button
              onClick={() => scrollTo("waitlist")}
              className="text-left font-display text-3xl font-bold tracking-tight text-[#FCCA59] transition-colors py-2 border-b border-white/10"
            >
              JOIN WAITLIST
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-white/60 font-mono">
              <p className="text-white font-semibold mb-1">THE NEXT MONEY CLUB</p>
              <p>Exclusive access for Gen-Z. Closed alpha drops 2027.</p>
            </div>
            <button
              onClick={() => scrollTo("waitlist")}
              className="w-full py-4 rounded-2xl bg-[#FCCA59] text-black font-extrabold uppercase tracking-wider text-sm shadow-[0_0_25px_rgba(252,202,89,0.5)] cursor-pointer"
            >
              GET IN BEFORE EVERYONE ELSE
            </button>
          </div>
        </div>
      )}
    </>
  );
}
