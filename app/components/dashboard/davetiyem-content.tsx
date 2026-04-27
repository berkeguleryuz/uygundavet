"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  PenLine, Copy, Check, Eye, Share2, Heart, MapPin, CalendarHeart, Loader2, ExternalLink, MessageCircle, Camera, Globe, Save,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useDashboardStore } from "@/store/dashboard-store";
import { QrSticker } from "./QrSticker";
import { UploadQrSticker } from "./UploadQrSticker";
import { TableCardQr } from "./TableCardQr";

const accentColor = "#d5d1ad";

export function DavetiyemContent({ isDemo }: { isDemo?: boolean }) {
  const t = useTranslations("Dashboard");
  const { customer, stats, isLoadingCustomer, fetchCustomer, fetchStats, updateCustomer } = useDashboardStore();
  const [copied, setCopied] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const [savingDomain, setSavingDomain] = useState(false);

  useEffect(() => {
    if (!isDemo) {
      if (!customer) fetchCustomer();
      if (!stats) fetchStats();
    }
  }, [isDemo, customer, stats, fetchCustomer, fetchStats]);

  const [lastSyncedDomain, setLastSyncedDomain] = useState<string | undefined>(undefined);
  if (customer?.customDomain !== lastSyncedDomain) {
    setLastSyncedDomain(customer?.customDomain);
    setCustomDomain(customer?.customDomain || "");
  }

  const handleSaveDomain = async () => {
    if (isDemo) return;
    setSavingDomain(true);
    const ok = await updateCustomer({ customDomain: customDomain.trim() } as Parameters<typeof updateCustomer>[0]);
    setSavingDomain(false);
    if (ok) toast.success(t("customDomainSaved"));
    else toast.error(t("customDomainInvalid"));
  };

  const domainDirty = (customer?.customDomain || "") !== customDomain.trim();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://uygundavet.com";
  const inviteCode = customer?.inviteCode;
  const savedDomain = (customer?.customDomain || "").trim();
  const customBase = savedDomain ? `https://${savedDomain}` : "";
  const shareLink = isDemo
    ? `${siteUrl}/demo`
    : customBase
      ? `${customBase}/lcv`
      : inviteCode
        ? `${siteUrl}/rsvp/${inviteCode}`
        : siteUrl;
  const whatsappShareLink = customBase
    ? `${customBase}/lcv?source=whatsapp`
    : inviteCode
      ? `${siteUrl}/rsvp/${inviteCode}?source=whatsapp`
      : siteUrl;

  const coupleName = isDemo
    ? "Ayşe & Mehmet"
    : customer
      ? `${customer.bride.firstName} & ${customer.groom.firstName}`
      : "...";

  const brideFirst = isDemo
    ? "Ayşe"
    : customer?.bride?.firstName || "";
  const groomFirst = isDemo
    ? "Mehmet"
    : customer?.groom?.firstName || "";

  const uploadLink = customBase
    ? customBase
    : inviteCode
      ? `${siteUrl}/paylas/${inviteCode}`
      : siteUrl;
  const showMemoryQrs = isDemo || Boolean(inviteCode && brideFirst && groomFirst);

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
        <div className="lg:col-span-1">
          <Card className="rounded-2xl relative overflow-hidden py-0">
            {isDemo && (
              <Badge variant="outline" className="absolute top-4 right-4 text-amber-500 border-amber-500/40 bg-card z-10">
                Demo
              </Badge>
            )}

            <CardContent className="px-5 sm:px-2 py-10 sm:py-14 flex flex-col items-center text-center gap-5">
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-border" />
                <Heart className="size-5" style={{ color: accentColor }} />
                <div className="h-px w-12 bg-border" />
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  {t("weAreGettingMarried")}
                </p>
                <h2
                  className="text-2xl sm:text-3xl font-merienda tracking-tight"
                  style={{ color: accentColor }}
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

              <div className="bg-muted/50 rounded-xl border p-4 w-full">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <MapPin className="size-3.5" style={{ color: accentColor }} />
                  <span className="font-medium text-xs">{t("venue")}</span>
                </div>
                <p className="text-sm font-medium">{venue}</p>
                {venueAddr && <p className="text-xs text-muted-foreground mt-1">{venueAddr}</p>}
                {weddingTime && <p className="text-xs text-muted-foreground">{t("time")} {weddingTime}</p>}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("invitationMessage")}
              </p>

              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-border" />
                <Heart className="size-5" style={{ color: accentColor }} />
                <div className="h-px w-12 bg-border" />
              </div>
            </CardContent>
          </Card>
        </div>

        {showMemoryQrs && (
          <div className="lg:col-span-1 flex flex-col gap-4 sm:gap-6">
            <Card className="rounded-xl py-0">
              <CardContent className="px-5 py-5 flex flex-col gap-4">
                <div className="flex items-start gap-2">
                  <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Camera className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">
                      {t("memoryQrSectionTitle")}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                      {t("memoryQrSectionHint")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                      {t("tableStickerLabel")}
                    </p>
                    <UploadQrSticker
                      url={uploadLink}
                      coupleName={coupleName}
                    />
                    <p className="text-[9px] text-muted-foreground/70 text-center leading-snug">
                      {t("tableStickerHint")}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                      {t("tableCardLabel")}
                    </p>
                    <TableCardQr
                      url={uploadLink}
                      brideFirst={brideFirst}
                      groomFirst={groomFirst}
                      weddingDateStr={weddingDateStr}
                    />
                    <p className="text-[9px] text-muted-foreground/70 text-center leading-snug">
                      {t("tableCardHint")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="lg:col-span-1 flex flex-col gap-4 sm:gap-6">
          <Card className="rounded-xl py-0">
            <CardContent className="px-5 py-5 flex flex-col gap-4">
              <div className="flex items-start gap-2">
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Globe className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">{t("customDomainTitle")}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    {t("customDomainDesc")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder={t("customDomainPlaceholder")}
                  disabled={isDemo}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  className="text-sm bg-muted/50 border-border/50 h-9"
                />
                <Button
                  className="h-9 shrink-0 gap-1.5 bg-[#d5d1ad] text-neutral-900 hover:bg-[#c6c29f] disabled:opacity-50"
                  onClick={handleSaveDomain}
                  disabled={isDemo || savingDomain || !domainDirty}
                >
                  {savingDomain ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  {t("customDomainSave")}
                </Button>
              </div>
              {customer?.customDomain && !domainDirty && (
                <p className="text-[10px] text-muted-foreground/80">
                  {t("customDomainActive")}:{" "}
                  <span className="font-mono text-foreground/80">
                    {customer.customDomain}
                  </span>
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-xl py-0">
            <CardContent className="px-5 py-5 flex flex-col gap-4">
              <h3 className="font-medium text-sm">{t("share")}</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Input readOnly value={shareLink} className="text-sm bg-muted/50 border-border/50 h-9" />
                  <Button variant="outline" size="icon" className="size-9 shrink-0" onClick={handleCopy} disabled={isDemo}>
                    {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                  </Button>
                </div>
                {inviteCode && !isDemo ? (
                  <>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(whatsappShareLink)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 w-full max-w-[200px] mx-auto h-8 rounded-lg bg-[#25D366] hover:bg-[#22c55e] text-white text-xs font-medium transition-colors"
                    >
                      <MessageCircle className="size-3.5" />
                      {t("shareWhatsApp")}
                    </a>
                    <QrSticker url={shareLink} coupleName={coupleName} />
                    <Link
                      href={`/rsvp/${inviteCode}`}
                      target="_blank"
                      className="flex items-center justify-center gap-1.5 w-full max-w-[200px] mx-auto h-8 rounded-lg border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors font-sans"
                    >
                      <ExternalLink className="size-3" />
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
            </CardContent>
          </Card>

          <Card className="rounded-xl py-0">
            <CardContent className="px-5 py-5 flex flex-col gap-4">
              <h3 className="font-medium text-sm">{t("statistics")}</h3>
              <div className="flex flex-col gap-3">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
