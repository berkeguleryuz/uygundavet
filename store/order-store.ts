import { create } from "zustand";
import type { OrderData } from "@/models/Order";

interface OrderStore {
  order: OrderData | null;
  isLoading: boolean;
  fetchOrder: () => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set) => ({
  order: null,
  isLoading: true,

  fetchOrder: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/orders/me");
      const data = await res.json();
      set({ order: data.order || null });
    } catch {
      set({ order: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
