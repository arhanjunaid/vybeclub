import type { Metadata } from "next";
import { Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

export const metadata: Metadata = {
  title: "VYBE CLUB — Your Money. Your Vybe.",
  description:
    "A next-generation financial and social experience for Gen-Z. Something different is coming. Get in before everyone else.",
  keywords: ["VYBE CLUB", "Gen-Z", "money", "social", "fintech", "exclusive club", "waitlist"],
  openGraph: {
    title: "VYBE CLUB — Your Money. Your Vybe.",
    description: "Something different is coming. The next money club for Gen-Z.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VYBE CLUB — Your Money. Your Vybe.",
    description: "Something different is coming. Enter the club.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${syne.variable} dark scroll-smooth bg-[#070707] text-[#FFFFFF]`}
    >
      <body className="min-h-screen bg-[#070707] text-white selection:bg-[#CCFF00] selection:text-black antialiased overflow-x-hidden font-sans">
        {children}
      </body>
    </html>
  );
}
