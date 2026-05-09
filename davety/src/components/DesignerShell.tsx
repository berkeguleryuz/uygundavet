"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { X, Eye, Save, Star, Undo2, Redo2, Sparkles, Share2 } from "lucide-react";
import type { Block, CountdownData, InvitationDoc } from "@davety/schema";
import { useRouter } from "@/i18n/navigation";
import { useEditorStore } from "@/src/store/editor-store";
import { useUIStore } from "@/src/store/ui-store";
import { useDebouncedAutosave } from "@/src/hooks/useDebouncedAutosave";
import { useManualSave } from "@/src/hooks/useManualSave";
import { useIsAdmin } from "@/src/hooks/useIsAdmin";
import { ConfirmProvider, useConfirm } from "./ConfirmDialog";
import { HeaderCountdown } from "./HeaderCountdown";
import { Canvas } from "./Canvas";
import { SidePanel } from "./SidePanel/SidePanel";
import { MobileSidePanel } from "./MobileSidePanel";
import { MobileHintBar } from "./MobileHintBar";

// Editor açılışında nadir kullanılan / koşullu modal'lar dinamik
// import ile gönderilir. OnboardingFlow ilk kullanıcı dışında render
// olmuyor, PreviewOverlay sadece "Önizle" tıklanınca, SaveTemplateModal
// sadece admin "Şablon Kaydet" butonuna basınca açılıyor.
const OnboardingFlow = dynamic(
  () => import("./OnboardingFlow").then((m) => ({ default: m.OnboardingFlow })),
  { ssr: false },
);
const PreviewOverlay = dynamic(
  () => import("./PreviewOverlay").then((m) => ({ default: m.PreviewOverlay })),
  { ssr: false },
);
const SaveTemplateModal = dynamic(
  () =>
    import("./SaveTemplateModal").then((m) => ({
      default: m.SaveTemplateModal,
    })),
  { ssr: false },
);

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
  // undo/redo store action'ları sadece keydown handler içinde
  // kullanılıyor — getState() ile orada okunuyor, render-time
  // subscribe'a gerek yok. (rerender-defer-reads)
  // Sadece bool durumu lazım — uzunluk her undo'da farklı olabilir
  // ama buton enabled/disabled state'i sadece 0/positive transition'da
  // değişir; raw length'e subscribe etmek gereksiz re-render üretir.
  // (rerender-derived-state)
  const canUndo = useEditorStore((s) => s.past.length > 0);
  const canRedo = useEditorStore((s) => s.future.length > 0);
  // Davetiye yayında mı? — header'daki butonu "Yayınla" yerine
  // "YAYINDA" badge + "Paylaş" butonuna çevirmek için. Narrow
  // selector primitive — keystroke'larda re-render olmaz.
  const isPublished = useEditorStore(
    (s) => s.doc?.meta?.status === "published",
  );
  const undo = () => useEditorStore.getState().undo();
  const redo = () => useEditorStore.getState().redo();
  const togglePreview = useUIStore((s) => s.togglePreview);
  const { save, saving } = useManualSave();
  // doc immer her keystroke'ta yeni referans verdiği için useMemo
  // burada işe yaramıyordu (deps her render'da farklı). Doğrudan
  // store selector primitive string döner; React sadece string değer
  // değişince re-render eder, isim girilmediği sürece countdown ISO
  // sabit. (rerender-derived-state)
  const countdownIso = useEditorStore((s) =>
    s.doc ? resolveCountdownIso(s.doc) : "",
  );
  const isAdmin = useIsAdmin();
  const [templateModalOpen, setTemplateModalOpen] = useState(false);

  useEffect(() => {
    hydrate({ docId, doc: initialDoc, updatedAt: initialUpdatedAt });
  }, [docId, initialDoc, initialUpdatedAt, hydrate]);

  useDebouncedAutosave();

  useEffect(() => {
    // Store action'ları getState() ile callback içinde okunur, bu sayede
    // effect deps boş kalır ve listener bir kez register/unregister edilir.
    // (rerender-defer-reads + advanced-event-handler-refs)
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const tgt = e.target as HTMLElement | null;
      const tag = tgt?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tgt?.isContentEditable
      )
        return;

      const store = useEditorStore.getState();
      if (e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        store.undo();
      } else if (
        (e.key.toLowerCase() === "z" && e.shiftKey) ||
        e.key.toLowerCase() === "y"
      ) {
        e.preventDefault();
        store.redo();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
      if (!ok) return; // save failed, stay in editor
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
      {/* Top bar, responsive: compact on mobile, rich on desktop */}
      <header className="border-b border-border flex items-center justify-between gap-2 px-3 sm:px-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            onClick={handleClose}
            className="shrink-0 rounded-full p-1.5 hover:bg-muted cursor-pointer"
            aria-label="close"
          >
            <X className="size-4" />
          </button>
          {/* Admin için "Şablon Olarak Kaydet" kısayolu. Kullanıcının
              tasarladığı mevcut doc'u DesignTemplate'e push eder, daha
              sonra /admin/templates'den preview ekleyip yayınlanır.
              Sadece isAdminSession() true olan kullanıcılarda render
              edilir, normal kullanıcılar bu butonu görmez. */}
          {isAdmin ? (
            <button
              onClick={() => setTemplateModalOpen(true)}
              title="Şablon Olarak Kaydet"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 text-amber-700 px-2.5 py-1 text-[11px] font-chakra uppercase tracking-[0.12em] hover:bg-amber-100 cursor-pointer"
            >
              <Sparkles className="size-3.5" />
              <span className="hidden sm:inline">Şablon Kaydet</span>
            </button>
          ) : null}
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

        {/* Countdown, only desktop, takes too much room on mobile */}
        <div className="hidden lg:block shrink-0">
          <HeaderCountdown targetIso={countdownIso} />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Geri Al (⌘Z)"
            aria-label="Geri Al"
            className="inline-flex items-center justify-center rounded-full border border-border text-foreground p-2 cursor-pointer hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Undo2 className="size-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="İleri Al (⌘⇧Z)"
            aria-label="İleri Al"
            className="inline-flex items-center justify-center rounded-full border border-border text-foreground p-2 cursor-pointer hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Redo2 className="size-3.5" />
          </button>
          {/* Önizle / Kaydet, desktop only; mobile gets these in the bottom toolbar */}
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
          {/* Davetiye yayında değilse: tek "Yayınla" CTA. Yayındaysa:
              "YAYINDA" yeşil badge + dikkat çekici amber "Paylaş"
              butonu (Save ekranına gider — QR, link, paylaşım). */}
          {isPublished ? (
            <>
              <span
                className="hidden md:inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 px-2.5 py-1 text-[10px] font-chakra uppercase tracking-[0.18em]"
                title="Davetiye yayında"
              >
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Yayında
              </span>
              <button
                onClick={() =>
                  router.push(`/design/invitations/${docId}/save`)
                }
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 text-white text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 font-chakra uppercase tracking-[0.15em] cursor-pointer hover:bg-amber-600 shadow-sm shadow-amber-500/25"
                title="Paylaş & QR"
              >
                <Share2 className="size-3.5" />
                <span className="hidden sm:inline">Paylaş</span>
              </button>
            </>
          ) : (
            <button
              onClick={handlePublish}
              className="rounded-full bg-primary text-primary-foreground text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 font-chakra uppercase tracking-[0.15em] cursor-pointer hover:opacity-90"
            >
              Yayınla
            </button>
          )}
        </div>
      </header>

      {/* Workspace, desktop: side-by-side, mobile: full-canvas + bottom sheet.
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
      <OnboardingFlow docId={docId} />
      <PreviewOverlay />
      {/* SaveTemplateModal sadece admin için + sadece açıkken mount.
          Modal her açılışta fresh state'le başlasın diye conditional
          render. AnimatePresence onExitComplete unmount'u tetikler. */}
      {isAdmin && templateModalOpen ? (
        <SaveTemplateModal
          onClose={() => setTemplateModalOpen(false)}
          doc={doc}
        />
      ) : null}
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
