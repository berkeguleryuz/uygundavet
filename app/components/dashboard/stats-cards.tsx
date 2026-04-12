"use client";

import { useTranslations } from "next-intl";
import { useDashboardStore } from "@/store/dashboard-store";
import { Users, CheckCircle, Calendar, Eye, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = [Users, CheckCircle, Calendar, Eye];

// Mock data for demo mode
const demoStats = [
  { title: "statTotalGuests", value: "248", trend: { value: 12, isPositive: true } },
  { title: "statRsvpConfirmation", value: "186/248", subtitle: "75%" },
  { title: "statDaysUntilWedding", value: "45" },
  { title: "statInvitationViews", value: "1,847", trend: { value: 28, isPositive: true } },
];

export function StatsCards({ isDemo }: { isDemo?: boolean }) {
  const t = useTranslations("Dashboard");
  const { stats, isLoadingStats } = useDashboardStore();

  const displayStats = isDemo
    ? demoStats
    : stats
      ? [
          {
            title: "statTotalGuests",
            value: String(stats.totalGuestCount),
          },
          {
            title: "statRsvpConfirmation",
            value: `${stats.confirmed}/${stats.totalGuests}`,
            subtitle: stats.totalGuests > 0
              ? `${Math.round((stats.confirmed / stats.totalGuests) * 100)}%`
              : "0%",
          },
          {
            title: "statDaysUntilWedding",
            value: String(stats.daysUntilWedding),
          },
          {
            title: "statInvitationViews",
            value: stats.invitationViews.toLocaleString("tr-TR"),
          },
        ]
      : [];

  if (!isDemo && isLoadingStats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl border p-4 h-[120px] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayStats.map((stat, index) => {
        const Icon = icons[index];
        const trend = "trend" in stat ? stat.trend : undefined;
        const subtitle = "subtitle" in stat ? stat.subtitle : undefined;

        return (
          <div
            key={index}
            className="bg-card text-card-foreground rounded-xl border p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">{t(stat.title)}</span>
              <Icon className="size-4 text-muted-foreground" />
            </div>

            <div className="bg-muted/50 dark:bg-neutral-800/50 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-medium tracking-tight">
                  {stat.value}
                </span>

                <div className="flex items-center gap-3">
                  <div className="h-9 w-px bg-border" />

                  {trend ? (
                    <div
                      className={cn(
                        "flex items-center gap-1.5",
                        trend.isPositive ? "text-green-400" : "text-pink-400"
                      )}
                      style={{
                        textShadow: trend.isPositive
                          ? "0 1px 6px rgba(68, 255, 118, 0.25)"
                          : "0 1px 6px rgba(255, 68, 193, 0.25)",
                      }}
                    >
                      <TrendingUp className="size-3.5" />
                      <span className="text-sm font-medium">
                        {trend.value}%
                      </span>
                    </div>
                  ) : subtitle ? (
                    <div className="text-sm font-medium">
                      <span className="text-foreground">{subtitle}</span>
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-muted-foreground">
                      --
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
