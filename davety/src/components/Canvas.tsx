"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { ArrowDown, ArrowUp, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import {
  FontBoot,
  getBlockView,
  listBlockEntries,
} from "@davety/renderer";
import { useEditorStore } from "@/src/store/editor-store";
import { useUIStore } from "@/src/store/ui-store";
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

  const [insertingAt, setInsertingAt] = useState<number | null>(null);

  if (!doc) return null;

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
      className="min-h-0 overflow-auto bg-muted/30 py-8 px-6"
      onClick={() => {
        // Click outside any block → deselect + close any open palette
        selectBlock(null);
        setInsertingAt(null);
      }}
    >
      <div
        className="mx-auto w-full max-w-md rounded-xl overflow-hidden shadow-xl border border-border bg-card"
        style={{ background: doc.theme.bgColor, color: doc.theme.accentColor }}
        onClick={(e) => e.stopPropagation()}
      >
        <FontBoot doc={doc} />

        {doc.blocks.map((block, i) => {
          const View = getBlockView(block.type);
          const selected = selectedBlockId === block.id;

          return (
            <div key={block.id} className="relative">
              <InsertSlot
                index={i}
                active={insertingAt === i}
                onOpen={() => setInsertingAt(i)}
                onClose={() => setInsertingAt(null)}
                onPick={(type) => handlePick(i, type)}
              />

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
                    className="absolute top-2 right-2 flex items-center gap-1 z-20 bg-card/95 backdrop-blur-sm border border-border rounded-md shadow-lg p-1"
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
                      onClick={() => {
                        if (block.locked) return;
                        if (confirm("Bu bloğu silmek istediğine emin misin?")) {
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

        {/* Tail insert slot */}
        <InsertSlot
          index={doc.blocks.length}
          active={insertingAt === doc.blocks.length}
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
  onOpen,
  onClose,
  onPick,
}: {
  index: number;
  active: boolean;
  onOpen: () => void;
  onClose: () => void;
  onPick: (type: import("@davety/schema").BlockType) => void;
}) {
  const entries = listBlockEntries();

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
          className="absolute top-6 z-20 bg-card border border-border rounded-lg shadow-xl p-2 w-72"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-1 px-1">
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
