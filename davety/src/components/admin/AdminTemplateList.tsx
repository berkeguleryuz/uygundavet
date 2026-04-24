"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface TemplateRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  published: boolean;
  updatedAt: string;
}

export function AdminTemplateList({
  templates: initial,
}: {
  templates: TemplateRow[];
}) {
  const [rows, setRows] = useState(initial);

  async function togglePublish(id: string, published: boolean) {
    const res = await fetch(`/api/admin/templates/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ published }),
    });
    if (!res.ok) {
      toast.error("Güncellenemedi");
      return;
    }
    setRows((xs) => xs.map((x) => (x.id === id ? { ...x, published } : x)));
  }

  async function remove(id: string) {
    if (!confirm("Template silinsin mi?")) return;
    const res = await fetch(`/api/admin/templates/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Silinemedi");
      return;
    }
    setRows((xs) => xs.filter((x) => x.id !== id));
  }

  if (rows.length === 0) {
    return (
      <div className="border border-border rounded-lg bg-card p-6 text-center text-sm text-muted-foreground">
        Henüz template yok. Yeni Template butonuna tıkla.
      </div>
    );
  }

  return (
    <ul className="border border-border rounded-lg overflow-hidden bg-card divide-y divide-border">
      {rows.map((t) => (
        <li key={t.id} className="flex items-center justify-between p-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{t.title}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {t.category ?? "genel"}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  t.published
                    ? "bg-success/20 text-success"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {t.published ? "yayında" : "taslak"}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              /{t.slug}
            </div>
            {t.description ? (
              <div className="text-xs text-muted-foreground mt-1 max-w-xl line-clamp-2">
                {t.description}
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => togglePublish(t.id, !t.published)}
              className="p-2 rounded-md hover:bg-muted cursor-pointer"
              title={t.published ? "Taslak yap" : "Yayına al"}
            >
              {t.published ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
            <Link
              href={`/admin/templates/${t.id}` as never}
              className="p-2 rounded-md hover:bg-muted cursor-pointer"
              title="Düzenle"
            >
              <Pencil className="size-4" />
            </Link>
            <button
              onClick={() => remove(t.id)}
              className="p-2 rounded-md hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
              title="Sil"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
