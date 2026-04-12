"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight, Filter } from "lucide-react";
import type { OrderData } from "@/models/Order";

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Bekliyor", color: "bg-amber-500/20 text-amber-300" },
  deposit_paid: { label: "Kapora Ödendi", color: "bg-orange-500/20 text-orange-300" },
  fully_paid: { label: "Tam Ödendi", color: "bg-green-500/20 text-green-300" },
};

export default function SiparislerPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/orders?status=${filter}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setOrders(data.orders || []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [filter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-chakra font-semibold text-white uppercase tracking-tight">
          Siparişler
        </h2>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-white/40" />
          {["all", "pending", "deposit_paid", "fully_paid"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-sans transition-colors cursor-pointer",
                filter === s
                  ? "bg-white text-[#252224] font-medium"
                  : "text-white/50 hover:text-white bg-white/5"
              )}
            >
              {s === "all" ? "Tümü" : statusLabels[s].label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-white/40 font-sans py-12">Sipariş bulunamadı.</p>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => {
            const status = statusLabels[order.paymentStatus] || statusLabels.pending;
            return (
              <Link
                key={String(order._id)}
                href={`/clodron/siparisler/${order._id}`}
                className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.06] transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium text-white font-sans">{order.userEmail}</p>
                    <p className="text-xs text-white/40 font-sans">
                      {order.userPhone} — {order.selectedPackage === "starter" ? "Başlangıç" : order.selectedPackage === "pro" ? "Pro" : "Elit"} — {order.selectedTheme}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-white font-sans">
                    {order.totalAmount.toLocaleString("tr-TR")}₺
                  </span>
                  <span className={cn("text-xs px-2.5 py-1 rounded-full font-sans", status.color)}>
                    {status.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
