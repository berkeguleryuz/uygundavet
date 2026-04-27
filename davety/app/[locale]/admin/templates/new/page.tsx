import { TemplateCreateForm } from "@/src/components/admin/TemplateCreateForm";

export default function AdminTemplateNewPage() {
  return (
    <main className="max-w-xl mx-auto px-2 py-10">
      <h1 className="font-display text-3xl mb-6">Yeni Template</h1>
      <TemplateCreateForm />
    </main>
  );
}
