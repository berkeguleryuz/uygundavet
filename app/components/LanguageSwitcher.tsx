"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as "tr" | "en" | "de" });
  };

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={cn(
            "px-2.5 py-1 text-xs font-sans uppercase rounded-full transition-colors",
            locale === loc
              ? "text-foreground bg-foreground/10"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
