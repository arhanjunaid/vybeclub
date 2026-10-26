"use client";

import { useEffect, useState } from "react";

export default function AmbientBackdrop() {
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [hasMouse, setHasMouse] = useState(false);

  useEffect(() => {
    // Check if device supports fine hover
    if (window.matchMedia("(pointer: fine)").matches) {
      setHasMouse(true);
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Noise Texture layer */}
      <div className="absolute inset-0 bg-grain opacity-60 mix-blend-overlay pointer-events-none" />

      {/* Subtle cursor spotlight on pointer devices */}
      {hasMouse && (
        <div
          className="absolute w-[500px] h-[500px] rounded-full bg-[#FCCA59]/[0.025] blur-[100px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out pointer-events-none"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        />
      )}

      {/* Fixed ambient glow spots */}
      <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-[#FCCA59]/[0.035] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-[600px] h-[600px] bg-[#FCCA59]/[0.03] rounded-full blur-[160px] pointer-events-none" />
    </div>
  );
}
