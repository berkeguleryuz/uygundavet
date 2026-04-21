import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Camera, BookHeart, Lock } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { Order } from "@/models/Order";
import { canAccess } from "@/lib/package-gating";
import type { SelectedPackage } from "@/models/Order";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Paylas" });
  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

interface PaylasData {
  brideFirst: string;
  groomFirst: string;
  hasGallery: boolean;
  hasMemoryBook: boolean;
  galleryUrl: string;
  memoryUrl: string;
}

async function loadPaylasData(inviteCode: string): Promise<PaylasData | null> {
  await connectDB();
  const customer = await Customer.findOne({ inviteCode }).lean();
  if (!customer) return null;

  const order = await Order.findOne({ userId: customer.userId }).lean();
  const pkg = (order?.selectedPackage || "starter") as SelectedPackage;
  const theme = order?.selectedTheme || "sunset";
  const customDomain = (customer.customDomain || "").trim().replace(/\/+$/, "");

  const base = customDomain
    ? /^https?:\/\//.test(customDomain)
      ? customDomain
      : `https://${customDomain}`
    : `/${theme}`;

  return {
    brideFirst: customer.bride.firstName || "",
    groomFirst: customer.groom.firstName || "",
    hasGallery: canAccess("gallery", pkg),
    hasMemoryBook: canAccess("memoryBook", pkg),
    galleryUrl: `${base}/galeri`,
    memoryUrl: `${base}/ani-defteri`,
  };
}

export default async function PaylasPage({
  params,
}: {
  params: Promise<{ inviteCode: string; locale: string }>;
}) {
  const { inviteCode, locale } = await params;
  const t = await getTranslations({ locale, namespace: "Paylas" });
  const data = await loadPaylasData(inviteCode);
  if (!data) notFound();

  const coupleName = `${data.brideFirst} & ${data.groomFirst}`;

  return (
    <div className="min-h-svh bg-[#1c1a1b] text-[#faf0e6] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <div className="w-36 h-10 relative">
          <Image
            src="/brand-text.png"
            alt="Uygun Davet"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="text-center space-y-2">
          <h1 className="font-merienda text-3xl text-[#d5d1ad]">
            {coupleName}
          </h1>
          <p className="text-sm text-[#faf0e6]/60">{t("subtitle")}</p>
        </div>

        <div className="w-full flex flex-col gap-4">
          {data.hasGallery ? (
            <Link
              href={data.galleryUrl}
              target={data.galleryUrl.startsWith("http") ? "_blank" : undefined}
              className="flex items-center gap-4 rounded-2xl border-2 border-[#d5d1ad]/40 bg-[#d5d1ad]/5 hover:bg-[#d5d1ad]/10 hover:border-[#d5d1ad]/70 transition-all p-5"
            >
              <div className="size-12 rounded-full bg-[#d5d1ad]/15 flex items-center justify-center shrink-0">
                <Camera className="size-5 text-[#d5d1ad]" />
              </div>
              <div className="flex-1">
                <p className="font-merienda text-lg text-[#d5d1ad]">
                  {t("uploadPhoto")}
                </p>
                <p className="text-xs text-[#faf0e6]/50 mt-0.5">
                  {t("uploadPhotoHint")}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-4 rounded-2xl border border-[#faf0e6]/10 bg-[#faf0e6]/[0.02] p-5 opacity-50">
              <div className="size-12 rounded-full bg-[#faf0e6]/10 flex items-center justify-center shrink-0">
                <Lock className="size-4 text-[#faf0e6]/40" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#faf0e6]/60">{t("uploadPhoto")}</p>
                <p className="text-xs text-[#faf0e6]/40 mt-0.5">
                  {t("featureNotAvailable")}
                </p>
              </div>
            </div>
          )}

          {data.hasMemoryBook ? (
            <Link
              href={data.memoryUrl}
              target={data.memoryUrl.startsWith("http") ? "_blank" : undefined}
              className="flex items-center gap-4 rounded-2xl border-2 border-[#d5d1ad]/40 bg-[#d5d1ad]/5 hover:bg-[#d5d1ad]/10 hover:border-[#d5d1ad]/70 transition-all p-5"
            >
              <div className="size-12 rounded-full bg-[#d5d1ad]/15 flex items-center justify-center shrink-0">
                <BookHeart className="size-5 text-[#d5d1ad]" />
              </div>
              <div className="flex-1">
                <p className="font-merienda text-lg text-[#d5d1ad]">
                  {t("leaveMemory")}
                </p>
                <p className="text-xs text-[#faf0e6]/50 mt-0.5">
                  {t("leaveMemoryHint")}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-4 rounded-2xl border border-[#faf0e6]/10 bg-[#faf0e6]/[0.02] p-5 opacity-50">
              <div className="size-12 rounded-full bg-[#faf0e6]/10 flex items-center justify-center shrink-0">
                <Lock className="size-4 text-[#faf0e6]/40" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#faf0e6]/60">{t("leaveMemory")}</p>
                <p className="text-xs text-[#faf0e6]/40 mt-0.5">
                  {t("featureNotAvailable")}
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-[10px] text-[#faf0e6]/30 mt-4">
          uygundavet.com
        </p>
      </div>
    </div>
  );
}
