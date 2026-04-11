"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { GuestsChart } from "@/app/components/dashboard/guests-chart";
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";

const rsvpStatDefs = [
  {
    key: "confirmed",
    value: 186,
    icon: CheckCircle,
    dotColor: "bg-emerald-400",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bgGradient:
      "linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0%, transparent 100%)",
  },
  {
    key: "declined",
    value: 24,
    icon: XCircle,
    dotColor: "bg-rose-400",
    textColor: "text-rose-400",
    borderColor: "border-rose-500/30",
    bgGradient:
      "linear-gradient(90deg, rgba(244, 63, 94, 0.08) 0%, transparent 100%)",
  },
  {
    key: "pending",
    value: 38,
    icon: Clock,
    dotColor: "bg-amber-400",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/30",
    bgGradient:
      "linear-gradient(90deg, rgba(245, 158, 11, 0.08) 0%, transparent 100%)",
  },
];

const recentChanges = [
  {
    id: 1,
    name: "Ahmet Yilmaz",
    action: "Onaylandi",
    status: "confirmed" as const,
    time: "5 dakika once",
  },
  {
    id: 2,
    name: "Fatma Kaya",
    action: "Reddedildi",
    status: "declined" as const,
    time: "23 dakika once",
  },
  {
    id: 3,
    name: "Burak Demir",
    action: "Onaylandi",
    status: "confirmed" as const,
    time: "1 saat once",
  },
  {
    id: 4,
    name: "Selin Arslan",
    action: "Onaylandi",
    status: "confirmed" as const,
    time: "2 saat once",
  },
  {
    id: 5,
    name: "Murat Ozturk",
    action: "Reddedildi",
    status: "declined" as const,
    time: "3 saat once",
  },
  {
    id: 6,
    name: "Elif Sahin",
    action: "Onaylandi",
    status: "confirmed" as const,
    time: "5 saat once",
  },
];

const statusConfigDefs = {
  confirmed: {
    badgeClass: "text-emerald-400 border-emerald-500/40",
    bgStyle:
      "linear-gradient(90deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.06) 30%, rgba(16, 185, 129, 0) 100%), linear-gradient(90deg, hsl(var(--card)) 0%, hsl(var(--card)) 100%)",
    labelKey: "confirmedStatus",
  },
  declined: {
    badgeClass: "text-rose-400 border-rose-500/40",
    bgStyle:
      "linear-gradient(90deg, rgba(244, 63, 94, 0.12) 0%, rgba(244, 63, 94, 0.06) 30%, rgba(244, 63, 94, 0) 100%), linear-gradient(90deg, hsl(var(--card)) 0%, hsl(var(--card)) 100%)",
    labelKey: "declinedStatus",
  },
  pending: {
    badgeClass: "text-amber-400 border-amber-500/40",
    bgStyle:
      "linear-gradient(90deg, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.06) 30%, rgba(245, 158, 11, 0) 100%), linear-gradient(90deg, hsl(var(--card)) 0%, hsl(var(--card)) 100%)",
    labelKey: "pendingStatus",
  },
};

export function LcvContent({ isDemo }: { isDemo?: boolean }) {
  const t = useTranslations("Dashboard");
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              {t("rsvpTracking")}
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
            {t("rsvpTrackingSubtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {rsvpStatDefs.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.key}
              className={`bg-card rounded-xl border ${stat.borderColor} p-5`}
              style={{ backgroundImage: stat.bgGradient }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`size-2 rounded-full ${stat.dotColor}`}
                  />
                  <span className="text-sm font-medium text-muted-foreground">
                    {t(stat.key)}
                  </span>
                </div>
                <Icon className={`size-4 ${stat.textColor}`} />
              </div>
              <p
                className={`text-3xl sm:text-4xl font-medium tracking-tight ${stat.textColor}`}
              >
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <GuestsChart />

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h3 className="font-medium text-sm sm:text-base">
            {t("recentRsvpChanges")}
          </h3>
          <Clock className="size-4 text-muted-foreground" />
        </div>
        <div className="divide-y divide-border/50">
          {recentChanges.map((change) => {
            const config = statusConfigDefs[change.status];
            return (
              <div
                key={change.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm font-medium truncate">
                    {change.name}
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground shrink-0" />
                  <div
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border ${config.badgeClass} shrink-0`}
                    style={{ backgroundImage: config.bgStyle }}
                  >
                    <span className={`text-xs font-medium ${config.badgeClass.split(" ")[0]}`}>
                      {t(config.labelKey)}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-4">
                  {change.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
