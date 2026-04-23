import { prisma } from "@/src/lib/prisma";
import { Link } from "@/i18n/navigation";
import { AdminTemplateList } from "@/src/components/admin/AdminTemplateList";

export default async function AdminTemplatesPage() {
  const templates = await prisma.designTemplate.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <header className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl">Templateler</h1>
        <Link
          href="/admin/templates/new"
          className="text-xs rounded-full bg-primary text-primary-foreground px-4 py-2 font-chakra uppercase tracking-[0.15em]"
        >
          Yeni Template
        </Link>
      </header>

      <AdminTemplateList
        templates={templates.map((t) => ({
          id: t.id,
          slug: t.slug,
          title: t.title,
          description: t.description,
          category: t.category,
          published: t.published,
          updatedAt: t.updatedAt.toISOString(),
        }))}
      />
    </main>
  );
}
