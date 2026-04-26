"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/src/store/editor-store";

/**
 * Hook is intentionally a no-op for network persistence.
 *
 * Earlier this hook PATCHed the design every 800ms, which silently
 * destroyed user state — if a session edit went bad, the draft was
 * already in the DB and there was no way to roll back. Persistence
 * now happens ONLY on explicit Save (see useManualSave). This hook is
 * kept so existing call sites compile and to leave a hook anchor for
 * future browser-warning logic.
 */
export function useDebouncedAutosave() {
  const dirty = useEditorStore((s) => s.dirty);

  useEffect(() => {
    if (!dirty || typeof window === "undefined") return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Modern browsers ignore the message string but still show a
      // generic confirmation when preventDefault is called and
      // returnValue is set.
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);
}
