"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Users, Clock, CheckCircle, TrendingUp, DollarSign } from "lucide-react";

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  depositPaid: number;
  fullyPaid: number;
  totalUsers: number;
  totalRevenue: number;
}

export default function ClodronPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: "Toplam Sipariş", value: stats.totalOrders, icon: ShoppingBag, color: "text-blue-400" },
    { label: "Ödeme Bekleyen", value: stats.pendingOrders, icon: Clock, color: "text-amber-400" },
    { label: "Kapora Ödenen", value: stats.depositPaid, icon: TrendingUp, color: "text-orange-400" },
    { label: "Tam Ödenen", value: stats.fullyPaid, icon: CheckCircle, color: "text-green-400" },
    { label: "Toplam Kullanıcı", value: stats.totalUsers, icon: Users, color: "text-purple-400" },
    { label: "Toplam Gelir", value: `${stats.totalRevenue.toLocaleString("tr-TR")}₺`, icon: DollarSign, color: "text-emerald-400" },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-chakra font-semibold text-white uppercase tracking-tight">
        Genel Bakış
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-white/50 font-sans">{card.label}</span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <span className="text-2xl font-chakra font-bold text-white">
                {card.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
