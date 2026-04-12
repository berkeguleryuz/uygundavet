"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  PenLine, Copy, Check, Eye, Share2, Heart, MapPin, CalendarHeart, Loader2, ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useDashboardStore } from "@/store/dashboard-store";
import { QrSticker } from "./QrSticker";

const themeColorDefs = [
  { key: "themeGold", color: "#d5d1ad", active: true },
  { key: "themeRose", color: "#e8b4b8", active: false },
  { key: "themeSage", color: "#b8c5b4", active: false },
];

export function DavetiyemContent({ isDemo }: { isDemo?: boolean }) {
  const t = useTranslations("Dashboard");
  const { customer, stats, isLoadingCustomer, fetchCustomer, fetchStats } = useDashboardStore();
  const [copied, setCopied] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(0);

  useEffect(() => {
    if (!isDemo) {
      if (!customer) fetchCustomer();
      if (!stats) fetchStats();
    }
  }, [isDemo, customer, stats, fetchCustomer, fetchStats]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://uygundavet.com";
  const inviteCode = customer?.inviteCode;
  const shareLink = isDemo
    ? `${siteUrl}/demo`
    : inviteCode
      ? `${siteUrl}/rsvp/${inviteCode}`
      : siteUrl;

  const coupleName = isDemo
    ? "Ayşe & Mehmet"
    : customer
      ? `${customer.bride.firstName} & ${customer.groom.firstName}`
      : "...";

  const weddingDateStr = isDemo
    ? "15 Haziran 2026, Cumartesi"
    : customer?.weddingDate
      ? new Date(customer.weddingDate).toLocaleDateString("tr-TR", {
          day: "numeric", month: "long", year: "numeric", weekday: "long",
        })
      : "—";

  const venue = isDemo ? "Bosphorus Palace" : customer?.venueName || "—";
  const venueAddr = isDemo ? "Beylerbeyi, Istanbul" : customer?.venueAddress || "";
  const weddingTime = isDemo ? "18:00" : customer?.weddingTime || "";
  const viewCount = isDemo ? "1,847" : (stats?.invitationViews || 0).toLocaleString("tr-TR");

  const handleCopy = () => {
    if (isDemo) return;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isDemo && isLoadingCustomer) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              {t("myInvitation")}
            </h1>
            {isDemo && (
              <Badge variant="outline" className="text-amber-500 border-amber-500/40">
                Demo
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("previewAndEdit")}
          </p>
        </div>
        <Button
          className="h-9 gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-border/50"
          disabled={isDemo}
        >
          <PenLine className="size-4" />
          {t("edit")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border p-6 sm:p-8 relative overflow-hidden">
            {isDemo && (
              <Badge variant="outline" className="absolute top-4 right-4 text-amber-500 border-amber-500/40 bg-card z-10">
                Demo
              </Badge>
            )}

            <div className="flex flex-col items-center text-center space-y-6 py-8 sm:py-12">
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-border" />
                <Heart className="size-5" style={{ color: themeColorDefs[selectedTheme].color }} />
                <div className="h-px w-12 bg-border" />
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  {t("weAreGettingMarried")}
                </p>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-merienda tracking-tight"
                  style={{ color: themeColorDefs[selectedTheme].color }}
                >
                  {coupleName}
                </h2>
              </div>

              <Separator className="max-w-[200px]" />

              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarHeart className="size-4" />
                <span className="text-sm font-medium tracking-wider uppercase">
                  {weddingDateStr}
                </span>
              </div>

              <div className="bg-muted/50 rounded-xl border p-6 max-w-md w-full">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MapPin className="size-4" style={{ color: themeColorDefs[selectedTheme].color }} />
                  <span className="font-medium text-sm">{t("venue")}</span>
                </div>
                <p className="text-lg font-medium">{venue}</p>
                {venueAddr && <p className="text-sm text-muted-foreground mt-1">{venueAddr}</p>}
                {weddingTime && <p className="text-sm text-muted-foreground">{t("time")} {weddingTime}</p>}
              </div>

              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                {t("invitationMessage")}
              </p>

              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-border" />
                <Heart className="size-5" style={{ color: themeColorDefs[selectedTheme].color }} />
                <div className="h-px w-12 bg-border" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          <div className="bg-card rounded-xl border p-5">
            <h3 className="font-medium text-sm mb-4">{t("themeSelection")}</h3>
            <div className="flex items-center gap-3">
              {themeColorDefs.map((theme, index) => (
                <button
                  key={theme.key}
                  onClick={() => !isDemo && setSelectedTheme(index)}
                  disabled={isDemo}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div
                    className={`size-10 rounded-full border-2 transition-all ${
                      selectedTheme === index
                        ? "border-foreground scale-110"
                        : "border-transparent hover:border-muted-foreground/50"
                    }`}
                    style={{ backgroundColor: theme.color }}
                  />
                  <span className="text-xs text-muted-foreground">{t(theme.key)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border p-5">
            <h3 className="font-medium text-sm mb-4">{t("share")}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input readOnly value={shareLink} className="text-sm bg-muted/50 border-border/50 h-9" />
                <Button variant="outline" size="icon" className="size-9 shrink-0" onClick={handleCopy} disabled={isDemo}>
                  {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
                </Button>
              </div>
              {inviteCode && !isDemo ? (
                <>
                  <QrSticker url={shareLink} coupleName={coupleName} />
                  <Link
                    href={`/rsvp/${inviteCode}`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full h-9 rounded-xl border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors font-sans"
                  >
                    <ExternalLink className="size-3.5" />
                    {t("previewRsvpForm")}
                  </Link>
                </>
              ) : (
                <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2">
                  <div className="size-24 border-2 border-muted-foreground/30 rounded-md flex items-center justify-center">
                    <span className="text-sm font-medium text-muted-foreground">QR</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t("qrDownload")}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl border p-5">
            <h3 className="font-medium text-sm mb-4">{t("statistics")}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="size-4" />
                  <span>{t("views")}</span>
                </div>
                <span className="text-sm font-medium">{viewCount}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Share2 className="size-4" />
                  <span>{t("shares")}</span>
                </div>
                <span className="text-sm font-medium">{isDemo ? "124" : "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
