"use client";

import { useTranslations } from "next-intl";
import { dashboardStats } from "@/mock-data/dashboard";
import {
  Users,
  CheckCircle,
  Calendar,
  Eye,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const icons = [Users, CheckCircle, Calendar, Eye];

export function StatsCards() {
  const t = useTranslations("Dashboard");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {dashboardStats.map((stat, index) => {
        const Icon = icons[index];

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

                  {stat.trend ? (
                    <div
                      className={cn(
                        "flex items-center gap-1.5",
                        stat.trend.isPositive
                          ? "text-green-400"
                          : "text-pink-400"
                      )}
                      style={{
                        textShadow: stat.trend.isPositive
                          ? "0 1px 6px rgba(68, 255, 118, 0.25)"
                          : "0 1px 6px rgba(255, 68, 193, 0.25)",
                      }}
                    >
                      <TrendingUp className="size-3.5" />
                      <span className="text-sm font-medium">
                        {stat.trend.value}%
                      </span>
                    </div>
                  ) : stat.subtitle ? (
                    <div className="text-sm font-medium">
                      <span className="text-foreground">{stat.subtitle}</span>
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
