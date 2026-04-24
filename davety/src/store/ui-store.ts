"use client";

import { create } from "zustand";

export type PanelMode = "home" | "block" | "text";

interface UIState {
  selectedBlockId: string | null;
  selectedFieldId: string | null;
  hoveredBlockId: string | null;
  panelMode: PanelMode;
  onboardingStep: number | null;
  previewMode: boolean;

  selectBlock(id: string | null): void;
  selectField(blockId: string | null, fieldId: string | null): void;
  setHovered(id: string | null): void;
  setPanelMode(mode: PanelMode): void;
  setOnboardingStep(step: number | null): void;
  togglePreview(): void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedBlockId: null,
  selectedFieldId: null,
  hoveredBlockId: null,
  panelMode: "home",
  onboardingStep: 0,
  previewMode: false,

  selectBlock(id) {
    set({
      selectedBlockId: id,
      selectedFieldId: null,
      panelMode: id ? "block" : "home",
    });
  },
  selectField(blockId, fieldId) {
    set({
      selectedBlockId: blockId,
      selectedFieldId: fieldId,
      panelMode: fieldId ? "text" : blockId ? "block" : "home",
    });
  },
  setHovered(id) {
    set({ hoveredBlockId: id });
  },
  setPanelMode(mode) {
    set({ panelMode: mode });
  },
  setOnboardingStep(step) {
    set({ onboardingStep: step });
  },
  togglePreview() {
    set((s) => ({ previewMode: !s.previewMode }));
  },
}));
