import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarqueeBanner from "@/components/MarqueeBanner";
import ComingSoonSection from "@/components/ComingSoonSection";
import WhyJoinSection from "@/components/WhyJoinSection";
import WaitlistSection from "@/components/WaitlistSection";
import SocialSection from "@/components/SocialSection";
import Footer from "@/components/Footer";
import AmbientBackdrop from "@/components/AmbientBackdrop";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#070707] text-white selection:bg-[#CCFF00] selection:text-black">
      {/* Ambient background particles & cursor spotlight */}
      <AmbientBackdrop />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Infinite Marquee Ticker */}
      <MarqueeBanner />

      {/* Coming Soon Section */}
      <ComingSoonSection />

      {/* Why Join The Club Section */}
      <WhyJoinSection />

      {/* Secondary Marquee / Divider */}
      <div className="py-6 border-y border-white/[0.06] bg-[#090909] text-center">
        <p className="text-xs sm:text-sm font-mono tracking-[0.25em] text-white/50 uppercase">
          THE CLUB IS COMING • DROP 01 ALPHA • EXCLUSIVE ACCESS
        </p>
      </div>

      {/* Final High-Impact Waitlist Section */}
      <WaitlistSection />

      {/* Social Section */}
      <SocialSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
