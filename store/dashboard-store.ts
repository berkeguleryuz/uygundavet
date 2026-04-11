import { create } from "zustand";
import type { RsvpStatus, GuestSource } from "@/mock-data/dashboard";

interface DashboardStore {
  searchQuery: string;
  rsvpFilter: RsvpStatus | "all";
  sourceFilter: GuestSource | "all";
  setSearchQuery: (q: string) => void;
  setRsvpFilter: (f: RsvpStatus | "all") => void;
  setSourceFilter: (f: GuestSource | "all") => void;
  clearFilters: () => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  searchQuery: "",
  rsvpFilter: "all",
  sourceFilter: "all",

  setSearchQuery: (q) => set({ searchQuery: q }),
  setRsvpFilter: (f) => set({ rsvpFilter: f }),
  setSourceFilter: (f) => set({ sourceFilter: f }),

  clearFilters: () =>
    set({
      searchQuery: "",
      rsvpFilter: "all",
      sourceFilter: "all",
    }),
}));
