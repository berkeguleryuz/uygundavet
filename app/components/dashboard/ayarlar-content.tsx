"use client";

import { useTranslations } from "next-intl";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const inputClass =
  "w-full rounded-xl border border-border/50 bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50 disabled:cursor-not-allowed";

const mockData = {
  weddingDate: "2026-09-12",
  weddingTime: "18:00",
  venueName: "Çırağan Palace Kempinski",
  venueAddress: "Çırağan Cad. No:32, Beşiktaş, İstanbul",
  brideName: "Elif",
  brideSurname: "Yıldız",
  groomName: "Burak",
  groomSurname: "Özdemir",
  brideMotherName: "Ayşe",
  brideMotherSurname: "Yıldız",
  brideFatherName: "Mehmet",
  brideFatherSurname: "Yıldız",
  groomMotherName: "Fatma",
  groomMotherSurname: "Özdemir",
  groomFatherName: "Ali",
  groomFatherSurname: "Özdemir",
};

export function AyarlarContent({ isDemo }: { isDemo?: boolean }) {
  const t = useTranslations("Dashboard");
  return (
    <>
      <div className="flex items-center gap-3">
        <Settings className="size-5 text-muted-foreground" />
        <h1 className="text-xl font-semibold tracking-tight">{t("settings")}</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-card rounded-xl border p-6 space-y-5">
          <h2 className="font-semibold">{t("weddingInfo")}</h2>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                {t("weddingDate")}
              </label>
              <input
                type="date"
                className={inputClass}
                disabled={isDemo}
                defaultValue={isDemo ? mockData.weddingDate : ""}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                {t("weddingTime")}
              </label>
              <input
                type="time"
                className={inputClass}
                disabled={isDemo}
                defaultValue={isDemo ? mockData.weddingTime : ""}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">{t("venueName")}</label>
            <input
              type="text"
              className={inputClass}
              placeholder={t("venueNamePlaceholder")}
              disabled={isDemo}
              defaultValue={isDemo ? mockData.venueName : ""}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              {t("venueAddress")}
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder={t("venueAddressPlaceholder")}
              disabled={isDemo}
              defaultValue={isDemo ? mockData.venueAddress : ""}
            />
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 space-y-5">
          <h2 className="font-semibold">{t("coupleInfo")}</h2>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">{t("brideName")}</label>
              <input
                type="text"
                className={inputClass}
                placeholder={t("brideNamePlaceholder")}
                disabled={isDemo}
                defaultValue={isDemo ? mockData.brideName : ""}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                {t("brideSurname")}
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder={t("brideSurnamePlaceholder")}
                disabled={isDemo}
                defaultValue={isDemo ? mockData.brideSurname : ""}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                {t("groomName")}
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder={t("groomNamePlaceholder")}
                disabled={isDemo}
                defaultValue={isDemo ? mockData.groomName : ""}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                {t("groomSurname")}
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder={t("groomSurnamePlaceholder")}
                disabled={isDemo}
                defaultValue={isDemo ? mockData.groomSurname : ""}
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 space-y-5">
          <h2 className="font-semibold">{t("familyInfo")}</h2>
          <Separator />

          <h3 className="text-sm font-medium text-muted-foreground">
            {t("brideFamily")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">{t("motherNameAndSurname")}</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  className={inputClass}
                  placeholder={t("motherNamePlaceholder")}
                  disabled={isDemo}
                  defaultValue={isDemo ? mockData.brideMotherName : ""}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder={t("surnamePlaceholder")}
                  disabled={isDemo}
                  defaultValue={isDemo ? mockData.brideMotherSurname : ""}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">{t("fatherNameAndSurname")}</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  className={inputClass}
                  placeholder={t("fatherNamePlaceholder")}
                  disabled={isDemo}
                  defaultValue={isDemo ? mockData.brideFatherName : ""}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder={t("surnamePlaceholder")}
                  disabled={isDemo}
                  defaultValue={isDemo ? mockData.brideFatherSurname : ""}
                />
              </div>
            </div>
          </div>

          <Separator />

          <h3 className="text-sm font-medium text-muted-foreground">
            {t("groomFamily")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">{t("motherNameAndSurname")}</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  className={inputClass}
                  placeholder={t("motherNamePlaceholder")}
                  disabled={isDemo}
                  defaultValue={isDemo ? mockData.groomMotherName : ""}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder={t("surnamePlaceholder")}
                  disabled={isDemo}
                  defaultValue={isDemo ? mockData.groomMotherSurname : ""}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">{t("fatherNameAndSurname")}</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  className={inputClass}
                  placeholder={t("fatherNamePlaceholder")}
                  disabled={isDemo}
                  defaultValue={isDemo ? mockData.groomFatherName : ""}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder={t("surnamePlaceholder")}
                  disabled={isDemo}
                  defaultValue={isDemo ? mockData.groomFatherSurname : ""}
                />
              </div>
            </div>
          </div>
        </div>

        <Button
          disabled={isDemo}
          className="w-full bg-white text-black hover:bg-white/90 rounded-xl py-3 h-auto font-medium"
        >
          {t("save")}
        </Button>
      </div>
    </>
  );
}
