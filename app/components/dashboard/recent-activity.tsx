"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard-store";

const demoActivity = [
  { _id: "a-001", name: "Ali Yılmaz", action: "activity1Action", time: "activity1Time" },
  { _id: "a-002", name: "Fatma Demir", action: "activity2Action", time: "activity2Time" },
  { _id: "a-003", name: "Mehmet Kaya", action: "activity3Action", time: "activity3Time" },
  { _id: "a-004", name: "Zeynep Arslan", action: "activity4Action", time: "activity4Time" },
  { _id: "a-005", name: "Hasan Öztürk", action: "activity5Action", time: "activity5Time" },
  { _id: "a-006", name: "Selin Aydın", action: "activity6Action", time: "activity6Time" },
  { _id: "a-007", name: "Emre Koç", action: "activity7Action", time: "activity7Time" },
  { _id: "a-008", name: "Derya Aksoy", action: "activity8Action", time: "activity8Time" },
];

function getRelativeTime(dateStr: string, t: (key: string, values?: Record<string, unknown>) => string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t("justNow");
  if (mins < 60) return t("minutesAgo", { count: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t("hoursAgo", { count: hours });
  const days = Math.floor(hours / 24);
  return t("daysAgo", { count: days });
}

function getActionText(rsvpStatus: string, t: (key: string) => string) {
  if (rsvpStatus === "confirmed") return t("activityConfirmed");
  if (rsvpStatus === "declined") return t("activityDeclined");
  return t("activityAdded");
}

export function RecentActivity({ isDemo }: { isDemo?: boolean }) {
  const t = useTranslations("Dashboard");
  const { guests } = useDashboardStore();

  const activities = useMemo(() => {
    if (isDemo) return demoActivity;
    return [...guests]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 8)
      .map((g) => ({
        _id: g._id,
        name: g.name,
        action: getActionText(g.rsvpStatus, t),
        time: getRelativeTime(g.updatedAt, t),
      }));
  }, [isDemo, guests, t]);

  if (!isDemo && guests.length === 0) {
    return (
      <div className="bg-card text-card-foreground rounded-lg border w-full lg:w-[332px] shrink-0">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h3 className="font-medium text-sm sm:text-base">{t("recentActivities")}</h3>
          <Clock className="size-4 text-muted-foreground" />
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">{t("noActivity")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card text-card-foreground rounded-lg border w-full lg:w-[332px] shrink-0">
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <h3 className="font-medium text-sm sm:text-base">{t("recentActivities")}</h3>
        <Clock className="size-4 text-muted-foreground" />
      </div>
      <div className="p-4">
        <div className="divide-y divide-border/50">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
            >
              <Avatar className="size-8 shrink-0">
                <AvatarFallback>
                  {activity.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug">
                  <span className="font-medium">{activity.name}</span>{" "}
                  <span className="text-muted-foreground">
                    {isDemo ? t(activity.action) : activity.action}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isDemo ? t(activity.time) : activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
