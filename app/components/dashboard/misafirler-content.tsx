"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GuestsTable } from "@/app/components/dashboard/guests-table";
import { UserPlus, Users, CheckCircle, XCircle, Clock } from "lucide-react";

const summaryStatDefs = [
  {
    key: "total",
    value: 248,
    icon: Users,
    color: "text-foreground",
    bg: "bg-muted/50",
  },
  {
    key: "confirmed",
    value: 186,
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    key: "declined",
    value: 24,
    icon: XCircle,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    key: "pending",
    value: 38,
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

export function MisafirlerContent({ isDemo }: { isDemo?: boolean }) {
  const t = useTranslations("Dashboard");
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              {t("guestList")}
            </h1>
            {isDemo && (
              <Badge
                variant="outline"
                className="text-amber-500 border-amber-500/40"
              >
                Demo
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("guestListSubtitle")}
          </p>
        </div>
        <Button
          className="h-9 gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-border/50"
          disabled={isDemo}
        >
          <UserPlus className="size-4" />
          {t("addGuest")}
        </Button>
      </div>

      <GuestsTable isDemo={isDemo} />

      {/* Summary stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaryStatDefs.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.key}
              className="bg-card rounded-xl border p-4 flex items-center gap-3"
            >
              <div
                className={`size-10 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}
              >
                <Icon className={`size-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-medium tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{t(stat.key)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
