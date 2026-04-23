"use client";

import { produce, type Draft } from "immer";
import { create } from "zustand";
import type { Block, BlockStyle, InvitationDoc, Theme } from "@davety/schema";

export type FieldStylePatch = Partial<{
  fontFamily: string;
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
}>;

interface EditorState {
  docId: string | null;
  doc: InvitationDoc | null;
  lastAckUpdatedAt: string | null;
  dirty: boolean;

  hydrate(args: { docId: string; doc: InvitationDoc; updatedAt: string }): void;
  setAckUpdatedAt(ts: string): void;
  markClean(): void;
  applyPatch(mutator: (d: Draft<InvitationDoc>) => void): void;

  moveBlock(id: string, newIndex: number): void;
  toggleVisibility(id: string): void;
  updateBlockStyle(id: string, style: Partial<BlockStyle>): void;
  updateBlockData(id: string, patch: Record<string, unknown>): void;
  updateFieldStyle(blockId: string, fieldId: string, style: FieldStylePatch): void;
  updateTheme(patch: Partial<Theme>): void;
  insertBlock(block: Block, atIndex?: number): void;
  deleteBlock(id: string): void;
}

export const useEditorStore = create<EditorState>((set) => ({
  docId: null,
  doc: null,
  lastAckUpdatedAt: null,
  dirty: false,

  hydrate({ docId, doc, updatedAt }) {
    set({ docId, doc, lastAckUpdatedAt: updatedAt, dirty: false });
  },
  setAckUpdatedAt(ts) {
    set({ lastAckUpdatedAt: ts });
  },
  markClean() {
    set({ dirty: false });
  },

  applyPatch(mutator) {
    set((s) => {
      if (!s.doc) return s;
      const next = produce(s.doc, mutator);
      return { ...s, doc: next, dirty: true };
    });
  },

  moveBlock(id, newIndex) {
    set((s) => {
      if (!s.doc) return s;
      const next = produce(s.doc, (d) => {
        const idx = d.blocks.findIndex((b: Block) => b.id === id);
        if (idx < 0) return;
        const [block] = d.blocks.splice(idx, 1);
        d.blocks.splice(
          Math.max(0, Math.min(newIndex, d.blocks.length)),
          0,
          block
        );
      });
      return { ...s, doc: next, dirty: true };
    });
  },
  toggleVisibility(id) {
    set((s) => {
      if (!s.doc) return s;
      const next = produce(s.doc, (d) => {
        const b = d.blocks.find((x: Block) => x.id === id);
        if (b) b.visible = !b.visible;
      });
      return { ...s, doc: next, dirty: true };
    });
  },
  updateBlockStyle(id, patch) {
    set((s) => {
      if (!s.doc) return s;
      const next = produce(s.doc, (d) => {
        const b = d.blocks.find((x: Block) => x.id === id);
        if (b) b.style = { ...b.style, ...patch };
      });
      return { ...s, doc: next, dirty: true };
    });
  },
  updateBlockData(id, patch) {
    set((s) => {
      if (!s.doc) return s;
      const next = produce(s.doc, (d) => {
        const b = d.blocks.find((x: Block) => x.id === id);
        if (b) b.data = { ...b.data, ...patch };
      });
      return { ...s, doc: next, dirty: true };
    });
  },
  updateFieldStyle(blockId, fieldId, style) {
    set((s) => {
      if (!s.doc) return s;
      const next = produce(s.doc, (d) => {
        const b = d.blocks.find((x: Block) => x.id === blockId);
        if (!b) return;
        b.style.fieldOverrides = b.style.fieldOverrides ?? {};
        b.style.fieldOverrides[fieldId] = {
          ...(b.style.fieldOverrides[fieldId] ?? {}),
          ...style,
        };
      });
      return { ...s, doc: next, dirty: true };
    });
  },
  updateTheme(patch) {
    set((s) => {
      if (!s.doc) return s;
      const next = produce(s.doc, (d) => {
        d.theme = { ...d.theme, ...patch };
      });
      return { ...s, doc: next, dirty: true };
    });
  },
  insertBlock(block, atIndex) {
    set((s) => {
      if (!s.doc) return s;
      const next = produce(s.doc, (d) => {
        const idx =
          typeof atIndex === "number"
            ? Math.max(0, Math.min(atIndex, d.blocks.length))
            : d.blocks.length;
        d.blocks.splice(idx, 0, block);
      });
      return { ...s, doc: next, dirty: true };
    });
  },
  deleteBlock(id) {
    set((s) => {
      if (!s.doc) return s;
      const next = produce(s.doc, (d) => {
        const idx = d.blocks.findIndex((b: Block) => b.id === id);
        if (idx < 0) return;
        if (d.blocks[idx].locked) return; // locked blocks cannot be deleted
        d.blocks.splice(idx, 1);
      });
      return { ...s, doc: next, dirty: true };
    });
  },
}));
