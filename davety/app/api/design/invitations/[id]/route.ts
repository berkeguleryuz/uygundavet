import { NextResponse } from "next/server";
import { z } from "zod";
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
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const design = await prisma.invitationDesign.findUnique({ where: { id } });
  if (!design || design.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(design);
}

export async function PATCH(req: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const existing = await prisma.invitationDesign.findUnique({
    where: { id },
    select: { userId: true, updatedAt: true },
  });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // NB: multi-tab collision detection (clientUpdatedAt mismatch → 409) is deferred.
  // Single-user flow was hitting false positives because React strict-mode double
  // hydration reset the ack cursor. Treat autosaves as last-write-wins for now.
  const updated = await prisma.invitationDesign.update({
    where: { id },
    data: {
      doc: parsed.data.doc as object,
      lastAutosavedAt: new Date(),
    },
    select: { updatedAt: true },
  });

  // Fire-and-forget edit event log
  prisma.editEvent
    .create({
      data: {
        designId: id,
        actorId: session.user.id,
        op: "doc.replace",
        payload: {},
      },
    })
    .catch(() => {});

  return NextResponse.json({
    ok: true,
    updatedAt: updated.updatedAt.toISOString(),
  });
}

export async function DELETE(_: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const existing = await prisma.invitationDesign.findUnique({
    where: { id },
    select: { userId: true },
  });
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
  await prisma.asset.deleteMany({ where: { designId: id } });
  await prisma.invitationDesign.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
