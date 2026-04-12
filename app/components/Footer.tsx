"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navbar");

  return (
    <footer className="w-full py-12 px-8 md:px-28 bg-[#252224] border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4 font-sans">

      <div className="flex items-center gap-3">
        <Logo className="w-6 h-6 grayscale hover:grayscale-0 transition-all duration-300" />
        <span className="font-merienda font-bold text-foreground text-lg">{tNav("brand")}</span>
        <span className="text-muted-foreground text-sm">{t("copyright")}</span>
      </div>

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <a href="#ozellikler" className="hover:text-foreground transition-colors">{tNav("features")}</a>
        <a href="#nasil-calisir" className="hover:text-foreground transition-colors">{tNav("howItWorks")}</a>
        <a href="#fiyatlar" className="hover:text-foreground transition-colors">{tNav("pricing")}</a>
      </div>

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <Link href="/privacy" className="hover:text-foreground transition-colors">{t("privacy")}</Link>
        <Link href="/terms" className="hover:text-foreground transition-colors">{t("terms")}</Link>
        <Link href="/data-deletion" className="hover:text-foreground transition-colors">{t("dataDeletion")}</Link>
      </div>

    </footer>
  );
}
