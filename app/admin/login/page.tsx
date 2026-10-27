import LoginForm from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 gap-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FCCA59]" />
          <span className="font-black tracking-tight text-2xl font-[family-name:var(--font-syne)] uppercase">
            VYBE<span className="text-[#FCCA59]">CLUB</span>
          </span>
        </div>
        <p className="text-xs font-mono tracking-widest text-white/40 uppercase">Admin access</p>
      </div>
      <LoginForm />
    </main>
  );
}
