"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { GuestsTable } from "@/app/components/dashboard/guests-table";
import { UserPlus, Users, CheckCircle, XCircle, Clock, Loader2, Minus, Plus } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard-store";
import { toast } from "sonner";

export function MisafirlerContent({ isDemo }: { isDemo?: boolean }) {
  const t = useTranslations("Dashboard");
  const { guests, fetchGuests, isLoadingGuests, addGuest } = useDashboardStore();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    guestCount: 1,
    note: "",
  });

  const handleAddGuest = async () => {
    if (!form.name.trim() || form.guestCount < 1) return;
    setSaving(true);
    const result = await addGuest({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: "",
      guestCount: form.guestCount,
      note: form.note.trim(),
      rsvpStatus: "pending",
      source: "manual",
    });
    setSaving(false);
    if (result) {
      toast.success(t("guestAdded"));
      setForm({ name: "", phone: "", guestCount: 1, note: "" });
      setSheetOpen(false);
    } else {
      toast.error(t("guestAddError"));
    }
  };

  useEffect(() => {
    if (!isDemo) {
      fetchGuests();
    }
  }, [isDemo, fetchGuests]);

  const confirmed = isDemo ? 186 : guests.filter((g) => g.rsvpStatus === "confirmed").length;
  const declined = isDemo ? 24 : guests.filter((g) => g.rsvpStatus === "declined").length;
  const pending = isDemo ? 38 : guests.filter((g) => g.rsvpStatus === "pending").length;
  const total = isDemo ? 248 : guests.length;

  const summaryStatDefs = [
    { key: "total", value: total, icon: Users, color: "text-foreground", bg: "bg-muted/50" },
    { key: "confirmed", value: confirmed, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { key: "declined", value: declined, icon: XCircle, color: "text-rose-400", bg: "bg-rose-500/10" },
    { key: "pending", value: pending, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              {t("guestList")}
            </h1>
            {isDemo && (
              <Badge variant="outline" className="text-amber-500 border-amber-500/40">
                Demo
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("guestListSubtitle")}
          </p>
        </div>
        <Button
          className="h-9 gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-border/50"
          disabled={isDemo}
          onClick={() => setSheetOpen(true)}
        >
          <UserPlus className="size-4" />
          {t("addGuest")}
        </Button>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>{t("addGuest")}</SheetTitle>
              <SheetDescription>{t("addGuestDescription")}</SheetDescription>
            </SheetHeader>
            <div className="space-y-5 px-4 pb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("guestNameLabel")} *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t("guestNamePlaceholder")}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("sortGuestCount")} *</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10 shrink-0"
                    onClick={() => setForm({ ...form, guestCount: Math.max(1, form.guestCount - 1) })}
                    disabled={form.guestCount <= 1}
                  >
                    <Minus className="size-4" />
                  </Button>
                  <div className="flex-1 text-center">
                    <span className="text-2xl font-semibold">{form.guestCount}</span>
                    <p className="text-xs text-muted-foreground">{t("personCount")}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10 shrink-0"
                    onClick={() => setForm({ ...form, guestCount: Math.min(50, form.guestCount + 1) })}
                    disabled={form.guestCount >= 50}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("tablePhone")}</label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={t("phonePlaceholder")}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("tableNote")}</label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder={t("notePlaceholder")}
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                />
              </div>

              <Button
                className="w-full h-10 bg-neutral-800 hover:bg-neutral-700 text-white"
                onClick={handleAddGuest}
                disabled={!form.name.trim() || form.guestCount < 1 || saving}
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin mr-2" />
                ) : (
                  <UserPlus className="size-4 mr-2" />
                )}
                {saving ? t("saving") : t("addGuest")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <GuestsTable isDemo={isDemo} />

      {!isLoadingGuests && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {summaryStatDefs.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.key}
                className="bg-card rounded-xl border p-4 flex items-center gap-3"
              >
                <div
                  className={`size-10 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`size-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-medium tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{t(stat.key)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
