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

const HISTORY_LIMIT = 60;

interface EditorState {
  docId: string | null;
  doc: InvitationDoc | null;
  lastAckUpdatedAt: string | null;
  dirty: boolean;
  past: InvitationDoc[];
  future: InvitationDoc[];

  hydrate(args: { docId: string; doc: InvitationDoc; updatedAt: string }): void;
  setAckUpdatedAt(ts: string): void;
  markClean(): void;
  applyPatch(mutator: (d: Draft<InvitationDoc>) => void): void;

  undo(): void;
  redo(): void;
  canUndo(): boolean;
  canRedo(): boolean;

  moveBlock(id: string, newIndex: number): void;
  toggleVisibility(id: string): void;
  updateBlockStyle(id: string, style: Partial<BlockStyle>): void;
  updateBlockData(id: string, patch: Record<string, unknown>): void;
  updateFieldStyle(blockId: string, fieldId: string, style: FieldStylePatch): void;
  updateTheme(patch: Partial<Theme>): void;
  insertBlock(block: Block, atIndex?: number): void;
  deleteBlock(id: string): void;
}

/** Helper: pushes previous doc to past, clears future, returns new state. */
function commitChange(
  state: EditorState,
  next: InvitationDoc
): Partial<EditorState> {
  if (!state.doc) return { doc: next, dirty: true };
  const past = [...state.past, state.doc].slice(-HISTORY_LIMIT);
  return { doc: next, dirty: true, past, future: [] };
}

export const useEditorStore = create<EditorState>((set, get) => ({
  docId: null,
  doc: null,
  lastAckUpdatedAt: null,
  dirty: false,
  past: [],
  future: [],

  hydrate({ docId, doc, updatedAt }) {
    set({
      docId,
      doc,
      lastAckUpdatedAt: updatedAt,
      dirty: false,
      past: [],
      future: [],
    });
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
      if (next === s.doc) return s;
      return { ...s, ...commitChange(s, next) };
    });
  },

  undo() {
    set((s) => {
      if (!s.doc || s.past.length === 0) return s;
      const previous = s.past[s.past.length - 1];
      const past = s.past.slice(0, -1);
      const future = [s.doc, ...s.future].slice(0, HISTORY_LIMIT);
      return { ...s, doc: previous, past, future, dirty: true };
    });
  },
  redo() {
    set((s) => {
      if (!s.doc || s.future.length === 0) return s;
      const next = s.future[0];
      const future = s.future.slice(1);
      const past = [...s.past, s.doc].slice(-HISTORY_LIMIT);
      return { ...s, doc: next, past, future, dirty: true };
    });
  },
  canUndo() {
    return get().past.length > 0;
  },
  canRedo() {
    return get().future.length > 0;
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
      if (next === s.doc) return s;
      return { ...s, ...commitChange(s, next) };
    });
  },
  toggleVisibility(id) {
    set((s) => {
      if (!s.doc) return s;
      const next = produce(s.doc, (d) => {
        const b = d.blocks.find((x: Block) => x.id === id);
        if (b) b.visible = !b.visible;
      });
      if (next === s.doc) return s;
      return { ...s, ...commitChange(s, next) };
    });
  },
  updateBlockStyle(id, patch) {
    set((s) => {
      if (!s.doc) return s;
      const next = produce(s.doc, (d) => {
        const b = d.blocks.find((x: Block) => x.id === id);
        if (b) b.style = { ...b.style, ...patch };
      });
      if (next === s.doc) return s;
      return { ...s, ...commitChange(s, next) };
    });
  },
  updateBlockData(id, patch) {
    set((s) => {
      if (!s.doc) return s;
      const next = produce(s.doc, (d) => {
        const b = d.blocks.find((x: Block) => x.id === id);
        if (b) b.data = { ...b.data, ...patch };
      });
      if (next === s.doc) return s;
      return { ...s, ...commitChange(s, next) };
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
      if (next === s.doc) return s;
      return { ...s, ...commitChange(s, next) };
    });
  },
  updateTheme(patch) {
    set((s) => {
      if (!s.doc) return s;
      const next = produce(s.doc, (d) => {
        d.theme = { ...d.theme, ...patch };
      });
      if (next === s.doc) return s;
      return { ...s, ...commitChange(s, next) };
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
      if (next === s.doc) return s;
      return { ...s, ...commitChange(s, next) };
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
      if (next === s.doc) return s;
      return { ...s, ...commitChange(s, next) };
    });
  },
}));
