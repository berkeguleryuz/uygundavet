"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/app/components/theme-toggle";
import {
  LayoutDashboard,
  UserPlus,
  Mail,
  Users,
  ClipboardCheck,
  Image,
  BookHeart,
  Settings,
} from "lucide-react";

const pageTitleKeys: Record<string, { key: string; icon: typeof LayoutDashboard }> = {
  "": { key: "overview", icon: LayoutDashboard },
  davetiyem: { key: "myInvitation", icon: Mail },
  misafirler: { key: "guestList", icon: Users },
  lcv: { key: "rsvpTracking", icon: ClipboardCheck },
  galeri: { key: "gallery", icon: Image },
  "ani-defteri": { key: "memoryBook", icon: BookHeart },
  ayarlar: { key: "settings", icon: Settings },
};

interface HeaderProps {
  isDemo?: boolean;
}

export function DashboardHeader({ isDemo }: HeaderProps) {
  const t = useTranslations("Dashboard");
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as "tr" | "en" | "de" });
  };
  const segments = pathname.split("/");
  const lastSegment = segments[segments.length - 1];
  const pageKey = ["dashboard", "demo"].includes(lastSegment) ? "" : lastSegment;
  const page = pageTitleKeys[pageKey] || pageTitleKeys[""];
  const Icon = page.icon;

  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-b bg-card sticky top-0 z-10 w-full shrink-0">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-2" />
        <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
          <Icon className="size-4" />
          <span className="text-sm font-medium">{t(page.key)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-full bg-muted/50 border border-border/50 overflow-hidden">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={cn(
                "px-2.5 py-1.5 text-[11px] font-sans uppercase font-medium transition-all duration-200",
                locale === loc
                  ? "bg-foreground text-background rounded-full"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {loc}
            </button>
          ))}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}

interface WelcomeSectionProps {
  isDemo?: boolean;
}

export function WelcomeSection({ isDemo }: WelcomeSectionProps) {
  const t = useTranslations("Dashboard");
  const prefix = isDemo ? "/demo" : "/dashboard";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          {isDemo ? t("demoMode") : t("welcome")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("welcomeSubtitle")}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="h-9 gap-1.5 bg-card hover:bg-card/80 border-border/50"
          disabled={isDemo}
          asChild={!isDemo}
        >
          {isDemo ? (
            <>
              <UserPlus className="size-4" />
              <span className="hidden sm:inline">{t("addGuest")}</span>
            </>
          ) : (
            <Link href={`${prefix}/misafirler`}>
              <UserPlus className="size-4" />
              <span className="hidden sm:inline">{t("addGuest")}</span>
            </Link>
          )}
        </Button>
        <Button
          className="h-9 gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-border/50"
          disabled={isDemo}
          asChild={!isDemo}
        >
          {isDemo ? (
            <>
              <Mail className="size-4" />
              <span className="hidden sm:inline">{t("editInvitation")}</span>
            </>
          ) : (
            <Link href={`${prefix}/davetiyem`}>
              <Mail className="size-4" />
              <span className="hidden sm:inline">{t("editInvitation")}</span>
            </Link>
          )}
        </Button>
      </div>
    </div>
  );
}
