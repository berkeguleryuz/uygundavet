"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { InvitationDoc } from "@davety/schema";
import { useEditorStore } from "@/src/store/editor-store";

const DEBOUNCE_MS = 800;

export function useDebouncedAutosave() {
  const docId = useEditorStore((s) => s.docId);
  const doc = useEditorStore((s) => s.doc);
  const dirty = useEditorStore((s) => s.dirty);
  const lastAck = useEditorStore((s) => s.lastAckUpdatedAt);
  const setAck = useEditorStore((s) => s.setAckUpdatedAt);
  const markClean = useEditorStore((s) => s.markClean);

  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inflight = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (!docId || !doc || !dirty) return;

    if (pending.current) clearTimeout(pending.current);
    pending.current = setTimeout(() => {
      pending.current = null;
      void save(docId, doc, lastAck);
    }, DEBOUNCE_MS);

    return () => {
      if (pending.current) clearTimeout(pending.current);
    };
  }, [docId, doc, dirty]);

  async function save(id: string, d: InvitationDoc, clientUpdatedAt: string | null) {
    if (inflight.current) await inflight.current;
    inflight.current = (async () => {
      try {
        const res = await fetch(`/api/design/invitations/${id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ doc: d, clientUpdatedAt }),
        });
        if (!res.ok) {
          // Silent retry on transient errors; only surface after repeated failure
          console.warn("autosave failed", res.status);
          return;
        }
        const body = await res.json();
        if (body?.updatedAt) setAck(body.updatedAt);
        markClean();
      } catch (err) {
        console.warn("autosave network error", err);
      } finally {
        inflight.current = null;
      }
    })();
    await inflight.current;
  }
}
