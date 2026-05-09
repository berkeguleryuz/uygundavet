import { notFound } from "next/navigation";
import { isAdminSession } from "@/src/lib/admin";
import { TemplateCreateForm } from "@/src/components/admin/TemplateCreateForm";

export default async function AdminTemplateNewPage() {
  // Defense-in-depth admin gate (RSC partial render senaryoları).
  const session = await isAdminSession();
  if (!session) notFound();

  return (
    <main className="max-w-xl mx-auto px-2 py-10">
      <h1 className="font-display text-3xl mb-6">Yeni Template</h1>
      <TemplateCreateForm />
    </main>
  );
}
