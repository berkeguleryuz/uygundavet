"use client";

import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { ArrowDown, ArrowUp, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import {
  FontBoot,
  getBlockView,
  listBlockEntries,
  getCardShapeStyle,
  getCardShapePadding,
  getCardShapeTopClipPx,
  InvitationView,
} from "@davety/renderer";
import { useEditorStore } from "@/src/store/editor-store";
import { useUIStore } from "@/src/store/ui-store";
import { useConfirm } from "@/src/components/ConfirmDialog";
import { WeddingEnvelope } from "@/src/components/envelopes/WeddingEnvelope";
import { resolveEnvelopeProps } from "@/src/components/envelopes/resolveEnvelope";
import { cn } from "@/src/lib/utils";
import type { BlockType, PlanTier } from "@davety/schema";

const BLOCK_LABELS: Record<string, string> = {
  hero: "Başlık",
  countdown: "Geri Sayım",
  families: "Aileler",
  event_program: "Program",
  venue: "Mekan",
  story_timeline: "Hikayemiz",
  gallery: "Galeri",
  memory_book: "Hatıra Defteri",
  rsvp_form: "Katılım Formu",
  donation: "Bağış",
  cta: "Buton",
  custom_note: "Özel Not",
  custom_section: "Özel Bölüm",
  contact: "İletişim",
  footer: "Altyazı",
  decoration: "Süsleme",
};

export function Canvas() {
  const doc = useEditorStore((s) => s.doc);
  const moveBlock = useEditorStore((s) => s.moveBlock);
  const deleteBlock = useEditorStore((s) => s.deleteBlock);
  const toggleVisibility = useEditorStore((s) => s.toggleVisibility);
  const insertBlock = useEditorStore((s) => s.insertBlock);

  const selectBlock = useUIStore((s) => s.selectBlock);
  const selectField = useUIStore((s) => s.selectField);
  const selectedBlockId = useUIStore((s) => s.selectedBlockId);
  const designTab = useUIStore((s) => s.designTab);
  const panelMode = useUIStore((s) => s.panelMode);
  const confirm = useConfirm();

  const [insertingAt, setInsertingAt] = useState<number | null>(null);

  if (!doc) return null;

  // İlk blokta floating toolbar'ın clip-path tarafından kırpılmaması
  // için sağ köşedeki clip derinliği kadar (artı 8px nefes payı)
  // aşağı itilir. peaked/tag/arch/tall-arch için bu sayı kayda değer,
  // chevron sağ köşede tepede olduğu için neredeyse 0.
  const firstBlockClipPx = getCardShapeTopClipPx(doc);

  // When the user is on the Zarf Tasarımı tab in the side panel, the
  // canvas swaps to a live envelope preview instead of the invitation
  // document. Click toggles the envelope open so envelope changes
  // (color, flap, lining) can be verified end-to-end.
  if (panelMode === "home" && designTab === "envelope") {
    return <EnvelopeCanvas />;
  }

  const tier = doc.meta.tier;

  const handlePick = (index: number, type: BlockType) => {
    // Hatıra Defteri planlama sırasında her tier'da eklenebilir;
    // free pakette publish anında server-side trim ediliyor (block
    // yayında görünmez). Bu UX kullanıcıyı denemeden alıkoymuyor.
    const entry = listBlockEntries().find((e) => e.type === type);
    if (!entry) return;
    insertBlock(
      {
        id: nanoid(8),
        type: entry.type,
        visible: true,
        data: entry.defaultData as Record<string, unknown>,
        style: entry.defaultStyle,
      },
      index
    );
    setInsertingAt(null);
  };

  return (
    <div
      className="min-h-0 overflow-auto py-8 px-6"
      style={{ background: doc.theme.pageBgColor ?? "#252224" }}
      onClick={() => {
        // Click outside any block → deselect + close any open palette
        selectBlock(null);
        setInsertingAt(null);
      }}
    >
      {/* Head insert slot, sits OUTSIDE the card (just above it) so the
           button has its own breathing room and never gets clipped by
           the card's overflow-hidden or the editor toolbar. Mirror of
           the TailInsertSlot at the bottom, gives users a discoverable
           way to add a block ABOVE the first one. */}
      <div
        className="mx-auto w-full max-w-md mb-4 flex justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <TailInsertSlot
          active={insertingAt === 0}
          tier={tier}
          onOpen={() => setInsertingAt(0)}
          onClose={() => setInsertingAt(null)}
          onPick={(type) => handlePick(0, type)}
        />
      </div>

      <div
        className="mx-auto w-full max-w-md rounded-xl overflow-hidden shadow-xl border border-border bg-card"
        style={{
          background: doc.theme.bgColor,
          color: doc.theme.accentColor,
          ...getCardShapeStyle(doc),
          // Photo-driven hero ilk blok ise paddingTop sıfır, görsel
          // kart tepesine kadar uzansın. InvitationView ile birebir
          // aynı mantık.
          ...(() => {
            const firstBlock = doc.blocks[0];
            const fbd = firstBlock?.data as
              | { variant?: string; media?: { url?: string }; photoUrl?: string }
              | undefined;
            const firstHasPhoto = !!(
              firstBlock?.type === "hero" &&
              (fbd?.variant === "photo-top" || fbd?.variant === "photo-full") &&
              (fbd?.media?.url || fbd?.photoUrl)
            );
            const p = getCardShapePadding(doc);
            return firstHasPhoto ? { ...p, paddingTop: "0px" } : p;
          })(),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <FontBoot doc={doc} />

        {doc.blocks.map((block, i) => {
          const View = getBlockView(block.type);
          const selected = selectedBlockId === block.id;
          // İlk bloğun InsertSlot'u kart-dışı head slot olarak yukarıda
          // render ediliyor. Buradaki absolute slot kart içinde
          // overflow-hidden tarafından kırpılıyordu.
          const hideSlot = i === 0;

          // Block boşluk slider'ı block.style.paddingTop/Bottom'a yazar.
          // InvitationView ile aynı mantık: pozitif değer padding,
          // negatif değer margin (komşuya doğru sokulsun). Editor
          // canvas'ı da aynı kuralı uygulamalı ki kullanıcı slider'ı
          // çekince anında değişimi görsün.
          const pt = block.style.paddingTop;
          const pb = block.style.paddingBottom;
          const wrapperStyle: React.CSSProperties = {
            paddingTop: pt != null && pt > 0 ? pt : undefined,
            paddingBottom: pb != null && pb > 0 ? pb : undefined,
            marginTop: pt != null && pt < 0 ? pt : undefined,
            marginBottom: pb != null && pb < 0 ? pb : undefined,
          };

          return (
            <div
              key={block.id}
              className="relative group/block"
              style={wrapperStyle}
            >
              {hideSlot ? null : (
                <InsertSlot
                  index={i}
                  active={insertingAt === i}
                  // Flip palette upward for the last 3 slots so it doesn't
                  // run off the bottom of the card / canvas.
                  flipUp={i >= doc.blocks.length - 2}
                  // Force-show the slot when the adjacent block is the
                  // selected one so mobile users (no hover) can still
                  // reach it after tapping a block.
                  forceVisible={selected || selectedBlockId === doc.blocks[i - 1]?.id}
                  tier={tier}
                  onOpen={() => setInsertingAt(i)}
                  onClose={() => setInsertingAt(null)}
                  onPick={(type) => handlePick(i, type)}
                />
              )}

              <div
                className={cn(
                  "relative transition-all",
                  !block.visible && "opacity-35",
                  selected &&
                    "outline-2 outline-accent outline-offset-2 outline-dashed"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  selectBlock(block.id);
                }}
              >
                <View
                  block={block}
                  theme={doc.theme}
                  editable
                  onFieldSelect={(fieldId) => selectField(block.id, fieldId)}
                />

                {selected ? (
                  <div
                    // İlk blokta toolbar'ın clip-path tarafından
                    // kırpılmaması için shape'e göre dinamik offset
                    // (arch/tag/peaked/tall-arch hepsi farklı miktarda
                    // sağ köşeyi yer). Diğer bloklar normal top-2.
                    className="absolute right-2 flex items-center gap-1 z-30 bg-card/95 backdrop-blur-sm border border-border rounded-md shadow-lg p-1"
                    style={{
                      top:
                        i === 0 && firstBlockClipPx > 0
                          ? `${firstBlockClipPx + 8}px`
                          : "8px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconBtn
                      title="Yukarı taşı"
                      disabled={i === 0}
                      onClick={() => moveBlock(block.id, i - 1)}
                    >
                      <ArrowUp className="size-3.5" />
                    </IconBtn>
                    <IconBtn
                      title="Aşağı taşı"
                      disabled={i === doc.blocks.length - 1}
                      onClick={() => moveBlock(block.id, i + 1)}
                    >
                      <ArrowDown className="size-3.5" />
                    </IconBtn>
                    <IconBtn
                      title={block.visible ? "Gizle" : "Göster"}
                      onClick={() => toggleVisibility(block.id)}
                    >
                      {block.visible ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                    </IconBtn>
                    <IconBtn
                      title={
                        block.locked
                          ? "Bu blok silinemez (işlevsel). Gizleyebilirsin."
                          : "Sil"
                      }
                      danger
                      disabled={block.locked}
                      onClick={async () => {
                        if (block.locked) return;
                        const ok = await confirm({
                          title: "Bloğu sil",
                          description:
                            "Bu bloğu silmek istediğine emin misin? Bu işlem geri alınabilir (Ctrl+Z).",
                          confirmLabel: "Sil",
                          cancelLabel: "Vazgeç",
                          variant: "danger",
                        });
                        if (ok) {
                          deleteBlock(block.id);
                          selectBlock(null);
                        }
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </IconBtn>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}

      </div>

      {/* Tail insert slot, sits OUTSIDE the card so it never appears in
           the invitation itself (so the user can screenshot/preview the
           card cleanly). Always visible, palette opens downward. */}
      <div
        className="mx-auto w-full max-w-md mt-4 flex justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <TailInsertSlot
          active={insertingAt === doc.blocks.length}
          tier={tier}
          onOpen={() => setInsertingAt(doc.blocks.length)}
          onClose={() => setInsertingAt(null)}
          onPick={(type) => handlePick(doc.blocks.length, type)}
        />
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  title,
  danger,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "bg-card border border-border rounded-md p-1.5 shadow cursor-pointer hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed",
        !disabled && danger && "hover:bg-destructive hover:text-destructive-foreground"
      )}
    >
      {children}
    </button>
  );
}

function InsertSlot({
  active,
  flipUp,
  forceVisible,
  tier,
  onOpen,
  onClose,
  onPick,
}: {
  index: number;
  active: boolean;
  /** Open the palette above the button instead of below (used for slots
   *  near the bottom of the card so it doesn't get clipped). */
  flipUp: boolean;
  /** Show the button regardless of hover state, used on touch devices
   *  (no :hover) and when the adjacent block is selected, so mobile
   *  users have a deterministic way to reveal "+ Blok Ekle". */
  forceVisible: boolean;
  tier: PlanTier | undefined;
  onOpen: () => void;
  onClose: () => void;
  onPick: (type: BlockType) => void;
}) {
  // Inline insert slot is absolute-positioned and hover-only on desktop.
  // On touch devices (`(hover: none)`) the slot is always visible since
  // there is no hover trigger to reveal it. It also stays visible when
  // the adjacent block is selected, so a tap-then-add flow works on
  // mobile.
  // Buton sağ uçta dursun ki üstteki blok'un toolbar (yukarı/aşağı/
  // gizle/sil) butonlarıyla çakışmasın. Palette de sağa-yaslı açılır.
  const paletteCls = flipUp
    ? "absolute bottom-full mb-2 right-0"
    : "absolute top-full mt-2 right-0";

  return (
    <div
      className={cn(
        "absolute right-2 -translate-y-1/2 top-0 z-20",
        "opacity-0 group-hover/block:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity",
        (active || forceVisible) && "opacity-100"
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {!active ? (
        <button
          onClick={onOpen}
          className="flex items-center gap-1 text-[10px] bg-card border border-border rounded-full px-2.5 py-1 shadow-sm hover:bg-muted cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="size-3" /> Blok Ekle
        </button>
      ) : (
        <BlockPalette flipUp={flipUp} paletteCls={paletteCls} tier={tier} onClose={onClose} onPick={onPick} />
      )}
    </div>
  );
}

function TailInsertSlot({
  active,
  tier,
  onOpen,
  onClose,
  onPick,
}: {
  active: boolean;
  tier: PlanTier | undefined;
  onOpen: () => void;
  onClose: () => void;
  onPick: (type: BlockType) => void;
}) {
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      {!active ? (
        <button
          onClick={onOpen}
          className="flex items-center gap-1.5 text-xs bg-card border border-border rounded-full px-4 py-2 shadow-sm hover:bg-muted cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="size-3.5" /> Blok Ekle
        </button>
      ) : (
        <BlockPalette
          flipUp={false}
          paletteCls="absolute top-full mt-2 left-1/2 -translate-x-1/2"
          tier={tier}
          onClose={onClose}
          onPick={onPick}
        />
      )}
    </div>
  );
}

function BlockPalette({
  paletteCls,
  onClose,
  onPick,
}: {
  flipUp: boolean;
  paletteCls: string;
  tier: PlanTier | undefined;
  onClose: () => void;
  onPick: (type: BlockType) => void;
}) {
  // CTA / "Buton" bloğu palette'ten gizlendi, kullanıcı için anlamlı
  // değil (link/işlev karmaşası). Renderer hâlâ destekliyor ki eski
  // davetiyelerde varsa görünmeye devam etsin.
  const entries = listBlockEntries().filter((e) => e.type !== "cta");
  return (
    <div
      className={`${paletteCls} z-30 bg-card border border-border rounded-lg shadow-xl p-2 w-72 max-h-[60vh] overflow-y-auto`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-1 px-1 sticky top-0 bg-card pb-1">
        <span className="text-[11px] font-medium">Blok ekle</span>
        <button
          onClick={onClose}
          className="text-[10px] text-muted-foreground hover:underline cursor-pointer"
        >
          Kapat
        </button>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {entries.map((e) => (
          <button
            key={e.type}
            onClick={() => onPick(e.type)}
            className="text-[11px] text-left px-2 py-1.5 rounded cursor-pointer hover:bg-muted"
          >
            {BLOCK_LABELS[e.type] ?? e.type}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Envelope canvas (Zarf Tasarımı) ───
   Renders a live preview of the envelope using current theme.envelope.
   The envelope component handles its own click → flap-open animation,
   so theme tweaks (color, flap, lining) can be verified end-to-end
   the same way recipients will see them. The card slot inside the
   envelope holds the FULL InvitationView (every block, hero,
   countdown, families, program, …) so the editor preview matches what
   the recipient actually sees. The card frame is a fixed size; the
   InvitationView scrolls inside it so the user can read every block
   without leaving the envelope frame. */

function EnvelopeCanvas() {
  const doc = useEditorStore((s) => s.doc);
  // Card height tracks the viewport so the envelope preview fills the
  // available canvas vertically instead of leaving a big empty area
  // below the scene. The subtracted offset accounts for the editor
  // header, "Zarf Önizlemesi" label, sceneTopPad, sceneBottomPad and
  // canvas padding, picked empirically to land the envelope cleanly
  // inside the visible area on common desktop heights.
  const [cardHeight, setCardHeight] = useState(780);
  useEffect(() => {
    const update = () =>
      setCardHeight(Math.max(520, window.innerHeight - 260));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!doc) return null;

  const resolved = resolveEnvelopeProps(doc.theme.envelope);

  return (
    <div
      className="min-h-0 overflow-auto py-10 px-6 flex flex-col items-center gap-6"
      style={{ background: doc.theme.pageBgColor ?? "#252224" }}
    >
      <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        Zarf Önizlemesi · Tıkla
      </div>
      <WeddingEnvelope
        guestName="Misafir"
        envelopeWidth={520}
        cardWidth={460}
        cardHeight={cardHeight}
        layout="replace"
        {...resolved}
        cardRender={({ width, height }) => (
          <div
            className="relative overflow-auto rounded-md shadow-xl"
            style={{
              width,
              height,
              background: doc.theme.bgColor,
              color: doc.theme.accentColor,
              ...getCardShapeStyle(doc),
              ...getCardShapePadding(doc),
            }}
          >
            <InvitationView doc={doc} />
          </div>
        )}
      />
    </div>
  );
}
