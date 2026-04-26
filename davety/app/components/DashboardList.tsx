"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Link, useRouter } from "@/i18n/navigation";

export interface DashboardDesign {
  id: string;
  slug: string;
  vanityPath: string | null;
  status: string;
  updatedAt: string;
  coupleName?: string | null;
  templateLabel?: string | null;
}

interface Props {
  designs: DashboardDesign[];
  locale: string;
  publicBase: string;
}

export function DashboardList({ designs: initial, locale, publicBase }: Props) {
  const router = useRouter();
  const [designs, setDesigns] = useState(initial);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setBusy(id);
    try {
      const res = await fetch(`/api/design/invitations/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error ?? "Silinemedi");
        return;
      }
      setDesigns((prev) => prev.filter((d) => d.id !== id));
      toast.success("Davetiye silindi");
      setConfirming(null);
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  if (designs.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Henüz bir davetiye oluşturmadın. Yeni Davetiye butonuna tıkla.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border border border-border rounded-lg overflow-hidden bg-card">
      {designs.map((d) => (
        <li
          key={d.id}
          className="p-4 flex items-center justify-between gap-3 flex-wrap"
        >
          <div>
            <div className="text-sm font-medium">
              {d.coupleName ?? d.vanityPath ?? d.slug}
            </div>
            <div className="text-xs text-muted-foreground">
              {d.templateLabel ? `${d.templateLabel} · ` : ""}
              {d.status === "published" ? "Yayında" : "Taslak"} ·{" "}
              {new Date(d.updatedAt).toLocaleDateString(locale)}
              <span className="opacity-50"> · {d.vanityPath ?? d.slug}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
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
                href={`${publicBase}/i/${d.vanityPath ?? d.slug}`}
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
            <button
              onClick={() => setConfirming(d.id)}
              className="text-xs h-8 w-8 inline-flex items-center justify-center rounded-full border border-border hover:bg-destructive hover:text-destructive-foreground cursor-pointer transition-colors"
              aria-label="Sil"
              title="Sil"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>

          {confirming === d.id ? (
            <ConfirmDelete
              slug={d.vanityPath ?? d.slug}
              busy={busy === d.id}
              onCancel={() => setConfirming(null)}
              onConfirm={() => handleDelete(d.id)}
            />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function ConfirmDelete({
  slug,
  busy,
  onCancel,
  onConfirm,
}: {
  slug: string;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={busy ? undefined : onCancel}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-xl mb-2">Davetiyeyi sil</h3>
        <p className="text-sm text-muted-foreground mb-5">
          <span className="font-medium text-foreground">{slug}</span> adlı
          davetiye kalıcı olarak silinecek. Misafirler, RSVP cevapları ve
          anı defteri yazıları da silinir. Bu işlem geri alınamaz.
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            disabled={busy}
            className="flex-1 px-4 py-2.5 rounded-full border border-border bg-white text-sm hover:border-foreground/40 cursor-pointer disabled:opacity-50"
          >
            Vazgeç
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 px-4 py-2.5 rounded-full bg-destructive text-destructive-foreground text-sm hover:opacity-90 cursor-pointer disabled:opacity-70"
          >
            {busy ? "Siliniyor..." : "Evet, Sil"}
          </button>
        </div>
      </div>
    </div>
  );
}
