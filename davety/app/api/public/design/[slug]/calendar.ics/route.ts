import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { buildIcs } from "@/src/lib/calendar-link";

type Params = Promise<{ slug: string }>;

interface DocLike {
  meta?: { weddingDate?: string; weddingTime?: string };
  blocks?: Array<{
    type: string;
    data?: { brideName?: string; groomName?: string };
  }>;
}

export async function GET(req: Request, ctx: { params: Params }) {
  const { slug } = await ctx.params;
  const day = new URL(req.url).searchParams.get("day");

  const design = await prisma.invitationDesign.findFirst({
    where: { OR: [{ slug }, { vanityPath: slug }], status: "published" },
    select: { publishedDoc: true, slug: true },
  });
  if (!design || !design.publishedDoc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const doc = design.publishedDoc as DocLike;
  const meta = doc.meta ?? {};
  const blocks = doc.blocks ?? [];

  // Default to the wedding day from doc.meta. When a `day` query param
  // is set we look it up in the event_program eventDays array (the
  // multi-event chain feature). This lets one invitation expose
  // separate .ics files for engagement, henna, ceremony.
  let title = "Düğün";
  let location: string | undefined;
  let startLocalIso = `${meta.weddingDate ?? "2026-01-01"}T${meta.weddingTime ?? "19:00"}:00`;

  const hero = blocks.find((b) => b.type === "hero");
  const heroData = hero?.data as { brideName?: string; groomName?: string } | undefined;
  if (heroData?.brideName && heroData?.groomName) {
    title = `${heroData.brideName} & ${heroData.groomName}`;
  }

  const program = blocks.find((b) => b.type === "event_program");
  const programData = program?.data as
    | {
        venueName?: string;
        venueAddress?: string;
        eventDays?: Array<{
          id: string;
          label: string;
          date: string;
          time?: string;
          venueName?: string;
          venueAddress?: string;
        }>;
      }
    | undefined;

  if (day && programData?.eventDays) {
    const match = programData.eventDays.find((d) => d.id === day);
    if (match) {
      title = `${title} · ${match.label}`;
      startLocalIso = `${match.date}T${match.time ?? "19:00"}:00`;
      location = [match.venueName, match.venueAddress].filter(Boolean).join(", ");
    }
  } else if (programData) {
    location = [programData.venueName, programData.venueAddress]
      .filter(Boolean)
      .join(", ");
  }

  const ics = buildIcs({
    title,
    startLocalIso,
    location,
    url: `https://davetyolla.com/davetiyem/${design.slug}`,
  });

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="davetiye-${design.slug}.ics"`,
      "Cache-Control": "public, s-maxage=300",
    },
  });
}
