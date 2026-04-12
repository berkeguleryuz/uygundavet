"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Logo } from "@/app/components/Logo";

export default function LoginPage() {
  const t = useTranslations("Login");
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (!isPending && session) {
      router.push("/dashboard");
    }
  }, [isPending, session, router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setAuthLoading(true);

    try {
      if (isRegister) {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name: "",
        });
        if (error) {
          toast.error(error.message || t("emailExists"));
        } else {
          toast.success(t("registerSuccess"));
        }
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });
        if (error) {
          toast.error(t("loginError"));
        } else {
          toast.success(t("loginSuccess"));
        }
      }
    } catch {
      toast.error(t("loginError"));
    } finally {
      setAuthLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="h-svh flex items-center justify-center bg-[#252224]">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (session) return null;

  return (
    <div className="h-svh flex bg-[#252224]">
      {/* Left - Image */}
      <div className="hidden lg:block relative w-1/2 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=2000&q=90"
          alt="Wedding"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#252224]" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute bottom-12 left-12 right-12">
          <p className="text-white/60 text-sm font-sans tracking-wide uppercase mb-3">
            {t("imageCaption")}
          </p>
          <h2 className="text-white text-3xl font-merienda leading-snug">
            {t("imageHeading")}
          </h2>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 sm:px-16 relative">
        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center gap-2.5 text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-sans">{t("backToHome")}</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <div className="flex items-center gap-3 mb-10">
            <Logo className="w-9 h-9" />
            <span className="font-merienda font-bold text-2xl text-white">
              Uygun Davet
            </span>
          </div>

          <h1 className="text-3xl font-chakra font-semibold text-white uppercase tracking-tight mb-2">
            {t("heading")}
          </h1>
          <p className="text-white/50 font-sans text-sm mb-8">
            {t("subtitle")}
          </p>

          {showEmailForm ? (
            <motion.form
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleEmailAuth}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h3 className="text-white font-semibold font-sans">
                  {isRegister ? t("registerTitle") : t("loginTitle")}
                </h3>
              </div>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                className="h-12 w-full rounded-xl border border-white/20 bg-white/5 px-4 text-sm text-white placeholder:text-white/30 focus:border-white/60 focus:bg-white/10 focus:outline-hidden transition-all font-sans"
              />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("passwordPlaceholder")}
                className="h-12 w-full rounded-xl border border-white/20 bg-white/5 px-4 text-sm text-white placeholder:text-white/30 focus:border-white/60 focus:bg-white/10 focus:outline-hidden transition-all font-sans"
              />

              <button
                type="submit"
                disabled={authLoading}
                className="h-12 w-full rounded-xl bg-white text-black font-semibold font-sans hover:bg-white/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {authLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isRegister ? (
                  t("registerBtn")
                ) : (
                  t("loginBtn")
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-sm text-white/50 hover:text-white transition-colors font-sans text-center cursor-pointer"
              >
                {isRegister ? t("hasAccount") : t("noAccount")}
              </button>
            </motion.form>
          ) : (
            <div className="flex flex-col gap-4">
              <button
                onClick={() =>
                  authClient.signIn.social({ provider: "google" })
                }
                className="flex items-center justify-center gap-3 w-full h-12 rounded-xl border border-white/20 bg-white text-black font-semibold hover:bg-white/90 transition-colors font-sans cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {t("googleConnect")}
              </button>

              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/30 font-sans uppercase">
                  {t("or")}
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <button
                onClick={() => setShowEmailForm(true)}
                className="flex items-center justify-center gap-3 w-full h-12 rounded-xl border border-white/20 bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors font-sans cursor-pointer"
              >
                <Mail className="w-5 h-5" />
                {t("emailConnect")}
              </button>
            </div>
          )}

          <p className="text-white/30 text-xs font-sans text-center mt-8">
            {t("terms")}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
