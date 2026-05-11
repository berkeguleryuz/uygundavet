"use client";

import { Drawer } from "vaul";
import { Eye, Layers, Save, Wand2 } from "lucide-react";
import { useUIStore } from "@/src/store/ui-store";
import { DesignHomePanel } from "./SidePanel/DesignHomePanel";
import { TextStylePanel } from "./SidePanel/TextStylePanel";
import { BlockControlsPanel } from "./SidePanel/BlockControlsPanel";

/** Subtle pulse ring around toolbar buttons that the contextual hint bar
 *  is currently pointing at. Pure CSS, no extra deps. */
const ATTN_RING =
  "after:content-[''] after:absolute after:inset-1 after:rounded-xl after:ring-2 after:ring-primary/60 after:animate-pulse after:pointer-events-none";

interface Props {
  onPreview: () => void;
  onSave: () => void;
  saving: boolean;
  dirty: boolean;
}

/**
 * Persistent mobile bottom toolbar, replaces the old single-button FAB
 * with four equal-width quick actions:
 *  - Tasarla  → opens the design home drawer
 *  - Düzenle  → opens the contextual block / text drawer
 *  - Önizle   → toggles the full-screen preview overlay
 *  - Kaydet   → saves; lights up amber when there are unsaved changes
 *
 * On md+ this whole bar is hidden, desktop uses the right side panel.
 */
export function MobileSidePanel({ onPreview, onSave, saving, dirty }: Props) {
  const panelMode = useUIStore((s) => s.panelMode);
  const setPanelMode = useUIStore((s) => s.setPanelMode);
  // Controlled drawer — DesignTab tema seçince closeMobilePanel()
  // çağırarak sheet'i kapatabilsin diye. Vaul'un kendi state'ini
  // dışarıdan yönetiyoruz.
  const mobilePanelOpen = useUIStore((s) => s.mobilePanelOpen);
  const setMobilePanelOpen = useUIStore((s) => s.setMobilePanelOpen);

  const drawerLabel =
    panelMode === "text"
      ? "Metin Düzenle"
      : panelMode === "block"
        ? "Blok Ayarları"
        : "Davetiye Tasarımı";

  // Which toolbar slot should glow to draw attention. Mirrors the cue
  // logic in MobileHintBar so the visual pointer + button pulse agree.
  const attentionSlot: 0 | 1 | 3 | null =
    panelMode === "text" || panelMode === "block"
      ? 1
      : dirty
        ? 3
        : panelMode === "home"
          ? 0
          : null;

  return (
    <>
      {/* Bottom toolbar */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="grid grid-cols-4">
          {/* Tek controlled Drawer.Root — hem Tasarla hem Düzenle
              tetikleyici aynı drawer'ı açar, içerik panelMode'a göre
              swap olur. Bu sayede tema seçince closeMobilePanel() ile
              tek seferde kapatılabiliyor. */}
          <Drawer.Root
            shouldScaleBackground={false}
            open={mobilePanelOpen}
            onOpenChange={setMobilePanelOpen}
          >
            <button
              onClick={(e) => {
                // Drawer açılırken trigger'a focus kalırsa Vaul parent'ı
                // aria-hidden yapıyor ve "focused element içinde
                // aria-hidden var" warning'i çıkıyor. Tıklamadan sonra
                // blur ile focus'u kaldırıyoruz; drawer kendi initial
                // focus'unu yönetir.
                e.currentTarget.blur();
                setPanelMode("home");
                setMobilePanelOpen(true);
              }}
              className={`relative flex flex-col items-center justify-center gap-1 py-2.5 cursor-pointer hover:bg-muted/60 transition-colors ${
                attentionSlot === 0 ? ATTN_RING : ""
              }`}
            >
              <Wand2 className="size-4" />
              <span className="text-[10px] uppercase tracking-wider">
                Tasarla
              </span>
            </button>

            <button
              disabled={panelMode === "home"}
              onClick={(e) => {
                e.currentTarget.blur();
                setMobilePanelOpen(true);
              }}
              className={`relative flex flex-col items-center justify-center gap-1 py-2.5 cursor-pointer hover:bg-muted/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${
                attentionSlot === 1 ? ATTN_RING : ""
              }`}
            >
              <Layers className="size-4" />
              <span className="text-[10px] uppercase tracking-wider">
                {panelMode === "text" ? "Metin" : "Blok"}
              </span>
            </button>

            <DrawerSheet title={drawerLabel}>
              {panelMode === "home" ? <DesignHomePanel /> : null}
              {panelMode === "block" ? <BlockControlsPanel /> : null}
              {panelMode === "text" ? <TextStylePanel /> : null}
            </DrawerSheet>
          </Drawer.Root>

          <button
            onClick={onPreview}
            className="flex flex-col items-center justify-center gap-1 py-2.5 cursor-pointer hover:bg-muted/60 transition-colors"
          >
            <Eye className="size-4" />
            <span className="text-[10px] uppercase tracking-wider">Önizle</span>
          </button>

          <button
            onClick={onSave}
            disabled={!dirty || saving}
            className={`relative flex flex-col items-center justify-center gap-1 py-2.5 cursor-pointer transition-colors disabled:cursor-not-allowed ${
              dirty
                ? "text-amber-700 hover:bg-amber-50"
                : "text-muted-foreground hover:bg-muted/60 disabled:opacity-40"
            } ${attentionSlot === 3 ? ATTN_RING : ""}`}
          >
            <Save className="size-4" />
            <span className="text-[10px] uppercase tracking-wider">
              {saving ? "..." : "Kaydet"}
            </span>
            {dirty ? (
              <span className="absolute top-1.5 right-[calc(50%-1.25rem)] size-1.5 rounded-full bg-amber-500" />
            ) : null}
          </button>
        </div>
      </nav>

    </>
  );
}

function DrawerSheet({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
      {/* max-h düşürüldü (85dvh → 60dvh) — bottom sheet açıkken
          kullanıcının davetiyenin üst yarısını görmesi için. Eskiden
          neredeyse tüm ekranı kaplayıp tema seçince ne değiştiği
          görünmüyordu. */}
      <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl border-t border-border max-h-[60dvh] flex flex-col">
        <Drawer.Title className="sr-only">{title}</Drawer.Title>
        {/* Radix/Vaul Dialog primitive Description bekliyor; yoksa
            console warning. sr-only ile sadece AT için, görsel etkisi
            yok. */}
        <Drawer.Description className="sr-only">
          {title} ayar paneli
        </Drawer.Description>
        <div className="mx-auto mt-3 mb-1 w-10 h-1 rounded-full bg-border" />
        <div className="px-5 pt-1 pb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center">
          {title}
        </div>
        <div className="overflow-y-auto">{children}</div>
      </Drawer.Content>
    </Drawer.Portal>
  );
}
