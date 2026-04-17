"use client";

import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { GuestsChart } from "@/app/components/dashboard/guests-chart";
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard-store";

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
  guest: {
    badgeClass: "text-blue-400 border-blue-500/40",
    bgStyle:
      "linear-gradient(90deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 30%, rgba(59, 130, 246, 0) 100%), linear-gradient(90deg, hsl(var(--card)) 0%, hsl(var(--card)) 100%)",
    labelKey: "guestStatus",
  },
};

export function LcvContent({ isDemo }: { isDemo?: boolean }) {
  const t = useTranslations("Dashboard");
  const { guests, fetchGuests } = useDashboardStore();

  useEffect(() => {
    if (!isDemo && guests.length === 0) {
      fetchGuests();
    }
  }, [isDemo, guests.length, fetchGuests]);

  const confirmed = isDemo ? 186 : guests.filter((g) => g.rsvpStatus === "confirmed").length;
  const declined = isDemo ? 24 : guests.filter((g) => g.rsvpStatus === "declined").length;
  const pending = isDemo ? 38 : guests.filter((g) => g.rsvpStatus === "pending").length;

  const rsvpStatDefs = [
    {
      key: "confirmed",
      value: confirmed,
      icon: CheckCircle,
      dotColor: "bg-emerald-400",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      bgGradient: "linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0%, transparent 100%)",
    },
    {
      key: "declined",
      value: declined,
      icon: XCircle,
      dotColor: "bg-rose-400",
      textColor: "text-rose-400",
      borderColor: "border-rose-500/30",
      bgGradient: "linear-gradient(90deg, rgba(244, 63, 94, 0.08) 0%, transparent 100%)",
    },
    {
      key: "pending",
      value: pending,
      icon: Clock,
      dotColor: "bg-amber-400",
      textColor: "text-amber-400",
      borderColor: "border-amber-500/30",
      bgGradient: "linear-gradient(90deg, rgba(245, 158, 11, 0.08) 0%, transparent 100%)",
    },
  ];

  const recentChanges = useMemo(() => {
    if (isDemo) {
      return [
        { id: "1", name: "Ahmet Yilmaz", status: "confirmed" as const, time: "5 dakika önce" },
        { id: "2", name: "Fatma Kaya", status: "declined" as const, time: "23 dakika önce" },
        { id: "3", name: "Burak Demir", status: "confirmed" as const, time: "1 saat önce" },
        { id: "4", name: "Selin Arslan", status: "confirmed" as const, time: "2 saat önce" },
        { id: "5", name: "Murat Ozturk", status: "declined" as const, time: "3 saat önce" },
        { id: "6", name: "Elif Sahin", status: "confirmed" as const, time: "5 saat önce" },
      ];
    }
    return [...guests]
      .filter((g) => g.rsvpStatus !== "pending")
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 8)
      .map((g) => {
        const d = new Date(g.updatedAt);
        const time = `${d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" })} ${d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`;
        return { id: g._id, name: g.name, status: g.rsvpStatus as "confirmed" | "declined" | "guest", time };
      });
  }, [isDemo, guests]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              {t("rsvpTracking")}
            </h1>
            {isDemo && (
              <Badge variant="outline" className="text-amber-500 border-amber-500/40">
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
            <Card
              key={stat.key}
              className={`rounded-xl py-0 gap-0 ${stat.borderColor}`}
              style={{ backgroundImage: stat.bgGradient }}
            >
              <CardContent className="px-5 py-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${stat.dotColor}`} />
                    <span className="text-sm font-medium text-muted-foreground">
                      {t(stat.key)}
                    </span>
                  </div>
                  <Icon className={`size-4 ${stat.textColor}`} />
                </div>
                <p className={`text-3xl sm:text-4xl font-medium tracking-tight ${stat.textColor}`}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <GuestsChart isDemo={isDemo} />

      <Card className="rounded-xl py-0 gap-0 overflow-hidden">
        <CardHeader className="flex-row items-center p-4 border-b border-border/50">
          <CardTitle className="text-sm sm:text-base">
            {t("recentRsvpChanges")}
          </CardTitle>
          <CardAction>
            <Clock className="size-4 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardContent className="px-0">
          {recentChanges.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">{t("noRsvpChanges")}</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {recentChanges.map((change) => {
                const config = statusConfigDefs[change.status as keyof typeof statusConfigDefs] || statusConfigDefs.pending;
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
                      <Badge
                        variant="outline"
                        className={`rounded-lg px-2 py-0.5 shrink-0 ${config.badgeClass}`}
                        style={{ backgroundImage: config.bgStyle }}
                      >
                        <span className="text-xs font-medium">
                          {t(config.labelKey)}
                        </span>
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 ml-4">
                      {change.time}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
