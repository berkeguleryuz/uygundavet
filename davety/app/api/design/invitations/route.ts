import { NextResponse } from "next/server";
import { z } from "zod";
import { buildDefaultDoc } from "@davety/schema";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { generateShortSlug } from "@/src/lib/slug";
import {
  DESIGN_SAMPLES,
  LEGACY_DESIGN_SAMPLES,
} from "@/app/components/designSamples";
import { buildDesignDoc } from "@/app/components/buildDesignDoc";

const createSchema = z.object({
  weddingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  weddingTime: z.string().regex(/^\d{2}:\d{2}$/),
  brideName: z.string().optional(),
  groomName: z.string().optional(),
  locale: z.enum(["tr", "en", "de"]).optional(),
  templateId: z.string().optional(),
  /** Frontend design sample id (d-1, d-2, …) from the homepage grid. */
  designId: z.string().optional(),
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

// DB'nin şişmemesi için kullanıcı başına davetiye taban kapasitesi.
// Premium satın alma geçmişi olan hesaplar daha yüksek tavanı görür,
// yani "para getiren" kullanıcılara daha fazla alan veriyoruz, geri
// kalanlar 2 ile sınırlı.
const FREE_USER_INVITATION_CAP = 2;
const PREMIUM_USER_INVITATION_CAP = 5;

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Mevcut davetiye sayısı + premium-tier yayın geçmişi kontrolü.
  // Tier bilgisi doc.meta.tier altında JSON olarak duruyor; raw SQL
  // yerine prisma.findMany ile tüm kayıtları çekip hesaplıyoruz çünkü
  // kullanıcı başına davetiye sayısı küçük (max ~5) ve sorguyu her
  // create'de bir kez yapıyoruz.
  const myDesigns = await prisma.invitationDesign.findMany({
    where: { userId: session.user.id },
    select: { id: true, doc: true },
  });
  const hasPremiumHistory = myDesigns.some((d) => {
    const tier = (d.doc as { meta?: { tier?: string } }).meta?.tier;
    return tier === "premium";
  });
  const cap = hasPremiumHistory
    ? PREMIUM_USER_INVITATION_CAP
    : FREE_USER_INVITATION_CAP;
  if (myDesigns.length >= cap) {
    return NextResponse.json(
      {
        error: "InvitationCapReached",
        cap,
        currentCount: myDesigns.length,
        message: hasPremiumHistory
          ? `Aynı anda en fazla ${cap} davetiye tutabilirsin. Yenisini oluşturmadan önce eskilerden birini sil.`
          : `Free hesapla aynı anda en fazla ${cap} davetiye oluşturabilirsin. Premium pakete geçtiğinde bu sınır ${PREMIUM_USER_INVITATION_CAP}'e çıkıyor. Yeni bir tane oluşturmak için eski davetiyelerden birini sil.`,
      },
      { status: 409 }
    );
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

  // 1) Frontend design sample (homepage grid), uses the layout variant
  //    baked into hero + theme from DesignSample. Takes precedence over
  //    theme/template since it's a complete template.
  // Önce yeni V2 listesinden ara, bulunamazsa eski koleksiyona düş,
  // böylece geçişten önce eski bir designId kaydetmiş kullanıcılar
  // hâlâ kendi tasarımlarını yükleyebilir.
  const designSample = parsed.data.designId
    ? DESIGN_SAMPLES.find((d) => d.id === parsed.data.designId) ??
      LEGACY_DESIGN_SAMPLES.find((d) => d.id === parsed.data.designId)
    : null;

  if (designSample) {
    doc = buildDesignDoc(designSample, {
      weddingDate: parsed.data.weddingDate,
      weddingTime: parsed.data.weddingTime,
      locale: parsed.data.locale ?? "tr",
    });
    // Override placeholder couple names if the caller supplied real ones.
    if (parsed.data.brideName || parsed.data.groomName) {
      doc.blocks = doc.blocks.map((b) => {
        if (b.type !== "hero") return b;
        const hero = b.data as { brideName?: string; groomName?: string };
        return {
          ...b,
          data: {
            ...b.data,
            brideName: parsed.data.brideName ?? hero.brideName,
            groomName: parsed.data.groomName ?? hero.groomName,
          },
        };
      });
    }
  } else if (parsed.data.templateId) {
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
