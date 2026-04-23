import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { Link } from "@/i18n/navigation";

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

      {designs.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Henüz bir davetiye oluşturmadın. Yeni Davetiye butonuna tıkla.
        </p>
      ) : (
        <ul className="divide-y divide-border border border-border rounded-lg overflow-hidden bg-card">
          {designs.map((d) => (
            <li key={d.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{d.vanityPath ?? d.slug}</div>
                <div className="text-xs text-muted-foreground">
                  {d.status === "published" ? "Yayında" : "Taslak"} ·{" "}
                  {new Date(d.updatedAt).toLocaleDateString(locale)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/${d.id}/guests` as never}
                  className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted"
                >
                  Misafirler
                </Link>
                <Link
                  href={`/dashboard/${d.id}/memories` as never}
                  className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted"
                >
                  Hatıralar
                </Link>
                {d.status === "published" && (
                  <a
                    href={`${process.env.NEXT_PUBLIC_DAVETIYE_URL ?? "http://localhost:3000"}/i/${d.vanityPath ?? d.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted"
                  >
                    Görüntüle
                  </a>
                )}
                <Link
                  href={`/design/invitations/${d.id}/editor` as never}
                  className="text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground font-chakra uppercase tracking-[0.15em]"
                >
                  Düzenle
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
