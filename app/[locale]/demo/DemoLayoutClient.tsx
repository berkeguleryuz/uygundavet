"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/app/components/dashboard/sidebar";
import { DashboardHeader } from "@/app/components/dashboard/header";

export function DemoLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Dashboard");
  return (
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar isDemo />
      <div className="h-svh overflow-hidden lg:p-2 w-full">
        <div className="lg:border lg:rounded-md border-border/50 bg-background h-full flex flex-col overflow-hidden relative">
          <div className="bg-amber-500/90 text-black text-center py-2 px-4 text-sm font-semibold font-sans z-20 flex items-center justify-center gap-2 shrink-0">
            <span className="uppercase tracking-wider text-xs font-chakra">DEMO</span>
            <span className="hidden sm:inline">—</span>
            <span className="hidden sm:inline">{t("demoBanner")}</span>
            <Link href="/#wizard" className="ml-2 underline underline-offset-2 hover:no-underline font-bold">
              {t("signIn")}
            </Link>
          </div>
          <DashboardHeader />
          <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6 bg-background w-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
