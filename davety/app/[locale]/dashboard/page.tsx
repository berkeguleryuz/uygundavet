import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { Link } from "@/i18n/navigation";
import { DashboardList } from "@/app/components/DashboardList";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getSession();
  if (!session?.user) {
    redirect("/login?returnTo=/dashboard");
  }

  const designs = await prisma.invitationDesign.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  const publicBase =
    process.env.NEXT_PUBLIC_DAVETIYE_URL ?? "http://localhost:3000";

  return (
    <main className="min-h-dvh max-w-3xl mx-auto px-6 py-12">
      <header className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Davetiyelerim</h1>
        <Link
          href="/"
          className="rounded-full bg-primary text-primary-foreground text-xs px-4 py-2 font-chakra uppercase tracking-[0.15em]"
        >
          Yeni Davetiye
        </Link>
      </header>

      <DashboardList
        designs={designs.map((d) => ({
          id: d.id,
          slug: d.slug,
          vanityPath: d.vanityPath,
          status: d.status,
          updatedAt: d.updatedAt.toISOString(),
        }))}
        locale={locale}
        publicBase={publicBase}
      />
    </main>
  );
}
