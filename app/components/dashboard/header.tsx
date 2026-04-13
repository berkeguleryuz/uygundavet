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
  Calendar,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";
import { useDashboardStore } from "@/store/dashboard-store";

const pageTitleKeys: Record<string, { key: string; icon: typeof LayoutDashboard }> = {
  "": { key: "overview", icon: LayoutDashboard },
  davetiyem: { key: "myInvitation", icon: Mail },
  misafirler: { key: "guestList", icon: Users },
  lcv: { key: "rsvpTracking", icon: ClipboardCheck },
  galeri: { key: "gallery", icon: Image },
  "ani-defteri": { key: "memoryBook", icon: BookHeart },
  ayarlar: { key: "settings", icon: Settings },
};

export function DashboardHeader() {
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
  const customer = useDashboardStore((s) => s.customer);

  const formattedDate = customer?.weddingDate
    ? new Date(customer.weddingDate).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
      })
    : null;

  return (
    <div className="space-y-4">
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
          {isDemo ? (
            <Button
              variant="outline"
              className="h-9 gap-1.5 bg-card hover:bg-card/80 border-border/50"
              disabled
            >
              <UserPlus className="size-4" />
              <span className="hidden sm:inline">{t("addGuest")}</span>
            </Button>
          ) : (
            <Link href={`${prefix}/misafirler`}>
              <Button
                variant="outline"
                className="h-9 gap-1.5 bg-card hover:bg-card/80 border-border/50"
              >
                <UserPlus className="size-4" />
                <span className="hidden sm:inline">{t("addGuest")}</span>
              </Button>
            </Link>
          )}
          {isDemo ? (
            <Button
              className="h-9 gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-border/50"
              disabled
            >
              <Mail className="size-4" />
              <span className="hidden sm:inline">{t("editInvitation")}</span>
            </Button>
          ) : (
            <Link href={`${prefix}/davetiyem`}>
              <Button
                className="h-9 gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-border/50"
              >
                <Mail className="size-4" />
                <span className="hidden sm:inline">{t("editInvitation")}</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {customer && (
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {formattedDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5 shrink-0" />
              <span>{formattedDate}{customer.weddingTime ? ` - ${customer.weddingTime}` : ""}</span>
            </div>
          )}
          {(customer.venueName || customer.venueAddress) && (
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" />
              <span>{[customer.venueName, customer.venueAddress].filter(Boolean).join(", ")}</span>
            </div>
          )}
          {customer.inviteCode && (
            <div className="flex items-center gap-1.5">
              <LinkIcon className="size-3.5 shrink-0" />
              <span>{customer.inviteCode}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
