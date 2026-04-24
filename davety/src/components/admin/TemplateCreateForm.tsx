"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

export function TemplateCreateForm() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("wedding");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/admin/templates", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug, title, description, category }),
    });
    setBusy(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Oluşturulamadı");
      return;
    }
    const body = await res.json();
    toast.success("Template oluşturuldu");
    router.push(`/admin/templates/${body.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-xs text-muted-foreground">Slug</label>
        <input
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase())}
          placeholder="classic-daisy"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Başlık</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Açıklama</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Kategori</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-xs font-chakra uppercase tracking-[0.2em] cursor-pointer disabled:opacity-50"
      >
        {busy ? "..." : "Oluştur"}
      </button>
    </form>
  );
}
