import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { SaveScreen } from "@/src/components/SaveScreen";

type Params = Promise<{ locale: string; id: string }>;

export default async function SavePage({ params }: { params: Params }) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await getSession();
  if (!session?.user) {
    redirect(`/login?returnTo=${encodeURIComponent(`/design/invitations/${id}/save`)}`);
  }

  const design = await prisma.invitationDesign.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      vanityPath: true,
      status: true,
      userId: true,
    },
  });
  if (!design || design.userId !== session.user.id) {
    notFound();
  }

  return (
    <SaveScreen
      designId={design.id}
      slug={design.slug}
      vanityPath={design.vanityPath}
      status={design.status as "draft" | "published"}
    />
  );
}
