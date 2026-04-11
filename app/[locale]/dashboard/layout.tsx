"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/app/components/dashboard/sidebar";
import { DashboardHeader } from "@/app/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="h-svh flex items-center justify-center bg-[#252224]">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar />
      <div className="h-svh overflow-hidden lg:p-2 w-full">
        <div className="lg:border lg:rounded-md border-border/50 bg-background h-full flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6 bg-background w-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
