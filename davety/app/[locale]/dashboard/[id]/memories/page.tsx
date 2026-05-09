import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { MemoryModeration } from "@/src/components/MemoryModeration";

type Params = Promise<{ locale: string; id: string }>;

export default async function MemoriesPage({ params }: { params: Params }) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  // Üç bağımsız kaynak (session, design ownership, memories) paralel
  // başlatılır. Memory query designId'yi sadece params'tan alıyor (hemen
  // bilinir), ownership/auth sonradan kontrol edilir; gereksiz veri
  // işlemiş olsak da seri await'ten 2x hızlıdır.
  const [session, design, memories] = await Promise.all([
    getSession(),
    prisma.invitationDesign.findUnique({
      where: { id },
      select: { userId: true },
    }),
    prisma.memoryEntry.findMany({
      where: { designId: id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!session?.user) {
    redirect(
      `/login?returnTo=${encodeURIComponent(`/dashboard/${id}/memories`)}`,
    );
  }
  if (!design || design.userId !== session.user.id) notFound();

  return (
    <main className="min-h-dvh max-w-3xl mx-auto px-6 py-12">
      <header className="mb-6">
        <h1 className="font-display text-3xl">Hatıra Defteri</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Misafirlerinden gelen mesajlar. Yayına almak için onayla.
        </p>
      </header>

      <MemoryModeration designId={id} initial={memories.map((m) => ({
        id: m.id,
        authorName: m.authorName,
        message: m.message,
        approved: m.approved,
        createdAt: m.createdAt.toISOString(),
      }))} />
    </main>
  );
}
