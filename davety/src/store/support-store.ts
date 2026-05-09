import { create } from "zustand";

/**
 * Sağ alt köşedeki destek/iletişim widget'ının açık/kapalı state'i.
 * Toggle button (`SupportLauncher`) ve panel (`SupportWidget`) bu
 * store'u paylaşıyor.
 */
interface SupportStore {
  isOpen: boolean;
  /** Sticky flag: kullanıcı widget'ı bir kez açtı mı? Lazy import
   *  pattern için — widget JS chunk'ı sadece ilk açılışta yüklensin
   *  diye SupportLauncher bu flag'i izleyip render'ı geciktiriyor. */
  hasEverOpened: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useSupportStore = create<SupportStore>((set) => ({
  isOpen: false,
  hasEverOpened: false,
  open: () => set({ isOpen: true, hasEverOpened: true }),
  close: () => set({ isOpen: false }),
  toggle: () =>
    set((s) => ({
      isOpen: !s.isOpen,
      hasEverOpened: s.hasEverOpened || !s.isOpen,
    })),
}));
