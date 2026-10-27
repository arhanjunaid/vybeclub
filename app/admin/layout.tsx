import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — VYBE CLUB",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#070707] text-white">{children}</div>;
}
