import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import type { InvitationDoc } from "@davety/schema";
import { prisma } from "@/src/lib/prisma";
import { getSession } from "@/src/lib/session";
import {
  PublicInvitation,
  type GuestContext,
} from "@/src/components/PublicInvitation";
import { PasswordGate } from "@/src/components/PasswordGate";
import { isValidGuestToken } from "@/src/lib/guest-token";

type Params = Promise<{ locale: string; slug: string; token: string }>;

export const dynamic = "force-dynamic";

/**
 * Personalised public invitation route.
 *
 *   /[locale]/davetiyem/[slug]/[token]
 *
 * Looks up the guest by `(designId, token)`. When the token is invalid
 * or doesn't belong to the design we drop the token and fall back to
 * the base invitation (or to home if even the slug doesn't exist).
 * Leaked tokens can still be revoked by deleting the Guest row, the
 * fallback to /davetiyem/[slug] just gives a friendlier UX than 404.
 */
export default async function PersonalisedInvitationPage({
  params,
}: {
  params: Params;
}) {
  const { locale, slug, token } = await params;
  setRequestLocale(locale);

  if (!isValidGuestToken(token)) redirect(`/davetiyem/${slug}`);

  // Session bağımsız — design fetch ile paralel başlat. Guest fetch
  // designId'ye bağlı olduğu için await sonrası çalışır.
  const sessionPromise = getSession();

  const design = await prisma.invitationDesign.findFirst({
    where: { OR: [{ slug }, { vanityPath: slug }] },
    select: {
      id: true,
      slug: true,
      userId: true,
      status: true,
      doc: true,
      publishedDoc: true,
      passwordHash: true,
      archivedAt: true,
    },
  });
  if (!design) redirect("/");

  // archivedAt ve passwordHash gate'leri page seviyesinde uygulanır.

  const guest = await prisma.guest.findFirst({
    where: { designId: design.id, token },
    select: {
      name: true,
      plusOneMax: true,
      groupLabel: true,
      eventDays: true,
    },
  });
  if (!guest) redirect(`/davetiyem/${design.slug}`);

  if (design.archivedAt) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-[#f5f6f3] px-6">
        <div className="max-w-md text-center">
          <h1
            className="text-3xl mb-3"
            style={{ fontFamily: "Merienda, serif" }}
          >
            Bu davetiye arşivlenmiş
          </h1>
          <p className="text-sm text-muted-foreground">
            Bu davetiye süresi dolduğu için arşive alınmış. Etkinlik sahibi
            yeniden yayına alabilir.
          </p>
        </div>
      </main>
    );
  }

  const session = await sessionPromise;
  const isOwner = session?.user?.id === design.userId;

  if (design.passwordHash && !isOwner) {
    const cookieStore = await cookies();
    const ok = cookieStore.get(`dyl_unlock_${design.id}`)?.value === "1";
    if (!ok) {
      return <PasswordGate slug={design.slug} />;
    }
  }

  const doc = (
    isOwner
      ? design.doc ?? design.publishedDoc
      : design.publishedDoc ?? design.doc
  ) as InvitationDoc | null;
  if (!doc) redirect("/");

  const isDraft = design.status !== "published" || !design.publishedDoc;

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

  const guestCtx: GuestContext = {
    name: guest.name,
    plusOneMax: guest.plusOneMax ?? 1,
    groupLabel: guest.groupLabel,
    eventDays: guest.eventDays ?? [],
    token,
  };

  return (
    <PublicInvitation
      doc={doc}
      slug={design.slug}
      isOwner={isOwner}
      isDraft={isDraft}
      designId={design.id}
      guest={guestCtx}
    />
  );
}
