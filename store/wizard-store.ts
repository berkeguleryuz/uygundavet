import { create } from "zustand";
import type { PackageKey } from "@/lib/packages";
import type { ThemeKey } from "@/lib/themes";

interface WizardState {
  phone: string;
  owner1FirstName: string;
  owner1LastName: string;
  owner2FirstName: string;
  owner2LastName: string;
  weddingDate: string;
  weddingTime: string;

  selectedPackage: PackageKey | null;
  selectedTheme: ThemeKey | null;
  customThemeRequest: string;
  paymentMethod: "deposit" | "full" | null;

  setField: (field: string, value: string) => void;
  setPackage: (pkg: PackageKey) => void;
  setTheme: (theme: ThemeKey) => void;
  setPaymentMethod: (method: "deposit" | "full") => void;
  reset: () => void;
}

const initialState = {
  phone: "",
  owner1FirstName: "",
  owner1LastName: "",
  owner2FirstName: "",
  owner2LastName: "",
  weddingDate: "",
  weddingTime: "",
  selectedPackage: null as PackageKey | null,
  selectedTheme: null as ThemeKey | null,
  customThemeRequest: "",
  paymentMethod: null as "deposit" | "full" | null,
};

export const useWizardStore = create<WizardState>((set) => ({
  ...initialState,

  setField: (field, value) => set({ [field]: value }),
  setPackage: (pkg) => set({ selectedPackage: pkg }),
  setTheme: (theme) => set({ selectedTheme: theme }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  reset: () => set(initialState),
}));
