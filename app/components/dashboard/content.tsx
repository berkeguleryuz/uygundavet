"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { WelcomeSection } from "./header";
import { StatsCards } from "./stats-cards";
import { RecentActivity } from "./recent-activity";
import { GuestsTable } from "./guests-table";
import { useDashboardStore } from "@/store/dashboard-store";

const GuestsChart = dynamic(
  () => import("./guests-chart").then((m) => m.GuestsChart),
  { ssr: false }
);

export function DashboardContent({ isDemo }: { isDemo?: boolean }) {
  const { fetchGuests, fetchStats, fetchCustomer } = useDashboardStore();

  useEffect(() => {
    if (!isDemo) {
      fetchGuests();
      fetchStats();
      fetchCustomer();
    }
  }, [isDemo, fetchGuests, fetchStats, fetchCustomer]);

  return (
    <main className="flex-1 overflow-auto p-4 sm:p-6 flex flex-col gap-6 bg-background w-full">
      <WelcomeSection isDemo={isDemo} />
      <StatsCards isDemo={isDemo} />
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6 min-w-0">
        <GuestsChart isDemo={isDemo} />
        <RecentActivity isDemo={isDemo} />
      </div>
      <GuestsTable isDemo={isDemo} />
    </main>
  );
}
