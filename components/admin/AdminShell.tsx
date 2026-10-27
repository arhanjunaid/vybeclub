import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function AdminShell({
  active,
  children,
}: {
  active: "users" | "assets";
  children: React.ReactNode;
}) {
  const link = (href: string, label: string, key: "users" | "assets") => (
    <Link
      href={href}
      aria-current={active === key ? "page" : undefined}
      className={`text-xs font-mono uppercase tracking-wider pb-1 border-b-2 transition-colors ${
        active === key
          ? "text-[#FCCA59] border-[#FCCA59]"
          : "text-white/60 border-transparent hover:text-white"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <header className="border-b border-white/10 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FCCA59]" />
            <span className="font-black tracking-tight text-lg font-[family-name:var(--font-syne)] uppercase">
              VYBE<span className="text-[#FCCA59]">CLUB</span>
            </span>
            <span className="ml-2 text-[10px] font-mono tracking-widest text-white/40 uppercase">Admin</span>
          </div>
          <nav aria-label="Admin" className="flex items-center gap-6">
            {link("/admin", "Waitlist", "users")}
            {link("/admin/assets", "Business assets", "assets")}
          </nav>
          <LogoutButton />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8">{children}</main>
    </>
  );
}
