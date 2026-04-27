/**
 * Curated decorative SVG icon catalog for the davetiye editor.
 *
 * Each entry is a single-path stroke icon designed to render well at any
 * size with the user's chosen accent color. Paths assume a 24×24 viewBox
 * and stroke="currentColor".
 *
 * Categories let the picker group icons; renderer ignores category.
 */

export type DecorationCategory =
  | "love"
  | "florals"
  | "celebration"
  | "ornament"
  | "wedding";

export interface DecorationIcon {
  id: string;
  label: string;
  category: DecorationCategory;
  /** SVG inner content rendered inside <svg viewBox="0 0 24 24" fill="none"
   *  stroke="currentColor" stroke-width="1.4" stroke-linecap="round"
   *  stroke-linejoin="round">. */
  svg: string;
}

export const DECORATION_CATEGORIES: {
  key: DecorationCategory;
  label: string;
}[] = [
  { key: "love", label: "Aşk & Kalp" },
  { key: "florals", label: "Çiçek & Yaprak" },
  { key: "wedding", label: "Düğün" },
  { key: "celebration", label: "Kutlama" },
  { key: "ornament", label: "Süsleme" },
];

export const DECORATION_ICONS: DecorationIcon[] = [
  // ---------- Love ----------
  {
    id: "heart",
    label: "Kalp",
    category: "love",
    svg: '<path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10Z"/>',
  },
  {
    id: "heart-double",
    label: "Çift Kalp",
    category: "love",
    svg: '<path d="M9 17s-5-3-5-7a3 3 0 0 1 5-2 3 3 0 0 1 5 2c0 4-5 7-5 7Z"/><path d="M15 21s-5-3-5-7a3 3 0 0 1 5-2 3 3 0 0 1 5 2c0 4-5 7-5 7Z"/>',
  },
  {
    id: "infinity-heart",
    label: "Sonsuzluk",
    category: "love",
    svg: '<path d="M3 12c0-2 1.6-3.5 3.5-3.5S10 10 12 12s3.6 3.5 5.5 3.5S21 14 21 12s-1.6-3.5-3.5-3.5S14 10 12 12s-3.6 3.5-5.5 3.5S3 14 3 12Z"/>',
  },
  {
    id: "love-letter",
    label: "Aşk Mektubu",
    category: "love",
    svg: '<rect x="3" y="6" width="18" height="13" rx="1.5"/><path d="m3 7 9 7 9-7"/><path d="M12 4v3"/><path d="m10.5 5.5 1.5-1.5 1.5 1.5"/>',
  },
  {
    id: "ring-pair",
    label: "Yüzük Çifti",
    category: "love",
    svg: '<circle cx="9" cy="14" r="4.5"/><circle cx="15" cy="14" r="4.5"/><path d="M7 9l2-3 2 2"/><path d="M13 8l2-2 2 3"/>',
  },

  // ---------- Florals ----------
  {
    id: "rose",
    label: "Gül",
    category: "florals",
    svg: '<circle cx="12" cy="11" r="3.5"/><path d="M12 7.5c0-1.5-1-2.5-2.5-2.5S7 6 7 7.5"/><path d="M14.5 7.5C14.5 6 15.5 5 17 5"/><path d="M9 14c-2 0-3 1-3 2.5"/><path d="M15 14c2 0 3 1 3 2.5"/><path d="M12 14.5V21"/>',
  },
  {
    id: "tulip",
    label: "Lale",
    category: "florals",
    svg: '<path d="M12 4c-3 2-5 5-5 8 0 1.5 1 2.5 2.5 2.5S12 13.5 12 12c0 1.5 1 2.5 2.5 2.5S17 13.5 17 12c0-3-2-6-5-8Z"/><path d="M12 14.5V21"/>',
  },
  {
    id: "leaf-branch",
    label: "Yapraklı Dal",
    category: "florals",
    svg: '<path d="M5 19c4-4 8-8 14-14"/><path d="M9 15c0-2 1-4 3-4"/><path d="M12 12c0-2 1-4 3-4"/><path d="M15 9c0-2 1-4 3-4"/>',
  },
  {
    id: "olive-branch",
    label: "Zeytin Dalı",
    category: "florals",
    svg: '<path d="M4 20c5-2 11-8 16-16"/><path d="M8 16c1-2 3-3 5-2"/><path d="M11 13c1-2 3-3 5-2"/><path d="M14 10c1-2 3-3 5-2"/>',
  },
  {
    id: "daisy",
    label: "Papatya",
    category: "florals",
    svg: '<circle cx="12" cy="12" r="2"/><path d="M12 4v4"/><path d="M12 16v4"/><path d="M4 12h4"/><path d="M16 12h4"/><path d="m6.3 6.3 2.8 2.8"/><path d="m14.9 14.9 2.8 2.8"/><path d="m6.3 17.7 2.8-2.8"/><path d="m14.9 9.1 2.8-2.8"/>',
  },
  {
    id: "floral-wreath",
    label: "Çiçek Çelengi",
    category: "florals",
    svg: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="5" r="1.4"/><circle cx="19" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/><circle cx="5" cy="12" r="1.4"/><circle cx="17" cy="7" r="1"/><circle cx="17" cy="17" r="1"/><circle cx="7" cy="17" r="1"/><circle cx="7" cy="7" r="1"/>',
  },
  {
    id: "petal-arch",
    label: "Yaprak Kemer",
    category: "florals",
    svg: '<path d="M5 19c0-7 3-12 7-12s7 5 7 12"/><path d="M8 14c0-2 .5-3 1.5-3"/><path d="M14.5 11c1 0 1.5 1 1.5 3"/><path d="M11 9c0-1 .5-2 1-2s1 1 1 2"/>',
  },

  // ---------- Wedding ----------
  {
    id: "wedding-bell",
    label: "Düğün Çanı",
    category: "wedding",
    svg: '<path d="M6 17c0-5 1-10 6-10s6 5 6 10"/><path d="M5 17h14"/><circle cx="12" cy="20" r="1.2"/><path d="M12 5V3"/>',
  },
  {
    id: "champagne",
    label: "Şampanya",
    category: "wedding",
    svg: '<path d="M9 3h6"/><path d="M10 3v3a4 4 0 0 0 4 0V3"/><path d="M11 11h2"/><path d="M12 11v9"/><path d="M9 21h6"/>',
  },
  {
    id: "cake-tier",
    label: "Düğün Pastası",
    category: "wedding",
    svg: '<path d="M12 3v3"/><path d="M10 6h4"/><rect x="9" y="9" width="6" height="3" rx="1"/><rect x="6" y="13" width="12" height="3" rx="1"/><rect x="4" y="17" width="16" height="3" rx="1"/>',
  },
  {
    id: "bouquet",
    label: "Buket",
    category: "wedding",
    svg: '<circle cx="9" cy="8" r="2"/><circle cx="15" cy="8" r="2"/><circle cx="12" cy="11" r="2"/><path d="m10 13-2 8"/><path d="m14 13 2 8"/><path d="M12 13v8"/>',
  },
  {
    id: "veil",
    label: "Gelin Duvağı",
    category: "wedding",
    svg: '<circle cx="12" cy="6" r="3"/><path d="M5 21c2-7 5-10 7-10s5 3 7 10"/>',
  },
  {
    id: "tuxedo",
    label: "Damatlık",
    category: "wedding",
    svg: '<path d="M8 4 12 8l4-4"/><path d="m8 4 1 4-3 12h3l3-12"/><path d="m16 4-1 4 3 12h-3l-3-12"/><circle cx="12" cy="14" r=".7"/><circle cx="12" cy="17" r=".7"/>',
  },
  {
    id: "carriage",
    label: "Düğün Arabası",
    category: "wedding",
    svg: '<path d="M3 16h18"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M5 16c0-4 3-7 7-7s7 3 7 7"/><path d="M12 9V5"/>',
  },

  // ---------- Celebration ----------
  {
    id: "sparkles",
    label: "Parıltı",
    category: "celebration",
    svg: '<path d="M9 3l1.5 4 4 1.5-4 1.5L9 14l-1.5-4L3.5 8.5 7.5 7Z"/><path d="M17 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1Z"/>',
  },
  {
    id: "fireworks",
    label: "Havai Fişek",
    category: "celebration",
    svg: '<circle cx="12" cy="12" r="1"/><path d="M12 4v3"/><path d="M12 17v3"/><path d="M4 12h3"/><path d="M17 12h3"/><path d="m6 6 2 2"/><path d="m16 16 2 2"/><path d="m6 18 2-2"/><path d="m16 8 2-2"/>',
  },
  {
    id: "crown",
    label: "Taç",
    category: "celebration",
    svg: '<path d="M3 8l3 8h12l3-8-5 4-4-7-4 7Z"/><path d="M5 19h14"/>',
  },
  {
    id: "star",
    label: "Yıldız",
    category: "celebration",
    svg: '<path d="m12 3 2.6 6 6.4.6-4.9 4.4 1.5 6.4L12 17l-5.6 3.4 1.5-6.4L3 9.6 9.4 9Z"/>',
  },
  {
    id: "music-note",
    label: "Müzik Notası",
    category: "celebration",
    svg: '<circle cx="7" cy="18" r="2"/><circle cx="17" cy="16" r="2"/><path d="M9 18V5l10-2v13"/>',
  },
  {
    id: "balloon",
    label: "Balon",
    category: "celebration",
    svg: '<path d="M12 13c3 0 5-2.5 5-5.5S15 3 12 3 7 5 7 7.5s2 5.5 5 5.5Z"/><path d="M12 13v3"/><path d="M11 16h2"/><path d="M12 18v3"/>',
  },

  // ---------- Ornament ----------
  {
    id: "diamond",
    label: "Elmas",
    category: "ornament",
    svg: '<path d="M5 9 12 3l7 6-7 12Z"/><path d="M5 9h14"/><path d="m12 3 3 6-3 12-3-12Z"/>',
  },
  {
    id: "monogram-circle",
    label: "Monogram",
    category: "ornament",
    svg: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="6"/>',
  },
  {
    id: "scroll",
    label: "Parşömen",
    category: "ornament",
    svg: '<path d="M5 5h11v14H7a2 2 0 0 1-2-2Z"/><path d="M16 5h3v12h-3"/><path d="M8 9h6"/><path d="M8 13h6"/>',
  },
  {
    id: "ornate-divider",
    label: "Süslü Ayraç",
    category: "ornament",
    svg: '<path d="M3 12h6"/><path d="M15 12h6"/><circle cx="12" cy="12" r="2.5"/><circle cx="12" cy="12" r=".7"/>',
  },
  {
    id: "frame-rect",
    label: "Çerçeve",
    category: "ornament",
    svg: '<rect x="4" y="4" width="16" height="16" rx="1"/><rect x="6.5" y="6.5" width="11" height="11"/>',
  },
  {
    id: "compass-rose",
    label: "Pusula",
    category: "ornament",
    svg: '<circle cx="12" cy="12" r="9"/><path d="m12 5 1.5 5.5L19 12l-5.5 1.5L12 19l-1.5-5.5L5 12l5.5-1.5Z"/>',
  },
  {
    id: "lantern",
    label: "Fener",
    category: "ornament",
    svg: '<path d="M12 3v2"/><path d="M9 5h6l-1 2H10Z"/><rect x="8" y="7" width="8" height="11" rx="1"/><path d="M9 18h6l-.5 2h-5Z"/><path d="M10 10v5"/><path d="M14 10v5"/>',
  },
  {
    id: "feather",
    label: "Tüy",
    category: "ornament",
    svg: '<path d="M5 19c8 0 14-6 14-14C11 5 5 11 5 19Z"/><path d="M5 19l8-8"/>',
  },
];

export function findDecoration(id: string): DecorationIcon | undefined {
  return DECORATION_ICONS.find((i) => i.id === id);
}

export function decorationsByCategory(
  category: DecorationCategory,
): DecorationIcon[] {
  return DECORATION_ICONS.filter((i) => i.category === category);
}
