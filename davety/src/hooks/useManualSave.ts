"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useEditorStore } from "@/src/store/editor-store";

/**
 * Explicit save — only triggered when the user clicks the Save button
 * in the editor header. Persists the current `doc` to the database
 * via PATCH /api/design/invitations/:id and updates the local clean
 * state on success.
 */
export function useManualSave() {
  const [saving, setSaving] = useState(false);

  async function save(): Promise<boolean> {
    const state = useEditorStore.getState();
    const { docId, doc, lastAckUpdatedAt } = state;
    if (!docId || !doc) return false;

    setSaving(true);
    try {
      const res = await fetch(`/api/design/invitations/${docId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ doc, clientUpdatedAt: lastAckUpdatedAt }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error ?? "Kayıt başarısız");
        return false;
      }
      const body = await res.json();
      if (body?.updatedAt) state.setAckUpdatedAt(body.updatedAt);
      state.markClean();
      toast.success("Kaydedildi");
      return true;
    } catch (err) {
      console.warn("save error", err);
      toast.error("Bağlantı hatası — tekrar dene");
      return false;
    } finally {
      setSaving(false);
    }
  }

  return { save, saving };
}
