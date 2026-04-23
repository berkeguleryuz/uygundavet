"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

interface TemplateRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  previewUrl: string | null;
}

export function TemplatePicker({
  templates,
  date,
  time,
}: {
  templates: TemplateRow[];
  date: string;
  time: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function pick(templateId: string | null) {
    const key = templateId ?? "blank";
    setBusy(key);
    const res = await fetch("/api/design/invitations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        weddingDate: date,
        weddingTime: time,
        templateId: templateId ?? undefined,
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Oluşturulamadı");
      setBusy(null);
      return;
    }
    const data = await res.json();
    router.push(`/design/invitations/${data.id}/editor`);
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Blank option */}
      <button
        onClick={() => pick(null)}
        disabled={busy !== null}
        className="group flex flex-col rounded-xl border-2 border-dashed border-border bg-card overflow-hidden hover:border-primary cursor-pointer disabled:opacity-50 transition-colors"
      >
        <div className="aspect-[5/7] flex items-center justify-center bg-muted/30">
          <div className="text-muted-foreground text-center p-6">
            <div className="text-4xl mb-2">＋</div>
            <div className="text-xs uppercase tracking-wider">Boş Şablon</div>
          </div>
        </div>
        <div className="p-3 text-left">
          <div className="font-medium text-sm">Boş Başla</div>
          <div className="text-xs text-muted-foreground mt-1">
            Sıfırdan kendi davetiyeni kur
          </div>
        </div>
      </button>

      {templates.map((t) => (
        <button
          key={t.id}
          onClick={() => pick(t.id)}
          disabled={busy !== null}
          className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:border-primary cursor-pointer disabled:opacity-50 transition-colors text-left"
        >
          <div className="aspect-[5/7] bg-muted/30 relative overflow-hidden">
            {t.previewUrl ? (
              <img
                src={t.previewUrl}
                alt={t.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                Önizleme yok
              </div>
            )}
            {busy === t.id ? (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs">
                Hazırlanıyor...
              </div>
            ) : null}
          </div>
          <div className="p-3">
            <div className="font-medium text-sm">{t.title}</div>
            {t.category ? (
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                {t.category}
              </div>
            ) : null}
            {t.description ? (
              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {t.description}
              </div>
            ) : null}
          </div>
        </button>
      ))}
    </div>
  );
}
