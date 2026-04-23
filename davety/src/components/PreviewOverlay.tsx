"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { InvitationView } from "@davety/renderer";
import { useEditorStore } from "@/src/store/editor-store";
import { useUIStore } from "@/src/store/ui-store";

export function PreviewOverlay() {
  const previewMode = useUIStore((s) => s.previewMode);
  const togglePreview = useUIStore((s) => s.togglePreview);
  const doc = useEditorStore((s) => s.doc);

  return (
    <AnimatePresence>
      {previewMode && doc ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-background overflow-y-auto"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-background/90 backdrop-blur border-b border-border">
            <button
              onClick={togglePreview}
              className="flex items-center gap-1.5 text-sm hover:text-foreground cursor-pointer"
            >
              <ArrowLeft className="size-4" /> Düzenlemeye Dön
            </button>
            <div className="text-xs font-chakra uppercase tracking-[0.2em] text-muted-foreground">
              Önizleme
            </div>
            <div className="w-24" />
          </div>

          <div className="max-w-md mx-auto py-8 px-4">
            <div
              className="rounded-xl shadow-xl overflow-hidden border border-border"
              style={{ background: doc.theme.bgColor, color: doc.theme.accentColor }}
            >
              <InvitationView doc={doc} />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
