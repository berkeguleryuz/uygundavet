"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { InvitationDoc } from "@davety/schema";
import { InvitationView } from "@davety/renderer";

interface Props {
  id: string;
  initial: {
    title: string;
    description: string;
    category: string;
    published: boolean;
    doc: Record<string, unknown>;
  };
}

export function TemplateEditor({ id, initial }: Props) {
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [category, setCategory] = useState(initial.category);
  const [published, setPublished] = useState(initial.published);
  const [docText, setDocText] = useState(() =>
    JSON.stringify(initial.doc, null, 2)
  );
  const [parsed, setParsed] = useState<InvitationDoc | null>(
    initial.doc as unknown as InvitationDoc
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function tryParse(text: string) {
    try {
      const d = JSON.parse(text) as InvitationDoc;
      setParsed(d);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON parse error");
    }
  }

  async function save() {
    setBusy(true);
    const res = await fetch(`/api/admin/templates/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title,
        description: description || null,
        category: category || null,
        published,
        doc: parsed,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      toast.error("Kaydedilemedi");
      return;
    }
    toast.success("Kaydedildi");
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-muted-foreground">Başlık</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Açıklama</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Yayında
        </label>

        <div>
          <label className="text-xs text-muted-foreground">InvitationDoc (JSON)</label>
          <textarea
            value={docText}
            onChange={(e) => {
              setDocText(e.target.value);
              tryParse(e.target.value);
            }}
            rows={20}
            className="w-full font-chakra text-xs rounded-md border border-input bg-background px-3 py-2 resize-none"
          />
          {error ? (
            <div className="text-xs text-destructive mt-1">{error}</div>
          ) : null}
        </div>

        <button
          onClick={save}
          disabled={busy || !!error}
          className="self-start rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-xs font-chakra uppercase tracking-[0.2em] disabled:opacity-50 cursor-pointer"
        >
          {busy ? "..." : "Kaydet"}
        </button>
      </div>

      <aside className="sticky top-6 self-start">
        <div className="text-xs text-muted-foreground mb-2">Önizleme</div>
        <div
          className="rounded-xl border border-border bg-card overflow-hidden max-h-[70vh] overflow-y-auto"
          style={
            parsed?.theme
              ? {
                  background: parsed.theme.bgColor,
                  color: parsed.theme.accentColor,
                }
              : undefined
          }
        >
          {parsed ? <InvitationView doc={parsed} /> : null}
        </div>
      </aside>
    </div>
  );
}
