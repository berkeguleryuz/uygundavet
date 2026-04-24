import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { TemplatePicker } from "@/src/components/TemplatePicker";

export default async function TemplatePickerPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ date?: string; time?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);

  if (!sp.date || !sp.time) {
    redirect("/");
  }

  const session = await getSession();
  if (!session?.user) {
    redirect(
      `/login?returnTo=${encodeURIComponent(`/design/new?date=${sp.date}&time=${sp.time}`)}`
    );
  }

  const templates = await prisma.designTemplate.findMany({
    where: { published: true },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      category: true,
      previewUrl: true,
    },
  });

  return (
    <main className="min-h-dvh max-w-6xl mx-auto px-6 py-10">
      <header className="mb-8 text-center">
        <h1 className="font-display text-4xl mb-2">Şablonunu Seç</h1>
        <p className="text-sm text-muted-foreground">
          Sevdiğin bir şablonu seç, tüm alanları editörde istediğin gibi değiştirebilirsin.
          İstersen boş bir şablonla başla.
        </p>
      </header>

      <TemplatePicker
        date={sp.date!}
        time={sp.time!}
        templates={templates.map((t) => ({
          id: t.id,
          slug: t.slug,
          title: t.title,
          description: t.description,
          category: t.category,
          previewUrl: t.previewUrl,
        }))}
      />
    </main>
  );
}
