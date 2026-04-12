"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Check, Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Logo } from "@/app/components/Logo";

export default function ResetPasswordPage() {
  const t = useTranslations("ResetPassword");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [reset, setReset] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);

    try {
      await authClient.resetPassword({
        email,
        redirectTo: "/reset-password",
      });
      setSent(true);
    } catch {
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword || loading) return;

    if (password !== confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }

    if (password.length < 6) {
      toast.error(t("passwordTooShort"));
      return;
    }

    setLoading(true);

    try {
      await authClient.resetPassword({
        newPassword: password,
        token: token!,
      });
      setReset(true);
    } catch {
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh flex items-center justify-center bg-[#252224] px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center justify-center gap-3 mb-10">
          <Logo className="w-9 h-9" />
          <span className="font-merienda font-bold text-2xl text-white">
            Uygun Davet
          </span>
        </div>

        {token ? (
          reset ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-2xl font-chakra font-semibold text-white uppercase tracking-tight mb-2">
                {t("resetSuccess")}
              </h1>
              <p className="text-white/50 font-sans text-sm mb-8">
                {t("resetSuccessInfo")}
              </p>
              <Link
                href="/login"
                className="inline-block px-8 py-3 bg-white text-[#252224] font-semibold font-sans rounded-xl hover:bg-white/90 transition-colors"
              >
                {t("goToLogin")}
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-chakra font-semibold text-white uppercase tracking-tight mb-2">
                {t("newPasswordHeading")}
              </h1>
              <p className="text-white/50 font-sans text-sm mb-8">
                {t("newPasswordSubtitle")}
              </p>

              <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("newPasswordPlaceholder")}
                  className="h-12 w-full rounded-xl border border-white/20 bg-white/5 px-4 text-sm text-white placeholder:text-white/30 focus:border-white/60 focus:bg-white/10 focus:outline-hidden transition-all font-sans"
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("confirmPasswordPlaceholder")}
                  className="h-12 w-full rounded-xl border border-white/20 bg-white/5 px-4 text-sm text-white placeholder:text-white/30 focus:border-white/60 focus:bg-white/10 focus:outline-hidden transition-all font-sans"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-xl bg-white text-black font-semibold font-sans hover:bg-white/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    t("resetBtn")
                  )}
                </button>
              </form>
            </>
          )
        ) : sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-white/60" />
            </div>
            <h1 className="text-2xl font-chakra font-semibold text-white uppercase tracking-tight mb-2">
              {t("sentHeading")}
            </h1>
            <p className="text-white/50 font-sans text-sm mb-8">
              {t("sentInfo")}
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors font-sans text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("backToLogin")}
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-chakra font-semibold text-white uppercase tracking-tight mb-2">
              {t("heading")}
            </h1>
            <p className="text-white/50 font-sans text-sm mb-8">
              {t("subtitle")}
            </p>

            <form onSubmit={handleRequestReset} className="flex flex-col gap-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                className="h-12 w-full rounded-xl border border-white/20 bg-white/5 px-4 text-sm text-white placeholder:text-white/30 focus:border-white/60 focus:bg-white/10 focus:outline-hidden transition-all font-sans"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-white text-black font-semibold font-sans hover:bg-white/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t("sendBtn")
                )}
              </button>
            </form>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors font-sans text-sm mt-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("backToLogin")}
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
