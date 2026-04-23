import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { InvitationDoc } from "@davety/schema";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { DesignerShell } from "@/src/components/DesignerShell";

type Params = Promise<{ locale: string; id: string }>;

export default async function EditorPage({ params }: { params: Params }) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await getSession();
  if (!session?.user) {
    redirect(`/login?returnTo=${encodeURIComponent(`/design/invitations/${id}/editor`)}`);
  }

  const design = await prisma.invitationDesign.findUnique({ where: { id } });
  if (!design || design.userId !== session.user.id) {
    notFound();
  }

  return (
    <DesignerShell
      docId={design.id}
      initialDoc={design.doc as unknown as InvitationDoc}
      initialUpdatedAt={design.updatedAt.toISOString()}
    />
  );
}
