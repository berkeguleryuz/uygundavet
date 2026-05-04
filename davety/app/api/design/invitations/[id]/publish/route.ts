import { NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { validateVanityPath } from "@/src/lib/slug";
import {
  planLimitsFor,
  tierOrFree,
  CUSTOM_BLOCK_TYPES,
} from "@/src/lib/plan-limits";
import { computeExpiresAt } from "@/src/lib/archive";
import type { Block, PlanTier } from "@davety/schema";

const publishSchema = z.object({
  vanityPath: z.string().optional(),
  tier: z.enum(["free", "basic", "pro", "premium"]).optional(),
});

/**
 * Yayın anında doc'a tier kurallarını uygular ve `publishedDoc` olarak
 * persist eder. Önemli: editor'deki çalışma dokümanı (`doc`) bu trim'den
 * etkilenmez, böylece kullanıcı upgrade ederse fazla içerikleri geri
 * gelir. Sadece `publishedDoc` (misafirin gördüğü versiyon) trim'lenir.
 *
 * Server-side gate: bu fonksiyon UI bypass edilse bile (devtools,
 * direkt API call) paid feature'ların free yayında sızmasını engeller.
 *
 * Uygulanan mutations:
 *   1. Galeri item'ları tier max'ına kırpılır.
 *   2. İzin verilmeyen bloklar düşürülür: memory_book, rsvp_form,
 *      custom blocks (event_program/families/story_timeline/custom_section).
 *   3. Tema'da bgMusicUrl free tier'da temizlenir.
 *   4. Free tier'da DavetYolla tanıtım bloğu 4. pozisyona enjekte edilir
 *      (idempotent, eski branding block'u önce temizlenir).
 *
 * Tanıtım bloğu recognisable id prefix'iyle locked custom_note olarak
 * eklenir, sonraki publish'lerde tekrar bulunup yeniden ekleniyor.
 */
const BRANDING_BLOCK_ID_PREFIX = "davetyolla-brand-";

function applyTierToPublishedDoc(doc: object, tier: PlanTier): object {
  const limits = planLimitsFor(tier);
  const docTyped = doc as {
    blocks?: Block[];
    meta?: Record<string, unknown>;
    theme?: Record<string, unknown>;
  };
  let blocks = (docTyped.blocks ?? []).slice();

  // 1. Galeri trim (tier max kadar item)
  blocks = blocks.map((b) => {
    if (b.type !== "gallery") return b;
    const items = ((b.data as { items?: unknown[] }).items ?? []).slice(
      0,
      limits.galleryMaxItems
    );
    return { ...b, data: { ...b.data, items } };
  });

  // 2a. Memory book bloğu
  if (!limits.memoryBookEnabled) {
    blocks = blocks.filter((b) => b.type !== "memory_book");
  }

  // 2b. RSVP form bloğu
  if (!limits.rsvpFormEnabled) {
    blocks = blocks.filter((b) => b.type !== "rsvp_form");
  }

  // 2c. Özel bloklar (program, aileler, hikaye, özel bölüm)
  if (!limits.customBlocksEnabled) {
    blocks = blocks.filter((b) => !CUSTOM_BLOCK_TYPES.has(b.type));
  }

  // 3. Eski branding bloğunu temizle, sonra free için yeniden ekle
  blocks = blocks.filter(
    (b) => !b.id.startsWith(BRANDING_BLOCK_ID_PREFIX)
  );
  if (limits.showsBranding) {
    const branding: Block = {
      id: `${BRANDING_BLOCK_ID_PREFIX}${nanoid(6)}`,
      type: "custom_note",
      visible: true,
      locked: true,
      data: {
        title: "DavetYolla.com",
        body: "Bu davetiye DavetYolla.com ile ücretsiz hazırlandı. Sen de kendi davetiyeni dakikalar içinde oluştur.",
      },
      style: { align: "center" },
    };
    const insertAt = Math.min(3, blocks.length);
    blocks = [
      ...blocks.slice(0, insertAt),
      branding,
      ...blocks.slice(insertAt),
    ];
  }

  // 4. Theme'deki bgMusicUrl, müzik mode'a göre temizle.
  //    Free = off → URL silinir, hiç müzik çalmaz.
  //    Basic = preset-only → şimdilik full ile aynı, library check
  //    catalog endpoint'i hazırlandığında eklenecek (TODO).
  //    Pro+ = full → dokunulmaz.
  let theme = docTyped.theme;
  if (limits.backgroundMusicMode === "off" && theme && "bgMusicUrl" in theme) {
    theme = { ...theme, bgMusicUrl: undefined };
  }

  return {
    ...docTyped,
    blocks,
    ...(theme ? { theme } : {}),
  };
}

type Params = Promise<{ id: string }>;

export async function POST(req: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = publishSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const existing = await prisma.invitationDesign.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const tier = parsed.data.tier;
  const existingMeta =
    (existing.doc as { meta?: { tier?: string } }).meta ?? {};
  const effectiveTier = tierOrFree(
    (tier ?? (existingMeta.tier as PlanTier | undefined)) ?? null
  );
  const limits = planLimitsFor(effectiveTier);

  // Vanity path: tier izin vermiyorsa istek olsa bile yazma. Yine
  // mevcut vanity'yi de temizle (Free'ye düşmüş olabilir, mantıken
  // olmaz çünkü downgrade yok ama defensive).
  const vanity = parsed.data.vanityPath;
  if (vanity && !limits.vanityPathEnabled) {
    return NextResponse.json(
      {
        error: "VanityPathLocked",
        message: "Özel kısa link Klasik+ paketinde açılır.",
      },
      { status: 402 }
    );
  }
  if (vanity) {
    const check = validateVanityPath(vanity);
    if (!check.ok) {
      return NextResponse.json(
        { error: "Invalid vanity", reason: check.reason },
        { status: 400 }
      );
    }
    const conflict = await prisma.invitationDesign.findFirst({
      where: { vanityPath: vanity, NOT: { id } },
      select: { id: true },
    });
    if (conflict) {
      return NextResponse.json(
        { error: "Vanity taken" },
        { status: 409 }
      );
    }
  }

  // Tier kuralları SADECE publishedDoc'a uygulanır. Editor'deki çalışma
  // dokümanı (`doc`) full kalır, kullanıcı upgrade ederse fazla
  // içerikler (memory_book, ekstra galeriler, vb.) yine yerinde olur.
  const publishedDocRaw = applyTierToPublishedDoc(
    existing.doc as object,
    effectiveTier
  );
  const publishedDoc = {
    ...publishedDocRaw,
    meta: {
      ...existingMeta,
      ...(publishedDocRaw as { meta?: object }).meta,
      status: "published",
      updatedAt: new Date().toISOString(),
      tier: effectiveTier,
    },
  };

  // doc'a sadece tier'ı stamp et, içerik değişmesin.
  const docWithTier = {
    ...(existing.doc as object),
    meta: { ...existingMeta, tier: effectiveTier },
  };

  const publishedAt = new Date();
  const expiresAt = computeExpiresAt(effectiveTier, publishedAt);

  // Yeni alanlar (expiresAt, archivedAt) auto-archive feature'ı için
  // eklendi. Migration veya prisma generate henüz çalıştırılmadıysa
  // Prisma "Unknown arg" hatası fırlatır. O senaryoda eski path'e
  // düşüp kullanıcı yayınlamaya devam edebilsin.
  let updated: {
    slug: string;
    vanityPath: string | null;
    publishedAt: Date | null;
    expiresAt: Date | null;
  };
  try {
    updated = await prisma.invitationDesign.update({
      where: { id },
      data: {
        status: "published",
        publishedDoc,
        publishedAt,
        expiresAt,
        archivedAt: null,
        ...(vanity ? { vanityPath: vanity } : {}),
        doc: docWithTier,
      },
      select: {
        slug: true,
        vanityPath: true,
        publishedAt: true,
        expiresAt: true,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (
      /Unknown arg|Unknown field|column .* does not exist/i.test(msg) ||
      /expiresAt|archivedAt/.test(msg)
    ) {
      console.warn(
        "[publish] new columns not migrated yet, falling back without expiresAt/archivedAt"
      );
      const fallback = await prisma.invitationDesign.update({
        where: { id },
        data: {
          status: "published",
          publishedDoc,
          publishedAt,
          ...(vanity ? { vanityPath: vanity } : {}),
          doc: docWithTier,
        },
        select: { slug: true, vanityPath: true, publishedAt: true },
      });
      updated = { ...fallback, expiresAt: null };
    } else {
      throw err;
    }
  }

  const shareUrl = updated.vanityPath
    ? `/i/${updated.vanityPath}`
    : `/i/${updated.slug}`;

  return NextResponse.json({
    ok: true,
    slug: updated.slug,
    vanityPath: updated.vanityPath,
    url: shareUrl,
    expiresAt: updated.expiresAt,
  });
}
