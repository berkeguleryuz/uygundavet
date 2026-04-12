"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDashboardStore } from "@/store/dashboard-store";
import { toast } from "sonner";
import type { CustomerData } from "@/types/dashboard";

const inputClass =
  "w-full rounded-xl border border-border/50 bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50 disabled:cursor-not-allowed";

const mockData = {
  weddingDate: "2026-09-12", weddingTime: "18:00",
  venueName: "Çırağan Palace Kempinski", venueAddress: "Çırağan Cad. No:32, Beşiktaş, İstanbul",
  brideFirstName: "Elif", brideLastName: "Yıldız",
  groomFirstName: "Burak", groomLastName: "Özdemir",
  brideMotherFirstName: "Ayşe", brideMotherLastName: "Yıldız",
  brideFatherFirstName: "Mehmet", brideFatherLastName: "Yıldız",
  groomMotherFirstName: "Fatma", groomMotherLastName: "Özdemir",
  groomFatherFirstName: "Ali", groomFatherLastName: "Özdemir",
};

function buildFormFromCustomer(c: CustomerData | null) {
  if (!c) return {
    weddingDate: "", weddingTime: "", venueName: "", venueAddress: "",
    brideFirstName: "", brideLastName: "", groomFirstName: "", groomLastName: "",
    brideMotherFirstName: "", brideMotherLastName: "",
    brideFatherFirstName: "", brideFatherLastName: "",
    groomMotherFirstName: "", groomMotherLastName: "",
    groomFatherFirstName: "", groomFatherLastName: "",
  };
  return {
    weddingDate: c.weddingDate ? new Date(c.weddingDate).toISOString().split("T")[0] : "",
    weddingTime: c.weddingTime || "",
    venueName: c.venueName || "",
    venueAddress: c.venueAddress || "",
    brideFirstName: c.bride?.firstName || "", brideLastName: c.bride?.lastName || "",
    groomFirstName: c.groom?.firstName || "", groomLastName: c.groom?.lastName || "",
    brideMotherFirstName: c.brideFamily?.mother?.firstName || "",
    brideMotherLastName: c.brideFamily?.mother?.lastName || "",
    brideFatherFirstName: c.brideFamily?.father?.firstName || "",
    brideFatherLastName: c.brideFamily?.father?.lastName || "",
    groomMotherFirstName: c.groomFamily?.mother?.firstName || "",
    groomMotherLastName: c.groomFamily?.mother?.lastName || "",
    groomFatherFirstName: c.groomFamily?.father?.firstName || "",
    groomFatherLastName: c.groomFamily?.father?.lastName || "",
  };
}

function AyarlarForm({ customer, isDemo, updateCustomer }: {
  customer: CustomerData | null;
  isDemo?: boolean;
  updateCustomer: (data: Partial<CustomerData>) => Promise<boolean>;
}) {
  const t = useTranslations("Dashboard");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => buildFormFromCustomer(customer));

  const handleChange = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const success = await updateCustomer({
      weddingDate: form.weddingDate,
      weddingTime: form.weddingTime,
      venueName: form.venueName,
      venueAddress: form.venueAddress,
      groom: { firstName: form.groomFirstName, lastName: form.groomLastName },
      bride: { firstName: form.brideFirstName, lastName: form.brideLastName },
      groomFamily: {
        father: { firstName: form.groomFatherFirstName, lastName: form.groomFatherLastName },
        mother: { firstName: form.groomMotherFirstName, lastName: form.groomMotherLastName },
      },
      brideFamily: {
        father: { firstName: form.brideFatherFirstName, lastName: form.brideFatherLastName },
        mother: { firstName: form.brideMotherFirstName, lastName: form.brideMotherLastName },
      },
    } as Parameters<typeof updateCustomer>[0]);
    setSaving(false);
    if (success) toast.success(t("settingsSaved"));
    else toast.error(t("settingsError"));
  };

  const v = (field: keyof typeof form) => isDemo ? mockData[field as keyof typeof mockData] || "" : form[field];

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border p-6 space-y-5">
        <h2 className="font-semibold">{t("weddingInfo")}</h2>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">{t("weddingDate")}</label>
            <input type="date" className={inputClass} disabled={isDemo} value={v("weddingDate")} onChange={(e) => handleChange("weddingDate", e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">{t("weddingTime")}</label>
            <input type="time" className={inputClass} disabled={isDemo} value={v("weddingTime")} onChange={(e) => handleChange("weddingTime", e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">{t("venueName")}</label>
          <input type="text" className={inputClass} placeholder={t("venueNamePlaceholder")} disabled={isDemo} value={v("venueName")} onChange={(e) => handleChange("venueName", e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">{t("venueAddress")}</label>
          <input type="text" className={inputClass} placeholder={t("venueAddressPlaceholder")} disabled={isDemo} value={v("venueAddress")} onChange={(e) => handleChange("venueAddress", e.target.value)} />
        </div>
      </div>

      <div className="bg-card rounded-xl border p-6 space-y-5">
        <h2 className="font-semibold">{t("coupleInfo")}</h2>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">{t("brideName")}</label>
            <input type="text" className={inputClass} placeholder={t("brideNamePlaceholder")} disabled={isDemo} value={v("brideFirstName")} onChange={(e) => handleChange("brideFirstName", e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">{t("brideSurname")}</label>
            <input type="text" className={inputClass} placeholder={t("brideSurnamePlaceholder")} disabled={isDemo} value={v("brideLastName")} onChange={(e) => handleChange("brideLastName", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">{t("groomName")}</label>
            <input type="text" className={inputClass} placeholder={t("groomNamePlaceholder")} disabled={isDemo} value={v("groomFirstName")} onChange={(e) => handleChange("groomFirstName", e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">{t("groomSurname")}</label>
            <input type="text" className={inputClass} placeholder={t("groomSurnamePlaceholder")} disabled={isDemo} value={v("groomLastName")} onChange={(e) => handleChange("groomLastName", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-6 space-y-5">
        <h2 className="font-semibold">{t("familyInfo")}</h2>
        <Separator />
        <h3 className="text-sm font-medium text-muted-foreground">{t("brideFamily")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">{t("motherNameAndSurname")}</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" className={inputClass} placeholder={t("motherNamePlaceholder")} disabled={isDemo} value={v("brideMotherFirstName")} onChange={(e) => handleChange("brideMotherFirstName", e.target.value)} />
              <input type="text" className={inputClass} placeholder={t("surnamePlaceholder")} disabled={isDemo} value={v("brideMotherLastName")} onChange={(e) => handleChange("brideMotherLastName", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">{t("fatherNameAndSurname")}</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" className={inputClass} placeholder={t("fatherNamePlaceholder")} disabled={isDemo} value={v("brideFatherFirstName")} onChange={(e) => handleChange("brideFatherFirstName", e.target.value)} />
              <input type="text" className={inputClass} placeholder={t("surnamePlaceholder")} disabled={isDemo} value={v("brideFatherLastName")} onChange={(e) => handleChange("brideFatherLastName", e.target.value)} />
            </div>
          </div>
        </div>
        <Separator />
        <h3 className="text-sm font-medium text-muted-foreground">{t("groomFamily")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">{t("motherNameAndSurname")}</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" className={inputClass} placeholder={t("motherNamePlaceholder")} disabled={isDemo} value={v("groomMotherFirstName")} onChange={(e) => handleChange("groomMotherFirstName", e.target.value)} />
              <input type="text" className={inputClass} placeholder={t("surnamePlaceholder")} disabled={isDemo} value={v("groomMotherLastName")} onChange={(e) => handleChange("groomMotherLastName", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">{t("fatherNameAndSurname")}</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" className={inputClass} placeholder={t("fatherNamePlaceholder")} disabled={isDemo} value={v("groomFatherFirstName")} onChange={(e) => handleChange("groomFatherFirstName", e.target.value)} />
              <input type="text" className={inputClass} placeholder={t("surnamePlaceholder")} disabled={isDemo} value={v("groomFatherLastName")} onChange={(e) => handleChange("groomFatherLastName", e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <Button
        disabled={isDemo || saving}
        onClick={handleSave}
        className="w-full bg-white text-black hover:bg-white/90 rounded-xl py-3 h-auto font-medium"
      >
        {saving ? <Loader2 className="size-4 animate-spin" /> : t("save")}
      </Button>
    </div>
  );
}

export function AyarlarContent({ isDemo }: { isDemo?: boolean }) {
  const t = useTranslations("Dashboard");
  const { customer, isLoadingCustomer, fetchCustomer, updateCustomer } = useDashboardStore();

  useEffect(() => {
    if (!isDemo && !customer) fetchCustomer();
  }, [isDemo, customer, fetchCustomer]);

  if (!isDemo && isLoadingCustomer) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Settings className="size-5 text-muted-foreground" />
        <h1 className="text-xl font-semibold tracking-tight">{t("settings")}</h1>
      </div>
      <AyarlarForm
        key={customer?._id || "empty"}
        customer={customer}
        isDemo={isDemo}
        updateCustomer={updateCustomer}
      />
    </>
  );
}
