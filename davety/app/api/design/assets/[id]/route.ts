import { NextResponse } from "next/server";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { deleteR2Keys, deleteR2Prefix } from "@/src/lib/r2";

type Params = Promise<{ id: string }>;

export async function DELETE(_: Request, ctx: { params: Params }) {
  const { id } = await ctx.params;
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const asset = await prisma.asset.findUnique({
    where: { id },
    select: { id: true, userId: true, key: true, designId: true },
  });
  if (!asset || asset.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Original key looks like users/{uid}/designs/{did}/{nanoid}.webp
  // Variant keys live alongside as {basekey}-thumb.webp, -md.webp, -lg.webp.
  // We delete by computing the basekey (drop trailing extension) and
  // listing+deleting everything under that prefix to catch any orphans.
  const lastDot = asset.key.lastIndexOf(".");
  const baseKey = lastDot > 0 ? asset.key.slice(0, lastDot) : asset.key;
  const knownKeys = [
    asset.key,
    `${baseKey}-thumb.webp`,
    `${baseKey}-md.webp`,
    `${baseKey}-lg.webp`,
  ];

  try {
    await deleteR2Keys(knownKeys);
    await deleteR2Prefix(`${baseKey}-`).catch(() => {});
  } catch (err) {
    console.error("[delete asset] R2 cleanup failed:", err);
  }

  await prisma.asset.delete({ where: { id: asset.id } });
  return NextResponse.json({ ok: true });
}
