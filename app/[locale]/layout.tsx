import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/app/components/theme-provider";
import { SupportWidget } from "@/app/components/SupportWidget";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://uygundavet.com";
  const ogLocale =
    locale === "tr" ? "tr_TR" : locale === "de" ? "de_DE" : "en_US";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("title"),
      template: `%s | ${t("brandName")}`,
    },
    description: t("description"),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      url: siteUrl,
      siteName: t("brandName"),
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    manifest: "/manifest.webmanifest",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  await params;
  const messages = await getMessages();

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark" disableTransitionOnChange enableColorScheme={false}>
      <NextIntlClientProvider messages={messages}>
        {children}
        <SupportWidget />
        <Toaster position="top-center" theme="dark" richColors />
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
