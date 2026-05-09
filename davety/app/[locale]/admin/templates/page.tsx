import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { isAdminSession } from "@/src/lib/admin";
import { Link } from "@/i18n/navigation";
import { AdminTemplateList } from "@/src/components/admin/AdminTemplateList";

export default async function AdminTemplatesPage() {
  // Defense-in-depth admin gate.
  const session = await isAdminSession();
  if (!session) notFound();

  // Admin template listesi sadece metadata gösteriyor; doc (200KB
  // JSON) wire'a düşmesin. Detay sayfasında doc gerektiğinde ayrı
  // findUnique zaten yapılıyor. (server-serialization)
  const templates = await prisma.designTemplate.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      category: true,
      previewUrl: true,
      published: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  return (
    <main className="max-w-5xl mx-auto px-2 py-10">
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
