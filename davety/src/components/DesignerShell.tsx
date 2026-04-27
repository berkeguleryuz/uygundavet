"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, Eye, Save, Star, Undo2, Redo2 } from "lucide-react";
import type { Block, CountdownData, InvitationDoc } from "@davety/schema";
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
import { MobileHintBar } from "./MobileHintBar";
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
      {/* Top bar — responsive: compact on mobile, rich on desktop */}
      <header className="border-b border-border flex items-center justify-between gap-2 px-3 sm:px-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            onClick={handleClose}
            className="shrink-0 rounded-full p-1.5 hover:bg-muted cursor-pointer"
            aria-label="close"
          >
            <X className="size-4" />
          </button>
          <span className="text-sm font-medium truncate">
            {t("stepTitle")}
          </span>
          {dirty ? (
            <>
              {/* Desktop: full pill with label */}
              <span
                className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-amber-400/60 bg-amber-50 px-3 py-1.5 text-xs font-chakra uppercase tracking-[0.15em] text-amber-700"
                title="Kaydedilmemiş değişiklikler"
              >
                <Star className="size-3.5 fill-amber-500 text-amber-500" />
                Kaydedilmedi
              </span>
              {/* Mobile/tablet: small dot only */}
              <span
                className="lg:hidden inline-block size-2 rounded-full bg-amber-500 shrink-0"
                title="Kaydedilmemiş değişiklikler"
                aria-label="Kaydedilmemiş değişiklikler"
              />
            </>
          ) : null}
        </div>

        {/* Countdown — only desktop, takes too much room on mobile */}
        <div className="hidden lg:block shrink-0">
          <HeaderCountdown targetIso={resolveCountdownIso(doc)} />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={undo}
            disabled={pastLen === 0}
            title="Geri Al (⌘Z)"
            aria-label="Geri Al"
            className="inline-flex items-center justify-center rounded-full border border-border text-foreground p-2 cursor-pointer hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Undo2 className="size-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={futureLen === 0}
            title="İleri Al (⌘⇧Z)"
            aria-label="İleri Al"
            className="inline-flex items-center justify-center rounded-full border border-border text-foreground p-2 cursor-pointer hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Redo2 className="size-3.5" />
          </button>
          {/* Önizle / Kaydet — desktop only; mobile gets these in the bottom toolbar */}
          <button
            onClick={togglePreview}
            className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border text-foreground text-xs px-3 py-1.5 font-chakra uppercase tracking-[0.15em] cursor-pointer hover:bg-muted"
          >
            <Eye className="size-3.5" /> Önizle
          </button>
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border text-foreground text-xs px-3 py-1.5 font-chakra uppercase tracking-[0.15em] cursor-pointer hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save className="size-3.5" /> {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
          <button
            onClick={handlePublish}
            className="rounded-full bg-primary text-primary-foreground text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 font-chakra uppercase tracking-[0.15em] cursor-pointer hover:opacity-90"
          >
            Yayınla
          </button>
        </div>
      </header>

      {/* Workspace — desktop: side-by-side, mobile: full-canvas + bottom sheet.
          Mobile reserves 64px at the bottom so the toolbar doesn't overlap
          canvas content. */}
      <div className="min-h-0 grid md:grid-cols-[1fr_380px] pb-16 md:pb-0">
        <Canvas />
        <div className="hidden md:block min-h-0">
          <SidePanel />
        </div>
      </div>

      <MobileHintBar />
      <MobileSidePanel
        onPreview={togglePreview}
        onSave={save}
        saving={saving}
        dirty={dirty}
      />
      <OnboardingFlow />
      <PreviewOverlay />
    </div>
  );
}

/** Single source of truth for the header countdown: prefer the countdown
 *  block's targetIso (what the user actually sees and edits in the canvas),
 *  fall back to doc.meta when the doc has no countdown block. Without this
 *  the header and the in-canvas countdown could disagree if meta and the
 *  block were ever set independently. */
function resolveCountdownIso(doc: InvitationDoc): string {
  const cd = doc.blocks.find((b) => b.type === "countdown") as
    | Block<CountdownData>
    | undefined;
  if (cd?.data.targetIso) return cd.data.targetIso;
  return `${doc.meta.weddingDate}T${doc.meta.weddingTime}:00`;
}
