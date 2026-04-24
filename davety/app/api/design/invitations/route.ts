import { NextResponse } from "next/server";
import { z } from "zod";
import { buildDefaultDoc } from "@davety/schema";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { generateShortSlug } from "@/src/lib/slug";

const createSchema = z.object({
  weddingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  weddingTime: z.string().regex(/^\d{2}:\d{2}$/),
  brideName: z.string().optional(),
  groomName: z.string().optional(),
  locale: z.enum(["tr", "en", "de"]).optional(),
  templateId: z.string().optional(),
  // Optional theme override for blank-from-sample flows (homepage design grid).
  theme: z
    .object({
      bgColor: z.string().optional(),
      accentColor: z.string().optional(),
      envelope: z
        .object({
          color: z.string().optional(),
          liningPattern: z.string().optional(),
          flapColor: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const designs = await prisma.invitationDesign.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      vanityPath: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      publishedAt: true,
    },
  });
  return NextResponse.json({ designs });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  let doc: ReturnType<typeof buildDefaultDoc>;

  if (parsed.data.templateId) {
    const template = await prisma.designTemplate.findUnique({
      where: { id: parsed.data.templateId },
      select: { doc: true, published: true },
    });
    if (!template || !template.published) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }
    // Merge template doc with user's date/time + names
    const baseDoc = template.doc as unknown as ReturnType<typeof buildDefaultDoc>;
    doc = {
      ...baseDoc,
      meta: {
        ...baseDoc.meta,
        weddingDate: parsed.data.weddingDate,
        weddingTime: parsed.data.weddingTime,
        status: "draft",
        locale: parsed.data.locale ?? baseDoc.meta.locale ?? "tr",
      },
    };
    // Patch hero block names + countdown target if present
    doc.blocks = doc.blocks.map((b) => {
      if (b.type === "hero" && parsed.data.brideName) {
        return {
          ...b,
          data: {
            ...(b.data as Record<string, unknown>),
            brideName: parsed.data.brideName,
            groomName: parsed.data.groomName ?? (b.data as { groomName?: string }).groomName,
          },
        };
      }
      if (b.type === "countdown") {
        return {
          ...b,
          data: {
            ...(b.data as Record<string, unknown>),
            targetIso: `${parsed.data.weddingDate}T${parsed.data.weddingTime}:00`,
          },
        };
      }
      return b;
    });
  } else {
    doc = buildDefaultDoc({
      weddingDate: parsed.data.weddingDate,
      weddingTime: parsed.data.weddingTime,
      brideName: parsed.data.brideName,
      groomName: parsed.data.groomName,
      locale: parsed.data.locale ?? "tr",
    });
    if (parsed.data.theme) {
      doc = {
        ...doc,
        theme: {
          ...doc.theme,
          bgColor: parsed.data.theme.bgColor ?? doc.theme.bgColor,
          accentColor: parsed.data.theme.accentColor ?? doc.theme.accentColor,
          envelope: {
            ...doc.theme.envelope,
            color: parsed.data.theme.envelope?.color ?? doc.theme.envelope.color,
            liningPattern:
              parsed.data.theme.envelope?.liningPattern ??
              doc.theme.envelope.liningPattern,
            flapColor:
              parsed.data.theme.envelope?.flapColor ??
              doc.theme.envelope.flapColor,
          },
        },
      };
    }
  }

  // generate unique slug (retry on collision)
  let slug = generateShortSlug();
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.invitationDesign.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!exists) break;
    slug = generateShortSlug();
  }

  const design = await prisma.invitationDesign.create({
    data: {
      userId: session.user.id,
      slug,
      doc,
      status: "draft",
    },
    select: { id: true, slug: true, status: true, createdAt: true },
  });

  return NextResponse.json(design, { status: 201 });
}
