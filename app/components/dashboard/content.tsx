"use client";

import { WelcomeSection } from "./header";
import { StatsCards } from "./stats-cards";
import { GuestsChart } from "./guests-chart";
import { RecentActivity } from "./recent-activity";
import { GuestsTable } from "./guests-table";

export function DashboardContent({ isDemo }: { isDemo?: boolean }) {
  return (
    <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6 bg-background w-full">
      <WelcomeSection isDemo={isDemo} />
      <StatsCards />
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <GuestsChart />
        <RecentActivity />
      </div>
      <GuestsTable isDemo={isDemo} />
    </main>
  );
}
