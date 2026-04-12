"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowLeft, Loader2, Check, CreditCard, Package, Palette } from "lucide-react";
import { toast } from "sonner";
import type { IOrder } from "@/models/Order";

const statusSteps = [
  { key: "pending", label: "Bekliyor" },
  { key: "deposit_paid", label: "Kapora Ödendi" },
  { key: "fully_paid", label: "Tam Ödendi" },
];

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetch(`/api/admin/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.order) {
          setOrder(data.order);
          setAdminNotes(data.order.adminNotes || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });
      if (res.ok) {
        setOrder((prev) => prev ? { ...prev, paymentStatus: newStatus as IOrder["paymentStatus"] } : null);
        toast.success("Durum güncellendi.");
      } else {
        toast.error("Hata oluştu.");
      }
    } catch {
      toast.error("Hata oluştu.");
    } finally {
      setUpdating(false);
    }
  };

  const saveNotes = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });
      if (res.ok) {
        toast.success("Notlar kaydedildi.");
      } else {
        toast.error("Hata oluştu.");
      }
    } catch {
      toast.error("Hata oluştu.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return <p className="text-center text-white/40 font-sans py-12">Sipariş bulunamadı.</p>;
  }

  const currentIdx = statusSteps.findIndex((s) => s.key === order.paymentStatus);
  const remaining = order.totalAmount - order.depositAmount;

  return (
    <div className="space-y-8 max-w-3xl">
      <button
        onClick={() => router.push("/clodron/siparisler")}
        className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors font-sans cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Siparişlere Dön
      </button>

      <h2 className="text-2xl font-chakra font-semibold text-white uppercase tracking-tight">
        Sipariş Detayı
      </h2>

      {/* Status Progress */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="w-4 h-4 text-white/50" />
          <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70">Ödeme Durumu</h3>
        </div>

        <div className="flex items-center gap-3 mb-6">
          {statusSteps.map((step, i) => {
            const isCompleted = i <= currentIdx;
            return (
              <div key={step.key} className="flex items-center gap-3 flex-1">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold",
                  isCompleted ? "bg-green-500/20 text-green-300" : "bg-white/5 text-white/30"
                )}>
                  {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={cn("text-sm font-sans", isCompleted ? "text-white" : "text-white/30")}>
                  {step.label}
                </span>
                {i < statusSteps.length - 1 && (
                  <div className={cn("flex-1 h-px", isCompleted ? "bg-green-500/30" : "bg-white/10")} />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          {currentIdx < 1 && (
            <button
              onClick={() => updateStatus("deposit_paid")}
              disabled={updating}
              className="flex-1 h-10 rounded-xl bg-orange-500/20 text-orange-300 text-sm font-sans font-medium hover:bg-orange-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Kapora Onayı"}
            </button>
          )}
          {currentIdx < 2 && (
            <button
              onClick={() => updateStatus("fully_paid")}
              disabled={updating}
              className="flex-1 h-10 rounded-xl bg-green-500/20 text-green-300 text-sm font-sans font-medium hover:bg-green-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tam Ödeme Onayı"}
            </button>
          )}
          {currentIdx === 2 && (
            <p className="text-sm text-green-400 font-sans flex items-center gap-2">
              <Check className="w-4 h-4" /> Ödeme tamamlandı
            </p>
          )}
        </div>
      </div>

      {/* Order Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-white/50" />
            <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70">Paket Bilgisi</h3>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-white/50 font-sans">Paket</span>
            <span className="text-sm text-white font-semibold font-chakra uppercase">{order.selectedPackage}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-white/50 font-sans">Toplam</span>
            <span className="text-sm text-white font-sans">{order.totalAmount.toLocaleString("tr-TR")}₺</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-white/50 font-sans">Kapora</span>
            <span className="text-sm text-white font-sans">{order.depositAmount.toLocaleString("tr-TR")}₺</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-white/50 font-sans">Kalan</span>
            <span className="text-sm text-white font-sans">{remaining.toLocaleString("tr-TR")}₺</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-white/50 font-sans">Ödeme Yöntemi</span>
            <span className="text-sm text-white font-sans">{order.paymentMethod === "deposit" ? "Kapora" : "Peşin"}</span>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-4 h-4 text-white/50" />
            <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70">Tema & Kullanıcı</h3>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-white/50 font-sans">Tema</span>
            <span className="text-sm text-white font-sans capitalize">{order.selectedTheme}</span>
          </div>
          {order.customThemeRequest && (
            <div>
              <span className="text-sm text-white/50 font-sans">Özel Tema İsteği</span>
              <p className="text-sm text-white/80 font-sans mt-1">{order.customThemeRequest}</p>
            </div>
          )}
          <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-white/50 font-sans">E-posta</span>
              <span className="text-sm text-white font-sans">{order.userEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-white/50 font-sans">Telefon</span>
              <span className="text-sm text-white font-sans">{order.userPhone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Notes */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
        <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70 mb-3">Admin Notları</h3>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Not ekleyin..."
          className="w-full h-24 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-hidden transition-all font-sans resize-none"
        />
        <button
          onClick={saveNotes}
          disabled={updating}
          className="mt-3 h-9 px-6 rounded-lg bg-white/10 text-white text-sm font-sans hover:bg-white/20 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Kaydet"}
        </button>
      </div>
    </div>
  );
}
