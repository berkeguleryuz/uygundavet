import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { InvitationDoc } from "@davety/schema";
import { prisma } from "@/src/lib/prisma";
import { getSession } from "@/src/lib/session";
import { PublicInvitation } from "@/src/components/PublicInvitation";

type Params = Promise<{ locale: string; slug: string }>;

// Always render with the freshest doc — without this Next.js caches
// the prisma read across requests, so a "Save" in the editor doesn't
// show up in the public preview until the cache invalidates on its
// own (or on a hard reload).
export const dynamic = "force-dynamic";

export default async function PublicInvitationPage({
  params,
}: {
  params: Params;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const design = await prisma.invitationDesign.findFirst({
    where: { OR: [{ slug }, { vanityPath: slug }] },
    select: {
      id: true,
      slug: true,
      userId: true,
      status: true,
      doc: true,
      publishedDoc: true,
      publishedAt: true,
    },
  });

  if (!design) notFound();

  const session = await getSession();
  const isOwner = session?.user?.id === design.userId;

  // Owner sees their working draft (`doc`) so a Save in the editor is
  // immediately reflected here. Non-owners only ever see the last
  // published snapshot (`publishedDoc`) so unpublished WIP doesn't
  // leak. Without this owners would see the stale published version
  // even after saving updates.
  const doc = (
    isOwner
      ? design.doc ?? design.publishedDoc
      : design.publishedDoc ?? design.doc
  ) as InvitationDoc | null;
  if (!doc) notFound();

  const isDraft = design.status !== "published" || !design.publishedDoc;

  // Non-owner cannot preview draft
  if (isDraft && !isOwner) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-[#f5f6f3] px-6">
        <div className="max-w-md text-center">
          <h1
            className="text-3xl mb-3"
            style={{ fontFamily: "Merienda, serif" }}
          >
            Henüz yayınlanmamış
          </h1>
          <p className="text-sm text-muted-foreground">
            Bu davetiye henüz sahibi tarafından yayınlanmamış.
          </p>
        </div>
      </main>
    );
  }

  return (
    <PublicInvitation
      doc={doc}
      slug={design.slug}
      isOwner={isOwner}
      isDraft={isDraft}
      designId={design.id}
    />
  );
}
