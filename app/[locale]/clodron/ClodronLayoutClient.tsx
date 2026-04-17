"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Logo } from "@/app/components/Logo";
import { AdminSidebar } from "@/app/components/admin/sidebar";
import { Loader2, Lock, LogIn } from "lucide-react";

export function ClodronLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("clodron_verified");
    if (stored === "true") setPasswordVerified(true);
  }, []);

  useEffect(() => {
    if (!passwordVerified || !session) return;
    fetch("/api/admin/check-access")
      .then((r) => {
        setAccessGranted(r.ok);
        setAccessChecked(true);
      })
      .catch(() => {
        setAccessGranted(false);
        setAccessChecked(true);
      });
  }, [passwordVerified, session]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckingPassword(true);
    setPasswordError(false);

    try {
      const res = await fetch("/api/admin/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      });
      if (res.ok) {
        setPasswordVerified(true);
        sessionStorage.setItem("clodron_verified", "true");
      } else {
        setPasswordError(true);
      }
    } catch {
      setPasswordError(true);
    } finally {
      setCheckingPassword(false);
    }
  };

  if (isPending) {
    return (
      <div className="h-svh flex items-center justify-center bg-[#252224]">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!passwordVerified) {
    return (
      <div className="h-svh flex items-center justify-center bg-[#252224] px-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center gap-3 mb-10">
            <Logo className="w-9 h-9" />
            <span className="font-merienda font-bold text-2xl text-white">
              Admin Panel
            </span>
          </div>

          <div className="bg-[#1c1a1b] rounded-2xl border border-white/10 p-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mx-auto mb-6">
              <Lock className="w-5 h-5 text-white/60" />
            </div>
            <h2 className="text-lg font-chakra font-semibold text-white text-center uppercase tracking-wider mb-2">
              Erişim Şifresi
            </h2>
            <p className="text-sm text-white/40 font-sans text-center mb-6">
              Admin paneline erişmek için şifreyi girin.
            </p>

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Şifre"
                className="h-12 w-full rounded-xl border border-white/20 bg-white/5 px-4 text-sm text-white placeholder:text-white/30 focus:border-white/60 focus:bg-white/10 focus:outline-hidden transition-all font-sans"
              />
              {passwordError && (
                <p className="text-sm text-red-400 font-sans text-center">Geçersiz şifre.</p>
              )}
              <button
                type="submit"
                disabled={checkingPassword}
                className="h-12 w-full rounded-xl bg-white text-black font-semibold font-sans hover:bg-white/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {checkingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : "Giriş"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-svh flex items-center justify-center bg-[#252224] px-6">
        <div className="w-full max-w-sm text-center">
          <div className="flex items-center justify-center gap-3 mb-10">
            <Logo className="w-9 h-9" />
            <span className="font-merienda font-bold text-2xl text-white">
              Admin Panel
            </span>
          </div>

          <div className="bg-[#1c1a1b] rounded-2xl border border-white/10 p-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mx-auto mb-6">
              <LogIn className="w-5 h-5 text-white/60" />
            </div>
            <h2 className="text-lg font-chakra font-semibold text-white uppercase tracking-wider mb-2">
              Giriş Gerekli
            </h2>
            <p className="text-sm text-white/40 font-sans mb-6">
              Admin paneline erişmek için hesabınıza giriş yapın.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="h-12 w-full rounded-xl bg-white text-black font-semibold font-sans hover:bg-white/90 transition-colors cursor-pointer"
            >
              Giriş Yap
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!accessChecked) {
    return (
      <div className="h-svh flex items-center justify-center bg-[#252224]">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!accessGranted) {
    return (
      <div className="h-svh flex items-center justify-center bg-[#252224] px-6">
        <div className="w-full max-w-sm text-center">
          <div className="bg-[#1c1a1b] rounded-2xl border border-white/10 p-8">
            <h2 className="text-lg font-chakra font-semibold text-red-400 uppercase tracking-wider mb-2">
              Yetkisiz Erişim
            </h2>
            <p className="text-sm text-white/40 font-sans mb-6">
              Bu hesap admin paneline erişim yetkisine sahip değil.
            </p>
            <button
              onClick={() => router.push("/")}
              className="h-12 w-full rounded-xl bg-white/10 text-white font-semibold font-sans hover:bg-white/20 transition-colors cursor-pointer"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-svh bg-[#252224]">
      <AdminSidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <h1 className="font-chakra text-sm uppercase tracking-[0.15em] text-white/60">
            Admin Panel
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/40 font-sans">{session.user.email}</span>
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
