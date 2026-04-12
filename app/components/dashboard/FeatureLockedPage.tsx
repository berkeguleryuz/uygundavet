"use client";

import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";
import Link from "next/link";

export function FeatureLockedPage() {
  const t = useTranslations("Dashboard");

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-7 h-7 text-[#d5d1ad]" />
        </div>
        <h2 className="text-lg font-chakra font-semibold text-white uppercase tracking-wider mb-2">
          {t("featureLocked")}
        </h2>
        <p className="text-sm text-white/40 font-sans mb-6">
          {t("featureLocked")}
        </p>
        <Link
          href="/#fiyatlar"
          className="inline-block px-8 py-3 bg-[#d5d1ad] text-[#252224] font-semibold font-sans rounded-xl hover:bg-[#d5d1ad]/90 transition-colors"
        >
          {t("upgradePackage")}
        </Link>
      </div>
    </div>
  );
}
