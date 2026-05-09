import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { InvitationDoc } from "@davety/schema";
import { InvitationView, getCardShapeStyle } from "@davety/renderer";
import { prisma } from "@/src/lib/prisma";
import { PrintToolbar } from "./PrintToolbar";

/**
 * Yazdırılabilir davetiye sayfası. Public render'la AYNI InvitationView
 * kullanılır — tüm bloklar, fontlar, dekorasyonlar, görseller bire bir.
 * Tek farklar:
 *   1) Zarf yok (sadece kart silüeti)
 *   2) Üst köşede "PDF Olarak Kaydet" butonu var (window.print() tetikler)
 *   3) Print mode CSS'i ekran toolbar'ını + interactive butonları gizler
 *
 * Tier gate: Free paket PDF indiremez (planLimits dışı), sayfa "Klasik+
 * paketinde açılır" mesajı gösterir.
 *
 * Auth: yayında olan davetiye herkese açık (tıpkı public render gibi).
 * Tier kontrolü publishedDoc.meta.tier üzerinden yapılır.
 */
type Params = Promise<{ locale: string; slug: string }>;

export const dynamic = "force-dynamic";

export default async function PrintInvitationPage({
  params,
}: {
  params: Params;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const design = await prisma.invitationDesign.findFirst({
    where: { OR: [{ slug }, { vanityPath: slug }], status: "published" },
    select: { publishedDoc: true, slug: true },
  });
  if (!design || !design.publishedDoc) notFound();

  const doc = design.publishedDoc as unknown as InvitationDoc;
  const tier = doc.meta?.tier ?? "free";

  if (tier === "free") {
    return (
      <main className="min-h-dvh flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1
            className="text-3xl mb-3"
            style={{ fontFamily: "Merienda, serif" }}
          >
            PDF indirme Klasik+ paketinde
          </h1>
          <p className="text-sm text-muted-foreground">
            Bu özelliği kullanmak için davetiyenin paketini Klasik veya üst
            tier&apos;a yükseltmen gerekiyor.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <PrintToolbar />
      {/* Print sayfası: zarf wrapper'ı yok, sadece kartın kendisi.
          Public render'da kullanılan getCardShapeStyle (border-radius
          / clip-path) aynen uygulanır ki kart silüeti tutarlı olsun. */}
      <main className="print-page">
        <div
          className="invitation-card"
          style={{
            background: doc.theme.bgColor,
            color: doc.theme.accentColor,
            ...getCardShapeStyle(doc),
          }}
        >
          <InvitationView doc={doc} slug={design.slug} />
        </div>
      </main>

      {/* Print için global stil + interactive bit'leri gizle.
          @page boyutu A5 değil, sayfa boyu davetiyenin doğal yüksekliği
          olsun ki içerik bir sayfaya zorla sıkıştırılmasın. */}
      <style>{`
        @page { margin: 8mm; }
        .print-page {
          min-height: 100dvh;
          padding: 24px;
          background: #f5f6f3;
          display: flex;
          justify-content: center;
        }
        .invitation-card {
          width: 100%;
          max-width: 420px;
          overflow: hidden;
          box-shadow: 0 24px 60px -20px rgba(0,0,0,0.25);
        }
        @media print {
          body { background: #ffffff !important; }
          .print-page {
            padding: 0;
            background: #ffffff !important;
            min-height: auto;
          }
          .invitation-card {
            box-shadow: none;
            max-width: none;
            width: 100%;
          }
          /* Interactive butonları print'te gizle (RSVP submit, memory
             hatıra bırak, gallery upload, calendar add, vs.) */
          button,
          a[href^="mailto:"],
          a[href^="tel:"],
          a[href*="calendar.google.com"],
          a[download] {
            display: none !important;
          }
          /* Embed gizleme: video/audio playback elemanları */
          video, audio { display: none !important; }
        }
      `}</style>
    </>
  );
}
