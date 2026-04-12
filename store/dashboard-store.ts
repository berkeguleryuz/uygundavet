import { create } from "zustand";
import type {
  RsvpStatus,
  GuestSource,
  GuestData,
  CustomerData,
} from "@/types/dashboard";

interface DashboardStats {
  totalGuests: number;
  totalGuestCount: number;
  confirmed: number;
  declined: number;
  pending: number;
  daysUntilWedding: number;
  invitationViews: number;
}

interface DashboardStore {
  // Guests
  guests: GuestData[];
  isLoadingGuests: boolean;
  fetchGuests: () => Promise<void>;
  addGuest: (
    data: Omit<GuestData, "_id" | "createdAt" | "updatedAt">
  ) => Promise<GuestData | null>;
  updateGuest: (
    id: string,
    data: Partial<GuestData>
  ) => Promise<GuestData | null>;
  deleteGuest: (id: string) => Promise<boolean>;

  // Stats
  stats: DashboardStats | null;
  isLoadingStats: boolean;
  fetchStats: () => Promise<void>;

  // Customer
  customer: CustomerData | null;
  customerOrder: {
    selectedPackage: string;
    selectedTheme: string;
    userPhone: string;
    userEmail: string;
    paymentStatus: string;
  } | null;
  isLoadingCustomer: boolean;
  fetchCustomer: () => Promise<void>;
  updateCustomer: (data: Partial<CustomerData>) => Promise<boolean>;

  // Filters
  searchQuery: string;
  rsvpFilter: RsvpStatus | "all";
  sourceFilter: GuestSource | "all";
  setSearchQuery: (q: string) => void;
  setRsvpFilter: (f: RsvpStatus | "all") => void;
  setSourceFilter: (f: GuestSource | "all") => void;
  clearFilters: () => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  // Guests
  guests: [],
  isLoadingGuests: true,
  fetchGuests: async () => {
    set({ isLoadingGuests: true });
    try {
      const res = await fetch("/api/dashboard/guests");
      const data = await res.json();
      set({ guests: data.guests || [] });
    } catch {
      set({ guests: [] });
    } finally {
      set({ isLoadingGuests: false });
    }
  },
  addGuest: async (guestData) => {
    try {
      const res = await fetch("/api/dashboard/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guestData),
      });
      if (!res.ok) return null;
      const data = await res.json();
      set({ guests: [data.guest, ...get().guests] });
      return data.guest;
    } catch {
      return null;
    }
  },
  updateGuest: async (id, updates) => {
    try {
      const res = await fetch(`/api/dashboard/guests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) return null;
      const data = await res.json();
      set({
        guests: get().guests.map((g) => (g._id === id ? data.guest : g)),
      });
      return data.guest;
    } catch {
      return null;
    }
  },
  deleteGuest: async (id) => {
    try {
      const res = await fetch(`/api/dashboard/guests/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) return false;
      set({ guests: get().guests.filter((g) => g._id !== id) });
      return true;
    } catch {
      return false;
    }
  },

  // Stats
  stats: null,
  isLoadingStats: true,
  fetchStats: async () => {
    set({ isLoadingStats: true });
    try {
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();
      set({ stats: data.stats || null });
    } catch {
      set({ stats: null });
    } finally {
      set({ isLoadingStats: false });
    }
  },

  // Customer
  customer: null,
  customerOrder: null,
  isLoadingCustomer: true,
  fetchCustomer: async () => {
    set({ isLoadingCustomer: true });
    try {
      const res = await fetch("/api/dashboard/customer");
      const data = await res.json();
      set({
        customer: data.customer || null,
        customerOrder: data.order || null,
      });
    } catch {
      set({ customer: null, customerOrder: null });
    } finally {
      set({ isLoadingCustomer: false });
    }
  },
  updateCustomer: async (updates) => {
    try {
      const res = await fetch("/api/dashboard/customer", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) return false;
      const data = await res.json();
      set({ customer: data.customer });
      return true;
    } catch {
      return false;
    }
  },

  // Filters
  searchQuery: "",
  rsvpFilter: "all",
  sourceFilter: "all",
  setSearchQuery: (q) => set({ searchQuery: q }),
  setRsvpFilter: (f) => set({ rsvpFilter: f }),
  setSourceFilter: (f) => set({ sourceFilter: f }),
  clearFilters: () =>
    set({ searchQuery: "", rsvpFilter: "all", sourceFilter: "all" }),
}));
