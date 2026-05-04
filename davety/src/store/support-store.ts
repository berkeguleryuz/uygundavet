import { create } from "zustand";

/**
 * Sağ alt köşedeki destek/iletişim widget'ının açık/kapalı state'i.
 * Toggle button (`SupportLauncher`) ve panel (`SupportWidget`) bu
 * store'u paylaşıyor.
 */
interface SupportStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useSupportStore = create<SupportStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));
