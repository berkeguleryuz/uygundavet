import { NextResponse, after } from "next/server";
import { z } from "zod";
import { sanitizeInvitationDoc } from "@davety/schema";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { deleteR2Prefix } from "@/src/lib/r2";

const patchSchema = z.object({
  doc: z.unknown(),
  clientUpdatedAt: z.string().optional(),
});

type Params = Promise<{ id: string }>;

export async function GET(_: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  // Session ve design fetch paralel + select narrow. publishedDoc
  // editor read-path'ında gereksiz, doc ile updatedAt yeter.
  const [session, design] = await Promise.all([
    getSession(),
    prisma.invitationDesign.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        userId: true,
        status: true,
        doc: true,
        updatedAt: true,
        createdAt: true,
        publishedAt: true,
        lastAutosavedAt: true,
      },
    }),
  ]);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!design || design.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(design);
}

export async function PATCH(req: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  // Body parse, session ve ownership fetch bağımsız — paralel başlat.
  const bodyPromise = req.json().catch(() => null);
  const [session, existing] = await Promise.all([
    getSession(),
    prisma.invitationDesign.findUnique({
      where: { id },
      select: { userId: true, updatedAt: true },
    }),
  ]);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await bodyPromise;
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // NB: multi-tab collision detection (clientUpdatedAt mismatch → 409) is deferred.
  // Single-user flow was hitting false positives because React strict-mode double
  // hydration reset the ack cursor. Treat autosaves as last-write-wins for now.
  const updated = await prisma.invitationDesign.update({
    where: { id },
    data: {
      doc: sanitizeInvitationDoc(parsed.data.doc) as object,
      lastAutosavedAt: new Date(),
    },
    select: { updatedAt: true },
  });

  // Edit event log post-response. Eski implementasyon floating Promise
  // bırakıyordu, Next 15+'da serverless function bitince silinebilirdi.
  // after() Next runtime'a "response gönder, sonra bunu çalıştır"
  // diyor — log garantili yazılır, response anında döner.
  after(() =>
    prisma.editEvent
      .create({
        data: {
          designId: id,
          actorId: session.user.id,
          op: "doc.replace",
          payload: {},
        },
      })
      .catch(() => {}),
  );

  return NextResponse.json({
    ok: true,
    updatedAt: updated.updatedAt.toISOString(),
  });
}

export async function DELETE(_: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  // Session ve ownership fetch paralel.
  const [session, existing] = await Promise.all([
    getSession(),
    prisma.invitationDesign.findUnique({
      where: { id },
      select: { userId: true },
    }),
  ]);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 1) R2 temizliği. Davetiyeye ait tüm medyalar (orijinal + thumb/md/lg
  //    varyantları + DB'de iz bırakmamış olası orphan dosyalar)
  //    `users/{userId}/designs/{designId}/` prefix'i altında olduğu için
  //    tek prefix-delete çağrısıyla siliniyor.
  // 2) DB temizliği. Asset rows da silinmeli, schema'da relation
  //    onDelete: SetNull olduğu için davetiye silindiğinde row kalır
  //    (sadece designId null'a düşer). Davetiye bazlı sattığımız için
  //    davetiye gidince asset de gitmeli.
  // 3) Asıl davetiye silme. Diğer alt kayıtlar (Guest, MemoryEntry,
  //    EditEvent) zaten cascade ile temizleniyor.
  const r2Prefix = `users/${session.user.id}/designs/${id}/`;
  try {
    const res = await deleteR2Prefix(r2Prefix);
    if (!res.ok) {
      console.warn("[delete invitation] R2 cleanup partial:", {
        designId: id,
        deleted: res.deleted,
        errors: res.errors.slice(0, 5),
      });
    }
  } catch (err) {
    // R2 erişimi düşse bile davetiye silinmeli, kullanıcı işlemi
    // tamamlanır, R2 orphan'ları sonra cron ile süpürülebilir.
    console.error("[delete invitation] R2 cleanup failed:", err);
  }
  // asset.deleteMany ve invitationDesign.delete arasında FK bağımlılığı
  // schema'da onDelete: SetNull (asset.designId nullable) — yani
  // davetiye silinmeden önce asset'lerin silinmesi şart değil.
  // İkisini paralel çalıştırıyoruz. (async-parallel)
  await Promise.all([
    prisma.asset.deleteMany({ where: { designId: id } }),
    prisma.invitationDesign.delete({ where: { id } }),
  ]);
  return NextResponse.json({ ok: true });
}
