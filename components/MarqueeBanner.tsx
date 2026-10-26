"use client";

export default function MarqueeBanner() {
  const items = [
    "YOUR MONEY. YOUR VYBE.",
    "THE NEXT MONEY CLUB",
    "NOT ANOTHER BANK",
    "DESIGNED FOR REAL LIFE",
    "FOUNDING DROP 2027",
    "LESS BORING FINANCE",
    "INVITE-ONLY ACCESS",
    "MORE FREEDOM. MORE CONTROL.",
  ];

  return (
    <div className="relative w-full overflow-hidden py-4 sm:py-5 border-y border-white/[0.08] bg-[#0c0c0c]/80 backdrop-blur-md select-none">
      {/* Edge gradient masks */}
      <div className="absolute top-0 left-0 w-24 sm:w-40 h-full bg-gradient-to-r from-[#070707] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 sm:w-40 h-full bg-gradient-to-l from-[#070707] to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {[...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span
              className={`text-xs sm:text-sm tracking-[0.2em] font-extrabold uppercase font-[family-name:var(--font-syne)] ${
                idx % 2 === 0 ? "text-white" : "text-[#FCCA59]"
              }`}
            >
              {text}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
          </div>
        ))}
      </div>
    </div>
  );
}
