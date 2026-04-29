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
  isArchShape,
  InvitationView,
} from "@davety/renderer";
import { useEditorStore } from "@/src/store/editor-store";
import { useUIStore } from "@/src/store/ui-store";
import { useConfirm } from "@/src/components/ConfirmDialog";
import { WeddingEnvelope } from "@/src/components/envelopes/WeddingEnvelope";
import { resolveEnvelopeProps } from "@/src/components/envelopes/resolveEnvelope";
import { cn } from "@/src/lib/utils";

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

  const archActive = isArchShape(doc);

  // When the user is on the Zarf Tasarımı tab in the side panel, the
  // canvas swaps to a live envelope preview instead of the invitation
  // document. Click toggles the envelope open so envelope changes
  // (color, flap, lining) can be verified end-to-end.
  if (panelMode === "home" && designTab === "envelope") {
    return <EnvelopeCanvas />;
  }

  const handlePick = (index: number, type: import("@davety/schema").BlockType) => {
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
      <div
        className="mx-auto w-full max-w-md rounded-xl overflow-hidden shadow-xl border border-border bg-card"
        style={{
          background: doc.theme.bgColor,
          color: doc.theme.accentColor,
          ...getCardShapeStyle(doc),
          ...getCardShapePadding(doc),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <FontBoot doc={doc} />

        {doc.blocks.map((block, i) => {
          const View = getBlockView(block.type);
          const selected = selectedBlockId === block.id;
          // When the card has an arch silhouette, hide the very first
          // insert slot — it would sit on top of the rounded dome and
          // be visually clipped/unreachable.
          const hideSlot = i === 0 && archActive;

          return (
            <div key={block.id} className="relative">
              {hideSlot ? null : (
                <InsertSlot
                  index={i}
                  active={insertingAt === i}
                  // Flip palette upward for the last 3 slots so it doesn't
                  // run off the bottom of the card / canvas.
                  flipUp={i >= doc.blocks.length - 2}
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
                    // First block + arch shape: push toolbar below the
                    // dome so move/hide/delete buttons aren't clipped
                    // by the rounded top corners (overflow-hidden on
                    // the card cuts off anything sitting in the curve).
                    className={cn(
                      "absolute right-2 flex items-center gap-1 z-30 bg-card/95 backdrop-blur-sm border border-border rounded-md shadow-lg p-1",
                      i === 0 && archActive ? "top-20" : "top-2"
                    )}
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

        {/* Tail insert slot — palette always opens upward since there's
             nothing below it inside the card. */}
        <InsertSlot
          index={doc.blocks.length}
          active={insertingAt === doc.blocks.length}
          flipUp
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
  index: _i,
  active,
  flipUp,
  onOpen,
  onClose,
  onPick,
}: {
  index: number;
  active: boolean;
  /** Open the palette above the button instead of below (used for slots
   *  near the bottom of the card so it doesn't get clipped). */
  flipUp: boolean;
  onOpen: () => void;
  onClose: () => void;
  onPick: (type: import("@davety/schema").BlockType) => void;
}) {
  const entries = listBlockEntries();

  // Palette positions itself centered horizontally so it stays inside the
  // card frame even when the trigger sits at the very edge. Vertical
  // direction flips based on flipUp so the menu never falls off the
  // visible canvas — bottom slots open upward.
  const paletteCls = flipUp
    ? "absolute bottom-full mb-2 left-1/2 -translate-x-1/2"
    : "absolute top-full mt-2 left-1/2 -translate-x-1/2";

  return (
    <div
      className="relative flex items-center justify-center h-6"
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
                className="text-[11px] text-left px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
              >
                {BLOCK_LABELS[e.type] ?? e.type}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Envelope canvas (Zarf Tasarımı) ───
   Renders a live preview of the envelope using current theme.envelope.
   The envelope component handles its own click → flap-open animation,
   so theme tweaks (color, flap, lining) can be verified end-to-end
   the same way recipients will see them. The card slot inside the
   envelope holds the FULL InvitationView (every block — hero,
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
  // canvas padding — picked empirically to land the envelope cleanly
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
