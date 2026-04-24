import type { Metadata } from "next";
import { Chakra_Petch, Merienda, Space_Grotesk } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const merienda = Merienda({
  variable: "--font-merienda",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const chakra = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "davety — Dijital Davetiye Tasarım",
  description:
    "Düğün davetiyeni sürükle-bırak editör ile tasarla, zarfı özelleştir, misafirlerinle paylaş.",
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${merienda.variable} ${chakra.variable} antialiased`}
    >
      <body className="min-h-dvh bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
