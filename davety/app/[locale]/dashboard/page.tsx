import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Mail } from "lucide-react";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { Link } from "@/i18n/navigation";
import { DashboardList } from "@/app/components/DashboardList";

function DashboardIcon() {
  return <Mail className="size-6" strokeWidth={1.6} />;
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getSession();
  if (!session?.user) {
    redirect("/login?returnTo=/dashboard");
  }

  const designs = await prisma.invitationDesign.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { guests: true, memories: true } },
    },
  });

  // RSVP "yes" tally per design — done in one grouped query so the page
  // doesn't fan out to N+1 queries when the user has many invitations.
  const rsvpGroups =
    designs.length > 0
      ? await prisma.guest.groupBy({
          by: ["designId", "attending"],
          where: { designId: { in: designs.map((d) => d.id) } },
          _count: { _all: true },
          _sum: { guestCount: true },
        })
      : [];

  const rsvpByDesign = new Map<
    string,
    { yes: number; no: number; yesHeads: number }
  >();
  for (const g of rsvpGroups) {
    const cur = rsvpByDesign.get(g.designId) ?? {
      yes: 0,
      no: 0,
      yesHeads: 0,
    };
    if (g.attending === "yes") {
      cur.yes = g._count._all;
      cur.yesHeads = g._sum.guestCount ?? 0;
    } else if (g.attending === "no") {
      cur.no = g._count._all;
    }
    rsvpByDesign.set(g.designId, cur);
  }

  const publicBase =
    process.env.NEXT_PUBLIC_DAVETIYE_URL ?? "http://localhost:3000";

  const items = designs.map((d) => {
    const summary = summariseDoc(d.doc);
    const rsvp = rsvpByDesign.get(d.id) ?? { yes: 0, no: 0, yesHeads: 0 };
    return {
      id: d.id,
      slug: d.slug,
      vanityPath: d.vanityPath,
      status: d.status,
      updatedAt: d.updatedAt.toISOString(),
      createdAt: d.createdAt.toISOString(),
      publishedAt: d.publishedAt ? d.publishedAt.toISOString() : null,
      coupleName: summary.coupleName,
      templateLabel: summary.templateLabel,
      weddingIso: summary.weddingIso,
      venueName: summary.venueName,
      bgColor: summary.bgColor,
      accentColor: summary.accentColor,
      pageBgColor: summary.pageBgColor,
      guestCount: d._count.guests,
      memoryCount: d._count.memories,
      rsvpYes: rsvp.yes,
      rsvpNo: rsvp.no,
      rsvpYesHeads: rsvp.yesHeads,
    };
  });

  return (
    <main className="min-h-dvh">
      <header className="border-b border-border bg-gradient-to-b from-muted/40 to-background">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-10">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex size-12 rounded-2xl bg-primary/10 text-primary items-center justify-center shrink-0 mt-1">
                <DashboardIcon />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1.5">
                  Yönetim Paneli
                </div>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
                  Davetiyelerim
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                  Tüm davetiyelerini buradan yönet — yayınla, düzenle, misafir
                  ve RSVP&apos;leri takip et.
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground text-xs px-5 py-2.5 font-chakra uppercase tracking-[0.15em] hover:opacity-90 transition-opacity shadow-sm"
            >
              + Yeni Davetiye
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        <DashboardList
          designs={items}
          locale={locale}
          publicBase={publicBase}
        />
      </div>
    </main>
  );
}

interface DocSummary {
  coupleName: string | null;
  templateLabel: string | null;
  weddingIso: string | null;
  venueName: string | null;
  bgColor: string | null;
  accentColor: string | null;
  pageBgColor: string | null;
}

const HERO_VARIANT_LABELS: Record<string, string> = {
  arch: "Arch Klasik",
  classic: "Klasik",
  "photo-top": "Foto Üst",
  "photo-full": "Foto Tam Ekran",
  "floral-crown": "Çiçekli Taç",
  "monogram-circle": "Monogram",
  "bold-type": "Bold Tipografi",
  "botanical-frame": "Botanik Çerçeve",
};

function summariseDoc(doc: unknown): DocSummary {
  const empty: DocSummary = {
    coupleName: null,
    templateLabel: null,
    weddingIso: null,
    venueName: null,
    bgColor: null,
    accentColor: null,
    pageBgColor: null,
  };
  if (!doc || typeof doc !== "object") return empty;

  const d = doc as {
    blocks?: Array<{ type?: string; data?: Record<string, unknown> }>;
    meta?: { weddingDate?: string; weddingTime?: string };
    theme?: { bgColor?: string; accentColor?: string; pageBgColor?: string };
  };

  const hero = d.blocks?.find((b) => b.type === "hero");
  const bride = hero?.data?.brideName as string | undefined;
  const groom = hero?.data?.groomName as string | undefined;
  const variant = hero?.data?.variant as string | undefined;
  const coupleName =
    bride && groom ? `${bride} & ${groom}` : bride ?? groom ?? null;
  const templateLabel = variant ? HERO_VARIANT_LABELS[variant] ?? null : null;

  const date = d.meta?.weddingDate;
  const time = d.meta?.weddingTime ?? "00:00";
  const weddingIso = date ? `${date}T${time}:00` : null;

  const venue = d.blocks?.find((b) => b.type === "venue");
  const venueName = (venue?.data?.venueName as string | undefined) ?? null;

  return {
    coupleName,
    templateLabel,
    weddingIso,
    venueName,
    bgColor: d.theme?.bgColor ?? null,
    accentColor: d.theme?.accentColor ?? null,
    pageBgColor: d.theme?.pageBgColor ?? null,
  };
}
