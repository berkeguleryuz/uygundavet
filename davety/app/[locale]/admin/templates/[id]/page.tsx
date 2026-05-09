import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { isAdminSession } from "@/src/lib/admin";
import { TemplateEditor } from "@/src/components/admin/TemplateEditor";

type Params = Promise<{ id: string }>;

export default async function AdminTemplateDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  // Defense-in-depth admin gate + paralel template fetch.
  const [session, template] = await Promise.all([
    isAdminSession(),
    prisma.designTemplate.findUnique({ where: { id } }),
  ]);
  if (!session) notFound();
  if (!template) notFound();

  return (
    <main className="max-w-3xl mx-auto px-2 py-10">
      <h1 className="font-display text-3xl mb-2">{template.title}</h1>
      <p className="text-sm text-muted-foreground mb-6">/{template.slug}</p>
      <TemplateEditor
        id={template.id}
        initial={{
          title: template.title,
          description: template.description ?? "",
          category: template.category ?? "",
          published: template.published,
          doc: template.doc as Record<string, unknown>,
        }}
      />
    </main>
  );
}
