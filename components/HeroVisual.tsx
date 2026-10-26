"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mouse tilt effect for the abstract club pass token
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Canvas-based generative flowing waves & ambient particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle system
    const particleCount = 38;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.6,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    let step = 0;

    const render = () => {
      step += 0.008;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle abstract flowing energy lines in #FCCA59
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const yOffset = height * (0.42 + i * 0.08);
        const waveSpeed = step * (1 + i * 0.3);
        ctx.moveTo(0, yOffset);

        for (let x = 0; x <= width; x += 20) {
          const wave1 = Math.sin(x * 0.003 + waveSpeed) * 35;
          const wave2 = Math.cos(x * 0.006 - waveSpeed * 0.8) * 15;
          ctx.lineTo(x, yOffset + wave1 + wave2);
        }

        ctx.strokeStyle =
          i === 0
            ? "rgba(252, 202, 89, 0.12)"
            : i === 1
            ? "rgba(255, 255, 255, 0.03)"
            : "rgba(254, 215, 122, 0.08)";
        ctx.lineWidth = i === 0 ? 2 : 1.5;
        ctx.stroke();
      }

      // Update and draw floating particles
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(252, 202, 89, ${p.opacity * 0.6})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[460px] md:min-h-[560px] flex items-center justify-center pointer-events-auto"
    >
      {/* Background Interactive Waves Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Layered Abstract Glowing Orbs in #FCCA59 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] rounded-full bg-[#FCCA59]/[0.10] blur-[110px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[320px] h-[220px] sm:h-[320px] rounded-full bg-[#FED77A]/[0.06] blur-[80px] pointer-events-none" />

      {/* Interactive 3D Holographic Club Access Token */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 w-[290px] sm:w-[360px] md:w-[400px] aspect-[1.58/1] rounded-[24px] p-6 sm:p-7 bg-gradient-to-br from-[#1b1812]/90 via-[#100e0a]/95 to-[#050505] border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(252,202,89,0.22)] backdrop-blur-2xl transition-shadow duration-300 group cursor-default"
      >
        {/* Subtle glass reflection gradient */}
        <div className="absolute inset-0 rounded-[24px] bg-gradient-to-tr from-transparent via-white/[0.04] to-[#FCCA59]/[0.10] pointer-events-none" />

        {/* Ambient Gold Corner Glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#FCCA59]/25 rounded-full blur-2xl group-hover:bg-[#FCCA59]/40 transition-all duration-500 pointer-events-none" />

        {/* Token Header */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FCCA59] shadow-[0_0_8px_#FCCA59]" />
            <span className="text-[11px] font-mono font-semibold tracking-wider text-white/90 uppercase">
              ALPHA TOKEN // TIER 01
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#FCCA59] px-2 py-0.5 rounded-full bg-[#FCCA59]/15 border border-[#FCCA59]/35">
            INVITE ONLY
          </span>
        </div>

        {/* Token Center Artwork - Abstract Waveform Glyph (NO literal cards/coins) */}
        <div className="relative z-10 my-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40 mb-1">
              PROTOCOL
            </p>
            <h4 className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-white font-[family-name:var(--font-syne)]">
              VYBE<span className="text-[#FCCA59]">CLUB</span>
            </h4>
          </div>

          <div className="flex items-end gap-1.5 h-10 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            {[40, 75, 100, 60, 90, 45, 80].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-[#FCCA59] rounded-full transition-all duration-300 group-hover:scale-y-110"
                style={{
                  height: `${h}%`,
                  opacity: 0.45 + (i % 3) * 0.25,
                }}
              />
            ))}
          </div>
        </div>

        {/* Token Footer */}
        <div className="relative z-10 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-white/50">
          <div>
            <span className="block text-white/30 text-[8px] uppercase tracking-wider">
              MEMBERSHIP
            </span>
            <span className="text-white/80 font-bold tracking-widest">
              #0000 • FOUNDING
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[#FCCA59]">
            <Sparkles className="w-3 h-3 animate-spin duration-[6000ms]" />
            <span className="tracking-widest uppercase text-[9px] font-bold">
              LAUNCH 2027
            </span>
          </div>
        </div>

        {/* Corner Cyber Accents */}
        <div className="absolute bottom-2 left-2 text-[7px] font-mono text-white/20 select-none">
          SYS.77//VYBE
        </div>
      </motion.div>
    </div>
  );
}
