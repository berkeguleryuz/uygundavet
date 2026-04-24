/**
 * Discount schedule — decided centrally so server + client agree, and so the
 * Stripe layer (coupon / promotion-code selection) can read from the same
 * source of truth later. Percentages are whole integers.
 *
 * Priority:
 *   1. Monthly flash sale (5th–7th of every month, any weekday)
 *   2. Weekday rotation (Mon/Wed/Thu/Fri/Sat discounted; Tue/Sun regular)
 */

export interface ActiveOffer {
  /** Integer percent 0..100 */
  percent: number;
  /** Short human label shown in the banner */
  label: string;
  /** Longer description / badge secondary text */
  sublabel?: string;
  /** UTC ISO end timestamp — countdown target */
  endsAtIso: string;
  /**
   * Stripe promotion code name we'd bind this window to. Kept here so the
   * client never tries to apply a custom discount to amounts — it always
   * defers to Stripe by sending { promotionCode } at checkout time.
   */
  promotionCode: string | null;
}

const WEEKDAY_LABELS_TR = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
];

/**
 * Returns the offer active "as of" the provided moment, based on the user's
 * local clock. Callers must pass Date; we never read system time inside so
 * this stays pure and easy to unit-test.
 */
export function resolveActiveOffer(now: Date): ActiveOffer {
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  // 1) Monthly 3-day flash sale — days 5, 6, 7 (inclusive). Ends at the
  //    start of the 8th (local midnight) and therefore spans whatever 3
  //    weekdays those dates fall on in a given month.
  if (date >= 5 && date <= 7) {
    const endsAt = new Date(year, month, 8, 0, 0, 0, 0);
    return {
      percent: 60,
      label: "Aylık Flaş İndirim",
      sublabel: "Yalnızca her ayın 5–7'sinde",
      endsAtIso: endsAt.toISOString(),
      promotionCode: "MONTHLY_FLASH_60",
    };
  }

  // 2) Weekday rotation — all countdowns end at local midnight.
  const endsAt = new Date(year, month, date + 1, 0, 0, 0, 0);
  const dow = now.getDay(); // 0=Sun … 6=Sat

  switch (dow) {
    case 1: // Monday
      return {
        percent: 30,
        label: `${WEEKDAY_LABELS_TR[1]} İndirimi`,
        endsAtIso: endsAt.toISOString(),
        promotionCode: "WEEKDAY_MON_30",
      };
    case 3: // Wednesday
      return {
        percent: 40,
        label: `${WEEKDAY_LABELS_TR[3]} İndirimi`,
        endsAtIso: endsAt.toISOString(),
        promotionCode: "WEEKDAY_WED_40",
      };
    case 4: // Thursday
      return {
        percent: 20,
        label: `${WEEKDAY_LABELS_TR[4]} İndirimi`,
        endsAtIso: endsAt.toISOString(),
        promotionCode: "WEEKDAY_THU_20",
      };
    case 5: // Friday
      return {
        percent: 50,
        label: `${WEEKDAY_LABELS_TR[5]} İndirimi`,
        sublabel: "Haftanın en yüksek indirimi",
        endsAtIso: endsAt.toISOString(),
        promotionCode: "WEEKDAY_FRI_50",
      };
    case 6: // Saturday
      return {
        percent: 20,
        label: `${WEEKDAY_LABELS_TR[6]} İndirimi`,
        endsAtIso: endsAt.toISOString(),
        promotionCode: "WEEKDAY_SAT_20",
      };
    // Tuesday (2) and Sunday (0) — no discount. Still carry a valid
    // endsAt so the banner can show "Yarın %X indirim" if we want.
    default:
      return {
        percent: 0,
        label: "Bugün İndirim Yok",
        sublabel: "Yarının indirimini aşağıda görebilirsin.",
        endsAtIso: endsAt.toISOString(),
        promotionCode: null,
      };
  }
}

/** Apply the offer percent to a base price and return the final amount (round to int TL). */
export function applyOffer(basePrice: number, percent: number): number {
  if (percent <= 0) return basePrice;
  return Math.round((basePrice * (100 - percent)) / 100);
}
