"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, Eye, Save, Star, Undo2, Redo2 } from "lucide-react";
import type { InvitationDoc } from "@davety/schema";
import { useRouter } from "@/i18n/navigation";
import { useEditorStore } from "@/src/store/editor-store";
import { useUIStore } from "@/src/store/ui-store";
import { useDebouncedAutosave } from "@/src/hooks/useDebouncedAutosave";
import { useManualSave } from "@/src/hooks/useManualSave";
import { ConfirmProvider, useConfirm } from "./ConfirmDialog";
import { HeaderCountdown } from "./HeaderCountdown";
import { Canvas } from "./Canvas";
import { SidePanel } from "./SidePanel/SidePanel";
import { MobileSidePanel } from "./MobileSidePanel";
import { OnboardingFlow } from "./OnboardingFlow";
import { PreviewOverlay } from "./PreviewOverlay";

interface DesignerShellProps {
  docId: string;
  initialDoc: InvitationDoc;
  initialUpdatedAt: string;
}

export function DesignerShell(props: DesignerShellProps) {
  return (
    <ConfirmProvider>
      <DesignerShellInner {...props} />
    </ConfirmProvider>
  );
}

function DesignerShellInner({
  docId,
  initialDoc,
  initialUpdatedAt,
}: DesignerShellProps) {
  const t = useTranslations("Editor");
  const router = useRouter();
  const confirm = useConfirm();

  const hydrate = useEditorStore((s) => s.hydrate);
  const doc = useEditorStore((s) => s.doc);
  const dirty = useEditorStore((s) => s.dirty);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const pastLen = useEditorStore((s) => s.past.length);
  const futureLen = useEditorStore((s) => s.future.length);
  const togglePreview = useUIStore((s) => s.togglePreview);
  const { save, saving } = useManualSave();

  useEffect(() => {
    hydrate({ docId, doc: initialDoc, updatedAt: initialUpdatedAt });
  }, [docId, initialDoc, initialUpdatedAt, hydrate]);

  useDebouncedAutosave();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      // Skip when typing in inputs / contenteditable
      const tgt = e.target as HTMLElement | null;
      const tag = tgt?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tgt?.isContentEditable
      )
        return;

      if (e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        (e.key.toLowerCase() === "z" && e.shiftKey) ||
        e.key.toLowerCase() === "y"
      ) {
        e.preventDefault();
        redo();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  async function handleClose() {
    if (dirty) {
      const ok = await confirm({
        title: "Kaydedilmemiş değişiklikler",
        description:
          "Yaptığın değişiklikler kaydedilmemiş. Yine de düzenleyiciden çıkmak istiyor musun?",
        confirmLabel: "Çık",
        cancelLabel: "Düzenlemeye Dön",
        variant: "danger",
      });
      if (!ok) return;
    }
    router.push("/dashboard");
  }

  async function handlePublish() {
    if (dirty) {
      const ok = await save();
      if (!ok) return; // save failed — stay in editor
    }
    router.push(`/design/invitations/${docId}/save`);
  }

  if (!doc) {
    return (
      <div className="min-h-dvh flex items-center justify-center text-sm text-muted-foreground">
        {t("errors.saveFailed")}
      </div>
    );
  }

  return (
    <div className="h-dvh grid grid-rows-[56px_1fr] bg-background overflow-hidden">
      {/* Top bar */}
      <header className="border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleClose}
            className="rounded-full p-1.5 hover:bg-muted cursor-pointer"
            aria-label="close"
          >
            <X className="size-4" />
          </button>
          <span className="text-sm font-medium">{t("stepTitle")}</span>
          {dirty ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/60 bg-amber-50 px-3 py-1.5 text-xs font-chakra uppercase tracking-[0.15em] text-amber-700"
              title="Kaydedilmemiş değişiklikler"
            >
              <Star className="size-3.5 fill-amber-500 text-amber-500" />
              Kaydedilmedi
            </span>
          ) : null}
        </div>

        <HeaderCountdown
          dateIso={doc.meta.weddingDate}
          time={doc.meta.weddingTime}
        />

        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={pastLen === 0}
            title="Geri Al (⌘Z)"
            className="inline-flex items-center justify-center rounded-full border border-border text-foreground p-2 cursor-pointer hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Undo2 className="size-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={futureLen === 0}
            title="İleri Al (⌘⇧Z)"
            className="inline-flex items-center justify-center rounded-full border border-border text-foreground p-2 cursor-pointer hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Redo2 className="size-3.5" />
          </button>
          <button
            onClick={togglePreview}
            className="inline-flex items-center gap-1.5 rounded-full border border-border text-foreground text-xs px-3 py-1.5 font-chakra uppercase tracking-[0.15em] cursor-pointer hover:bg-muted"
          >
            <Eye className="size-3.5" /> Önizle
          </button>
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-1.5 rounded-full border border-border text-foreground text-xs px-3 py-1.5 font-chakra uppercase tracking-[0.15em] cursor-pointer hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save className="size-3.5" /> {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
          <button
            onClick={handlePublish}
            className="rounded-full bg-primary text-primary-foreground text-xs px-4 py-1.5 font-chakra uppercase tracking-[0.15em] cursor-pointer hover:opacity-90"
          >
            Yayınla
          </button>
        </div>
      </header>

      {/* Workspace — desktop: side-by-side, mobile: full-canvas + bottom sheet */}
      <div className="min-h-0 grid md:grid-cols-[1fr_380px]">
        <Canvas />
        <div className="hidden md:block">
          <SidePanel />
        </div>
      </div>

      <MobileSidePanel />
      <OnboardingFlow />
      <PreviewOverlay />
    </div>
  );
}
