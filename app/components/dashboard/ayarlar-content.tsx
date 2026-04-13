"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Settings, Loader2, Plus, X, Clock, ImageIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDashboardStore } from "@/store/dashboard-store";
import { toast } from "sonner";
import Image from "next/image";
import type { CustomerData } from "@/types/dashboard";

type EventScheduleItem = { time: string; label: string };
type StoryMilestone = { date: string; title: string; description: string; imageUrl: string; imagePublicId: string };

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

  const [eventSchedule, setEventSchedule] = useState<EventScheduleItem[]>(
    () => customer?.eventSchedule?.length ? [...customer.eventSchedule] as EventScheduleItem[] : []
  );

  const [storyMilestones, setStoryMilestones] = useState<StoryMilestone[]>(
    () => customer?.storyMilestones?.length ? [...customer.storyMilestones] as StoryMilestone[] : []
  );

  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleAddScheduleItem = () => {
    if (eventSchedule.length >= 10) return;
    setEventSchedule((prev) => [...prev, { time: "", label: "" }]);
  };

  const handleRemoveScheduleItem = (index: number) => {
    setEventSchedule((prev) => prev.filter((_, i) => i !== index));
  };

  const handleScheduleChange = (index: number, field: keyof EventScheduleItem, value: string) => {
    setEventSchedule((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleAddMilestone = () => {
    if (storyMilestones.length >= 10) return;
    setStoryMilestones((prev) => [
      ...prev,
      { date: "", title: "", description: "", imageUrl: "", imagePublicId: "" },
    ]);
  };

  const handleRemoveMilestone = (index: number) => {
    setStoryMilestones((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMilestoneChange = (index: number, field: keyof StoryMilestone, value: string) => {
    setStoryMilestones((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleMilestoneUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/dashboard/customer/milestone-upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setStoryMilestones((prev) =>
        prev.map((item, i) =>
          i === index
            ? { ...item, imageUrl: data.imageUrl, imagePublicId: data.imagePublicId }
            : item
        )
      );
      toast.success("Fotoğraf yüklendi");
    } catch {
      toast.error("Fotoğraf yüklenirken bir hata oluştu");
    } finally {
      setUploadingIndex(null);
    }
  };

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
      eventSchedule,
      storyMilestones,
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

      {/* Etkinlik Programı */}
      <div className="bg-card rounded-xl border p-6 space-y-5">
        <div>
          <h2 className="font-semibold">Etkinlik Programı</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Düğün gününüzün programını belirleyin.
          </p>
        </div>
        <Separator />
        <div className="space-y-3">
          {eventSchedule.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <Clock className="size-4 text-muted-foreground shrink-0" />
              <input
                type="time"
                className={inputClass}
                disabled={isDemo}
                value={item.time}
                onChange={(e) => handleScheduleChange(index, "time", e.target.value)}
                style={{ maxWidth: "140px" }}
              />
              <input
                type="text"
                className={inputClass}
                disabled={isDemo}
                placeholder="Örn: Nikah Töreni"
                value={item.label}
                onChange={(e) => handleScheduleChange(index, "label", e.target.value)}
              />
              <button
                type="button"
                disabled={isDemo}
                onClick={() => handleRemoveScheduleItem(index)}
                className="shrink-0 rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
        {eventSchedule.length < 10 && (
          <Button
            type="button"
            variant="outline"
            disabled={isDemo}
            onClick={handleAddScheduleItem}
            className="rounded-xl"
          >
            <Plus className="size-4 mr-2" />
            Etkinlik Ekle
          </Button>
        )}
      </div>

      {/* Hikaye Milestones */}
      <div className="bg-card rounded-xl border p-6 space-y-5">
        <div>
          <h2 className="font-semibold">Hikayeniz</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Düğün web sitenizde gösterilecek hikaye anlarınızı ekleyin. Minimum 4 anı önerilir.
          </p>
        </div>
        <Separator />
        <div className="space-y-4">
          {storyMilestones.map((milestone, index) => (
            <div key={index} className="relative bg-muted/30 rounded-xl border p-5 space-y-4">
              <button
                type="button"
                disabled={isDemo}
                onClick={() => handleRemoveMilestone(index)}
                className="absolute top-3 right-3 rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="size-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Tarih</label>
                  <input
                    type="text"
                    className={inputClass}
                    disabled={isDemo}
                    placeholder="Eylül 2020"
                    value={milestone.date}
                    onChange={(e) => handleMilestoneChange(index, "date", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Başlık</label>
                  <input
                    type="text"
                    className={inputClass}
                    disabled={isDemo}
                    placeholder="İlk Karşılaşma"
                    value={milestone.title}
                    onChange={(e) => handleMilestoneChange(index, "title", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Açıklama</label>
                <textarea
                  className={`${inputClass} min-h-[80px] resize-y`}
                  disabled={isDemo}
                  placeholder="Bu anınızı anlatın..."
                  value={milestone.description}
                  onChange={(e) => handleMilestoneChange(index, "description", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Fotoğraf</label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => { fileInputRefs.current[index] = el; }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleMilestoneUpload(index, file);
                    e.target.value = "";
                  }}
                />
                {milestone.imageUrl ? (
                  <div className="flex items-center gap-4">
                    <div className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden border">
                      <Image
                        src={milestone.imageUrl}
                        alt={milestone.title || "Milestone"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isDemo || uploadingIndex === index}
                      onClick={() => fileInputRefs.current[index]?.click()}
                      className="rounded-xl"
                    >
                      {uploadingIndex === index ? (
                        <Loader2 className="size-4 animate-spin mr-2" />
                      ) : (
                        <ImageIcon className="size-4 mr-2" />
                      )}
                      Değiştir
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isDemo || uploadingIndex === index}
                    onClick={() => fileInputRefs.current[index]?.click()}
                    className="rounded-xl"
                  >
                    {uploadingIndex === index ? (
                      <Loader2 className="size-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="size-4 mr-2" />
                    )}
                    Fotoğraf Yükle
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        {storyMilestones.length < 10 && (
          <Button
            type="button"
            variant="outline"
            disabled={isDemo}
            onClick={handleAddMilestone}
            className="rounded-xl"
          >
            <Plus className="size-4 mr-2" />
            Anı Ekle
          </Button>
        )}
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
