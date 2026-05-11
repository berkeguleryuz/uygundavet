"use client";

import { create } from "zustand";

export type PanelMode = "home" | "block" | "text";
export type DesignTab = "design" | "envelope" | "music" | "decorations";

interface UIState {
  selectedBlockId: string | null;
  selectedFieldId: string | null;
  hoveredBlockId: string | null;
  panelMode: PanelMode;
  /** Which tab inside the home/design side panel is open. The Canvas
   *  watches this so it can show an envelope preview instead of the
   *  invitation when the user is configuring envelope colors. */
  designTab: DesignTab;
  onboardingStep: number | null;
  previewMode: boolean;
  /** Mobil bottom sheet kontrol bayrağı. Her tema/şablon seçimi sonrası
   *  kullanıcının davetiyenin değişikliğini görmesi için drawer
   *  otomatik kapanır. Drawer kendi state'ini Vaul yönetiyor; biz bu
   *  bayrağı false → true → false geçirerek "kapan" sinyali veriyoruz. */
  mobilePanelOpen: boolean;

  selectBlock(id: string | null): void;
  selectField(blockId: string | null, fieldId: string | null): void;
  setHovered(id: string | null): void;
  setPanelMode(mode: PanelMode): void;
  setDesignTab(tab: DesignTab): void;
  setOnboardingStep(step: number | null): void;
  togglePreview(): void;
  setMobilePanelOpen(open: boolean): void;
  closeMobilePanel(): void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedBlockId: null,
  selectedFieldId: null,
  hoveredBlockId: null,
  panelMode: "home",
  designTab: "design",
  onboardingStep: 0,
  previewMode: false,
  mobilePanelOpen: false,

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
  setDesignTab(tab) {
    set({ designTab: tab });
  },
  setOnboardingStep(step) {
    set({ onboardingStep: step });
  },
  togglePreview() {
    set((s) => ({ previewMode: !s.previewMode }));
  },
  setMobilePanelOpen(open) {
    set({ mobilePanelOpen: open });
  },
  closeMobilePanel() {
    set({ mobilePanelOpen: false });
  },
}));
