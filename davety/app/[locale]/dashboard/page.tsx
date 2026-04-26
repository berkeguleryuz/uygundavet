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
        designs={designs.map((d) => {
          const summary = summariseDoc(d.doc);
          return {
            id: d.id,
            slug: d.slug,
            vanityPath: d.vanityPath,
            status: d.status,
            updatedAt: d.updatedAt.toISOString(),
            coupleName: summary.coupleName,
            templateLabel: summary.templateLabel,
          };
        })}
        locale={locale}
        publicBase={publicBase}
      />
    </main>
  );
}

interface DocSummary {
  coupleName: string | null;
  templateLabel: string | null;
}

const HERO_VARIANT_LABELS: Record<string, string> = {
  arch: "Arch Klasik",
  classic: "Klasik",
  "photo-top": "Foto Üst",
  "photo-full": "Foto Tam Ekran",
  "floral-crown": "Çiçekli Taç",
  "monogram-circle": "Monogram",
  "bold-type": "Bold Tipografi",
  "botanical-frame": "Botanik Çerçeve",
};

function summariseDoc(doc: unknown): DocSummary {
  if (!doc || typeof doc !== "object") {
    return { coupleName: null, templateLabel: null };
  }
  const d = doc as {
    blocks?: Array<{ type?: string; data?: Record<string, unknown> }>;
  };
  const hero = d.blocks?.find((b) => b.type === "hero");
  const bride = hero?.data?.brideName as string | undefined;
  const groom = hero?.data?.groomName as string | undefined;
  const variant = hero?.data?.variant as string | undefined;
  const coupleName =
    bride && groom ? `${bride} & ${groom}` : bride ?? groom ?? null;
  const templateLabel = variant ? HERO_VARIANT_LABELS[variant] ?? null : null;
  return { coupleName, templateLabel };
}
