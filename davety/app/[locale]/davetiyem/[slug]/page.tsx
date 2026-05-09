import { cache } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import type { InvitationDoc } from "@davety/schema";
import { prisma } from "@/src/lib/prisma";
import { getSession } from "@/src/lib/session";
import { PublicInvitation } from "@/src/components/PublicInvitation";
import { PasswordGate } from "@/src/components/PasswordGate";

type Params = Promise<{ locale: string; slug: string }>;

export const dynamic = "force-dynamic";

/**
 * Hem `generateMetadata` hem `PublicInvitationPage` aynı satırı
 * çekiyordu, request başına 2 kez DB round-trip oluyordu. React.cache
 * ile aynı request içindeki ikinci çağrı in-memory döner. Wide select
 * (passwordHash/archivedAt) — eski migration'lı DB'lerde "Unknown field"
 * fırlarsa fallback select'e düşer.
 */
type DesignRow = {
  id: string;
  slug: string;
  userId: string;
  status: string;
  doc: unknown;
  publishedDoc: unknown;
  publishedAt: Date | null;
  passwordHash: string | null;
  archivedAt: Date | null;
};

const getDesignBySlug = cache(
  async (slug: string): Promise<DesignRow | null> => {
    try {
      return (await prisma.invitationDesign.findFirst({
        where: { OR: [{ slug }, { vanityPath: slug }] },
        select: {
          id: true,
          slug: true,
          userId: true,
          status: true,
          doc: true,
          publishedDoc: true,
          publishedAt: true,
          passwordHash: true,
          archivedAt: true,
        },
      })) as DesignRow | null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (/Unknown field|column .* does not exist/i.test(msg)) {
        const fallback = await prisma.invitationDesign.findFirst({
          where: { OR: [{ slug }, { vanityPath: slug }] },
          select: {
            id: true,
            slug: true,
            userId: true,
            status: true,
            doc: true,
            publishedDoc: true,
            publishedAt: true,
          },
        });
        return fallback
          ? { ...fallback, passwordHash: null, archivedAt: null }
          : null;
      }
      throw err;
    }
  },
);

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const design = await getDesignBySlug(slug);
  if (!design || design.status !== "published" || !design.publishedDoc) {
    return {
      title: "Davetiye",
      robots: { index: false, follow: false },
    };
  }
  const doc = design.publishedDoc as {
    meta?: { weddingDate?: string };
    blocks?: Array<{ type: string; data?: { brideName?: string; groomName?: string } }>;
  };
  const hero = doc.blocks?.find((b) => b.type === "hero");
  const heroData = hero?.data as
    | { brideName?: string; groomName?: string }
    | undefined;
  const couple =
    heroData?.brideName && heroData?.groomName
      ? `${heroData.brideName} & ${heroData.groomName}`
      : "Davetiye";
  const dateLabel = doc.meta?.weddingDate
    ? new Date(doc.meta.weddingDate).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  const title = dateLabel ? `${couple} · ${dateLabel}` : couple;
  const description = `${couple} sizi düğün davetlerine bekliyor.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://davetyolla.com/davetiyem/${design.slug}`,
      siteName: "DavetYolla",
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: false },
  };
}

export default async function PublicInvitationPage({
  params,
}: {
  params: Params;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // Session ve design fetch paralel; design fetch React.cache ile
  // dedup edildiği için generateMetadata'nın çağrısı zaten cached.
  const [session, design] = await Promise.all([
    getSession(),
    getDesignBySlug(slug),
  ]);

  // Olmayan davetiye linkine girilirse (typo, başkasının silinmiş daveti,
  // tahmin edilmiş slug) kullanıcıyı 404 yerine ana sayfaya yönlendir.
  // localePrefix: "never" olduğu için URL'de /tr /en yok, sadece "/".
  if (!design) redirect("/");

  const isOwner = session?.user?.id === design.userId;

  if (design.archivedAt && !isOwner) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-[#f5f6f3] px-6">
        <div className="max-w-md text-center">
          <h1
            className="text-3xl mb-3"
            style={{ fontFamily: "Merienda, serif" }}
          >
            Bu davetiye arşivlenmiş
          </h1>
          <p className="text-sm text-muted-foreground">
            Etkinlik tarihi geçtiği için davetiye otomatik arşive alınmış.
            Etkinlik sahibi yeniden yayına alabilir.
          </p>
        </div>
      </main>
    );
  }

  if (design.passwordHash && !isOwner) {
    const cookieStore = await cookies();
    const ok = cookieStore.get(`dyl_unlock_${design.id}`)?.value === "1";
    if (!ok) {
      return <PasswordGate slug={design.slug} />;
    }
  }

  const doc = (
    isOwner
      ? design.doc ?? design.publishedDoc
      : design.publishedDoc ?? design.doc
  ) as InvitationDoc | null;
  if (!doc) redirect("/");

  const isDraft = design.status !== "published" || !design.publishedDoc;

  if (isDraft && !isOwner) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-[#f5f6f3] px-6">
        <div className="max-w-md text-center">
          <h1
            className="text-3xl mb-3"
            style={{ fontFamily: "Merienda, serif" }}
          >
            Henüz yayınlanmamış
          </h1>
          <p className="text-sm text-muted-foreground">
            Bu davetiye henüz sahibi tarafından yayınlanmamış.
          </p>
        </div>
      </main>
    );
  }

  const jsonLd = buildEventJsonLd(doc, design.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicInvitation
        doc={doc}
        slug={design.slug}
        isOwner={isOwner}
        isDraft={isDraft}
        designId={design.id}
      />
    </>
  );
}

function buildEventJsonLd(doc: InvitationDoc, slug: string) {
  const hero = doc.blocks.find((b) => b.type === "hero");
  const heroData = hero?.data as
    | { brideName?: string; groomName?: string }
    | undefined;
  const venue = doc.blocks.find((b) => b.type === "venue");
  const venueData = venue?.data as
    | { venueName?: string; venueAddress?: string }
    | undefined;
  const couple =
    heroData?.brideName && heroData?.groomName
      ? `${heroData.brideName} & ${heroData.groomName}`
      : "Davetiye";
  const startIso = `${doc.meta.weddingDate}T${doc.meta.weddingTime}:00`;
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${couple} Düğünü`,
    startDate: startIso,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: venueData?.venueName
      ? {
          "@type": "Place",
          name: venueData.venueName,
          address: venueData.venueAddress ?? "",
        }
      : undefined,
    organizer: { "@type": "Person", name: couple },
    url: `https://davetyolla.com/davetiyem/${slug}`,
    inLanguage: doc.meta.locale,
  };
}
