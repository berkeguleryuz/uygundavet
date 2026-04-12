"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { useOrderStore } from "@/store/order-store";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/app/components/dashboard/sidebar";
import { DashboardHeader } from "@/app/components/dashboard/header";
import { PaymentWall } from "@/app/components/dashboard/payment-wall";
import { WizardForm } from "@/app/components/WizardForm";
import { AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();
  const { order, isLoading, fetchOrder } = useOrderStore();
  const router = useRouter();
  const t = useTranslations("PaymentWall");
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (session) {
      fetchOrder();
    }
  }, [session, fetchOrder]);

  const showWizard = !isLoading && !!session && !order;

  if (isPending || isLoading) {
    return (
      <div className="h-svh flex items-center justify-center bg-[#252224]">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const handleWizardComplete = () => {
    fetchOrder();
  };

  if (!order) {
    return (
      <div className="h-svh bg-[#252224] overflow-auto">
        <AnimatePresence>
          {showWizard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-svh flex items-center justify-center"
            >
              <WizardForm onComplete={handleWizardComplete} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const isPendingPayment = order.paymentStatus === "pending";
  const isDepositPaid = order.paymentStatus === "deposit_paid";
  const remaining = order.totalAmount - order.depositAmount;

  return (
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar />
      <div className="h-svh overflow-hidden lg:p-2 w-full">
        <div className="lg:border lg:rounded-md border-border/50 bg-background h-full flex flex-col overflow-hidden">
          <DashboardHeader />

          {isPendingPayment ? (
            <PaymentWall order={order} />
          ) : (
            <>
              {isDepositPaid && (
                <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 flex items-center justify-center gap-2 shrink-0">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-sans text-amber-300">
                    {t("depositBanner", { amount: remaining.toLocaleString("tr-TR") })}
                  </span>
                </div>
              )}
              <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6 bg-background w-full">
                {children}
              </main>
            </>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}
