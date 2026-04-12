"use client";

import { useTranslations } from "next-intl";
import { Clock, CreditCard, Copy, Check } from "lucide-react";
import { useState } from "react";
import { PAYMENT_IBAN, PAYMENT_HOLDER } from "@/lib/packages";
import type { OrderData } from "@/models/Order";

export function PaymentWall({ order }: { order: OrderData }) {
  const t = useTranslations("PaymentWall");
  const [copied, setCopied] = useState(false);

  const isDeposit = order.paymentMethod === "deposit";
  const amountDue = isDeposit ? order.depositAmount : order.totalAmount;
  const remaining = order.totalAmount - order.depositAmount;

  const copyIban = () => {
    navigator.clipboard.writeText(PAYMENT_IBAN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-chakra font-semibold uppercase tracking-tight mb-2">
            {t("heading")}
          </h1>
          <p className="text-sm text-muted-foreground font-sans">
            {t("subtitle")}
          </p>
        </div>

        <div className="bg-card border rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-sans">{t("package")}</span>
            <span className="text-sm font-semibold font-chakra uppercase">{order.selectedPackage === "starter" ? "Başlangıç" : order.selectedPackage === "pro" ? "Pro" : "Elit"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground font-sans">{t("total")}</span>
            <span className="text-sm font-semibold">{order.totalAmount.toLocaleString("tr-TR")}₺</span>
          </div>

          {isDeposit && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-sans">{t("depositAmount")}</span>
                <span className="text-sm font-semibold text-amber-400">{order.depositAmount.toLocaleString("tr-TR")}₺</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-sans">{t("remainingAmount")}</span>
                <span className="text-sm font-semibold">{remaining.toLocaleString("tr-TR")}₺</span>
              </div>
            </>
          )}

          <div className="border-t pt-5">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t("transferInfo")}</span>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground font-sans">{t("accountHolder")}</p>
                <p className="text-sm font-medium font-sans">{PAYMENT_HOLDER}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-sans">IBAN</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono font-medium">{PAYMENT_IBAN}</p>
                  <button
                    onClick={copyIban}
                    className="shrink-0 p-1 rounded hover:bg-muted transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-sans">{t("amountToPay")}</p>
                <p className="text-lg font-bold text-amber-400">{amountDue.toLocaleString("tr-TR")}₺</p>
              </div>
            </div>
          </div>

          {isDeposit && (
            <p className="text-xs text-muted-foreground font-sans text-center">
              {t("depositNote")}
            </p>
          )}
        </div>

        <p className="text-xs text-muted-foreground font-sans text-center mt-6">
          {t("contactInfo")}
        </p>
      </div>
    </div>
  );
}
