export const PACKAGES = {
  starter: { price: 7499, depositPercent: 0.5 },
  pro: { price: 12999, depositPercent: 0.5 },
  business: { price: 14999, depositPercent: 0.5 },
} as const;

export type PackageKey = keyof typeof PACKAGES;

export const PAYMENT_IBAN = process.env.NEXT_PUBLIC_PAYMENT_IBAN || "";
export const PAYMENT_HOLDER = process.env.NEXT_PUBLIC_PAYMENT_HOLDER || "";
