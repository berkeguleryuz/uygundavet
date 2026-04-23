import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { MemoryModeration } from "@/src/components/MemoryModeration";

type Params = Promise<{ locale: string; id: string }>;

export default async function MemoriesPage({ params }: { params: Params }) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await getSession();
  if (!session?.user) {
    redirect(`/login?returnTo=${encodeURIComponent(`/dashboard/${id}/memories`)}`);
  }

  const design = await prisma.invitationDesign.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!design || design.userId !== session.user.id) notFound();

  const memories = await prisma.memoryEntry.findMany({
    where: { designId: id },
    orderBy: { createdAt: "desc" },
  });

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
