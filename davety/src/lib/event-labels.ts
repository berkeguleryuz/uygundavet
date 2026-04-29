import type { EventCategory } from "@davety/schema";

/**
 * Per-category vocabulary for the editor side panel. The default doc
 * uses Gelin/Damat which doesn't make sense for a birthday or a
 * business launch — this helper swaps in the right words so the
 * panel and family block reflect the actual event type.
 *
 * `secondName` of `null` means the category only has one celebrant
 * (birthday, business). Callers can hide the second input.
 */
export interface EventLabels {
  firstName: string;
  secondName: string | null;
  family1: string;
  family2: string;
  /** Used when surfacing "couple names" as a single composite field. */
  composite: string;
}

export function getEventLabels(
  category: EventCategory | undefined,
): EventLabels {
  switch (category) {
    case "circumcision":
      return {
        firstName: "Çocuk Adı",
        secondName: "Kardeş Adı (opsiyonel)",
        family1: "Çocuğun Ailesi",
        family2: "Akrabalar",
        composite: "Çocuk Adı",
      };
    case "birthday":
      return {
        firstName: "Doğum Günü Sahibi",
        secondName: null,
        family1: "Aile",
        family2: "Yakınlar",
        composite: "Doğum Günü Sahibi",
      };
    case "business":
      return {
        firstName: "Şirket / Marka",
        secondName: "Etkinlik Adı (opsiyonel)",
        family1: "Ev Sahibi",
        family2: "Sponsorlar",
        composite: "Şirket Adı",
      };
    case "engagement":
    case "wedding":
    default:
      return {
        firstName: "Gelin Adı",
        secondName: "Damat Adı",
        family1: "Gelinin Ailesi",
        family2: "Damadın Ailesi",
        composite: "Gelin Adı",
      };
  }
}
