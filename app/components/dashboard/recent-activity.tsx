"use client";

import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { recentActivity } from "@/mock-data/dashboard";

export function RecentActivity() {
  const t = useTranslations("Dashboard");
  return (
    <div className="bg-card text-card-foreground rounded-lg border w-full lg:w-[332px] shrink-0">
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <h3 className="font-medium text-sm sm:text-base">{t("recentActivities")}</h3>
        <Clock className="size-4 text-muted-foreground" />
      </div>
      <div className="p-4">
        <div className="divide-y divide-border/50">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
            >
              <Avatar className="size-8 shrink-0">
                <AvatarImage src={activity.avatar} />
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
                    {activity.action}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
