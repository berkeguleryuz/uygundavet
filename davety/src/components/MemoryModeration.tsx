"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Trash2 } from "lucide-react";

interface Memory {
  id: string;
  authorName: string;
  message: string;
  approved: boolean;
  createdAt: string;
}

export function MemoryModeration({
  designId,
  initial,
}: {
  designId: string;
  initial: Memory[];
}) {
  const [items, setItems] = useState<Memory[]>(initial);

  async function toggleApprove(entryId: string, approved: boolean) {
    const prev = items;
    setItems((xs) => xs.map((x) => (x.id === entryId ? { ...x, approved } : x)));
    const res = await fetch(
      `/api/design/invitations/${designId}/memories/${entryId}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ approved }),
      }
    );
    if (!res.ok) {
      setItems(prev);
      toast.error("Güncellenemedi");
    }
  }

  async function remove(entryId: string) {
    if (!confirm("Bu mesajı silmek istediğine emin misin?")) return;
    const prev = items;
    setItems((xs) => xs.filter((x) => x.id !== entryId));
    const res = await fetch(
      `/api/design/invitations/${designId}/memories/${entryId}`,
      { method: "DELETE" }
    );
    if (!res.ok) {
      setItems(prev);
      toast.error("Silinemedi");
    }
  }

  if (items.length === 0) {
    return (
      <div className="border border-border rounded-lg bg-card p-6 text-center text-sm text-muted-foreground">
        Henüz mesaj yok.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((m) => (
        <li
          key={m.id}
          className={`border rounded-lg p-4 bg-card ${
            m.approved ? "border-success/40" : "border-warning/40"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{m.authorName}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    m.approved
                      ? "bg-success/20 text-success"
                      : "bg-warning/20 text-warning"
                  }`}
                >
                  {m.approved ? "Yayında" : "Bekliyor"}
                </span>
              </div>
              <p className="text-sm mt-2 whitespace-pre-wrap">{m.message}</p>
              <div className="text-xs text-muted-foreground mt-2">
                {new Date(m.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => toggleApprove(m.id, !m.approved)}
                className={`p-2 rounded-md cursor-pointer ${
                  m.approved
                    ? "bg-success/20 text-success hover:bg-success/30"
                    : "hover:bg-muted"
                }`}
                title={m.approved ? "Yayından kaldır" : "Onayla"}
              >
                <Check className="size-4" />
              </button>
              <button
                onClick={() => remove(m.id)}
                className="p-2 rounded-md hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
                title="Sil"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
