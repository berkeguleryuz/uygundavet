export type DesignCategory =
  | "wedding"
  | "engagement"
  | "circumcision"
  | "birthday"
  | "business";

export const CATEGORIES: { key: DesignCategory | "all"; label: string }[] = [
  { key: "wedding", label: "Düğün" },
  { key: "engagement", label: "Nikah" },
  { key: "circumcision", label: "Sünnet Düğünü" },
  { key: "birthday", label: "Çocuk Doğum Günü" },
  { key: "business", label: "İşyeri Açılışı" },
  { key: "all", label: "Tüm Kategoriler" },
];

export type DesignTheme =
  | "ivory-daisy"
  | "blush-rose"
  | "noir-gold"
  | "sage-botanical"
  | "terracotta"
  | "midnight-gold"
  | "pastel-mint"
  | "blush-gold"
  | "cobalt-classic"
  | "sand-minimal"
  | "forest-deep"
  | "lavender-soft"
  | "bronze-boho"
  | "ocean-modern"
  | "cream-elegance"
  | "rose-gold-luxe";

/**
 * Distinct top-of-card layout variants. Each sample references one of these
 * so the preview + real card renderer can draw a visibly different frame
 * without every design needing a custom component.
 *
 *  - classic:         simple frame, text centered, decorative strokes
 *  - arch:            tall arched (cathedral) frame behind the names
 *  - photo-top:       hero photograph occupies top half, text sits below
 *  - photo-full:      photo fills the whole card with soft dark overlay
 *  - floral-crown:    arc of florals across the top
 *  - monogram-circle: circular monogram badge + names orbiting it
 *  - bold-type:       oversized display names, minimal ornament
 *  - botanical-frame: leaves growing along the vertical edges
 */
export type DesignLayout =
  | "classic"
  | "arch"
  | "photo-top"
  | "photo-full"
  | "floral-crown"
  | "monogram-circle"
  | "bold-type"
  | "botanical-frame";

export interface DesignSample {
  id: string;
  code: string; // e.g. "GPCU"
  name: string; // style name (Türkçe)
  category: DesignCategory;
  theme: DesignTheme;
  layout: DesignLayout;
  bg: string;
  accent: string;
  textColor: string;
  decorative: "daisy" | "rose" | "gold" | "none";
  envelopeColor: string;
  liningBg: string;
  liningPattern: "daisy" | "rose" | "gold" | "none" | "chevron";
  flapColor?: string;
  /** Optional hero image used by photo-top / photo-full layouts. */
  photoUrl?: string;
  sampleBride: string;
  sampleGroom: string;
  subtitle: string;
}

/** Build a full stock URL for a known Unsplash photo id. */
function photo(id: string): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;
}

export const DESIGN_SAMPLES: DesignSample[] = [
  {
    id: "d-1",
    code: "GPCU",
    name: "Papatya Esintisi",
    category: "wedding",
    theme: "ivory-daisy",
    layout: "floral-crown",
    bg: "#fbf7ee",
    accent: "#c9a35a",
    textColor: "#4a3f2e",
    decorative: "daisy",
    envelopeColor: "#f5f1e8",
    liningBg: "#1f1c17",
    liningPattern: "daisy",
    sampleBride: "Havva",
    sampleGroom: "İbrahim",
    subtitle: "Aşkın Başladığı Gün",
  },
  {
    id: "d-2",
    code: "KPTZ",
    name: "Monogram Arch",
    category: "wedding",
    theme: "sand-minimal",
    layout: "arch",
    bg: "#f3efe6",
    accent: "#7d6b4f",
    textColor: "#3c3528",
    decorative: "gold",
    envelopeColor: "#efe9dc",
    liningBg: "#2a241b",
    liningPattern: "gold",
    sampleBride: "Fadime",
    sampleGroom: "Osman",
    subtitle: "Aşkın Ritmi",
  },
  {
    id: "d-3",
    code: "PBMH",
    name: "Botanik Sade",
    category: "engagement",
    theme: "sage-botanical",
    layout: "botanical-frame",
    bg: "#eef1ea",
    accent: "#5a6b4d",
    textColor: "#32392d",
    decorative: "rose",
    envelopeColor: "#eaede3",
    liningBg: "#2d3628",
    liningPattern: "rose",
    sampleBride: "Yağmur",
    sampleGroom: "Ahmet",
    subtitle: "Birlikte Daha Güçlü",
  },
  {
    id: "d-4",
    code: "PNBU",
    name: "Altın Buket",
    category: "wedding",
    theme: "blush-gold",
    layout: "floral-crown",
    bg: "#faf3ea",
    accent: "#b38a4a",
    textColor: "#4a3822",
    decorative: "gold",
    envelopeColor: "#f5eddd",
    liningBg: "#1b160e",
    liningPattern: "gold",
    sampleBride: "Ela",
    sampleGroom: "İbrahim",
    subtitle: "Birlikte Daha Güçlü",
  },
  {
    id: "d-5",
    code: "VIED",
    name: "Arch Klasik",
    category: "wedding",
    theme: "cream-elegance",
    layout: "arch",
    bg: "#faf5e8",
    accent: "#a78a3e",
    textColor: "#3e3723",
    decorative: "gold",
    envelopeColor: "#f6eed9",
    liningBg: "#1f1a0e",
    liningPattern: "gold",
    sampleBride: "Sultan",
    sampleGroom: "Yusuf",
    subtitle: "Sonsuza Kadar Evet",
  },
  {
    id: "d-6",
    code: "PZVM",
    name: "Boho Hatıra",
    category: "engagement",
    theme: "bronze-boho",
    layout: "photo-top",
    bg: "#efe4d2",
    accent: "#8a5a2b",
    textColor: "#3d2a15",
    decorative: "rose",
    envelopeColor: "#ecdcc2",
    liningBg: "#3a2414",
    liningPattern: "rose",
    photoUrl: photo("photo-1525772764200-be829a350797"),
    sampleBride: "Deniz",
    sampleGroom: "Kaan",
    subtitle: "Birlikte Yürüyoruz",
  },
  {
    id: "d-7",
    code: "LBTR",
    name: "İnce Çember",
    category: "engagement",
    theme: "pastel-mint",
    layout: "monogram-circle",
    bg: "#eef4ee",
    accent: "#4c7a66",
    textColor: "#2a3a32",
    decorative: "none",
    envelopeColor: "#e7efe7",
    liningBg: "#24352d",
    liningPattern: "chevron",
    sampleBride: "Ayşe",
    sampleGroom: "Rıza",
    subtitle: "İki Kalp Bir Yürek",
  },
  {
    id: "d-8",
    code: "JTSY",
    name: "Işıltı",
    category: "wedding",
    theme: "rose-gold-luxe",
    layout: "photo-full",
    bg: "#f7eee4",
    accent: "#b87a56",
    textColor: "#4a2f20",
    decorative: "gold",
    envelopeColor: "#f2e6d4",
    liningBg: "#2a1a10",
    liningPattern: "gold",
    photoUrl: photo("photo-1519741497674-611481863552"),
    sampleBride: "Belinay",
    sampleGroom: "Salih",
    subtitle: "Birlikte Daha Güçlü",
  },
  {
    id: "d-9",
    code: "PJNT",
    name: "Gece Altını",
    category: "wedding",
    theme: "midnight-gold",
    layout: "bold-type",
    bg: "#141210",
    accent: "#d4a94a",
    textColor: "#f0e4c2",
    decorative: "gold",
    envelopeColor: "#1a1713",
    liningBg: "#f0e4c2",
    liningPattern: "gold",
    flapColor: "#1a1713",
    sampleBride: "Şerife",
    sampleGroom: "Berat",
    subtitle: "Aşkın Ritmi",
  },
  {
    id: "d-10",
    code: "DNRP",
    name: "Masal",
    category: "wedding",
    theme: "cream-elegance",
    layout: "arch",
    bg: "#fbf5ea",
    accent: "#a88442",
    textColor: "#3f3120",
    decorative: "gold",
    envelopeColor: "#f6ecd6",
    liningBg: "#211a0f",
    liningPattern: "gold",
    sampleBride: "Masalımız",
    sampleGroom: "Başlıyor",
    subtitle: "Hayalimizdeki Gün",
  },
  {
    id: "d-11",
    code: "CKMR",
    name: "Küçük Sultan",
    category: "circumcision",
    theme: "cobalt-classic",
    layout: "classic",
    bg: "#e9edf5",
    accent: "#2e4a8a",
    textColor: "#16213f",
    decorative: "gold",
    envelopeColor: "#dde3ef",
    liningBg: "#0f1a36",
    liningPattern: "gold",
    sampleBride: "Ömer",
    sampleGroom: "Sünnet",
    subtitle: "Mutlu Günümüze Buyurun",
  },
  {
    id: "d-12",
    code: "ASLN",
    name: "Aslan Yürekli",
    category: "circumcision",
    theme: "noir-gold",
    layout: "bold-type",
    bg: "#15130f",
    accent: "#e0b85a",
    textColor: "#f3e4b8",
    decorative: "gold",
    envelopeColor: "#1a1713",
    liningBg: "#e0b85a",
    liningPattern: "gold",
    flapColor: "#1a1713",
    sampleBride: "Ali",
    sampleGroom: "Prensi",
    subtitle: "Şimdi Koca Adam",
  },
  {
    id: "d-13",
    code: "MINI",
    name: "Pamuk Şeker",
    category: "birthday",
    theme: "lavender-soft",
    layout: "floral-crown",
    bg: "#f4eaf4",
    accent: "#a56bb5",
    textColor: "#4a2e50",
    decorative: "rose",
    envelopeColor: "#efdfef",
    liningBg: "#4a2e50",
    liningPattern: "rose",
    sampleBride: "Zeynep",
    sampleGroom: "5 Yaş",
    subtitle: "Neşe Dolu Bir Gün",
  },
  {
    id: "d-14",
    code: "CIRC",
    name: "Sirk Zamanı",
    category: "birthday",
    theme: "terracotta",
    layout: "photo-top",
    bg: "#f5ded0",
    accent: "#c45a3e",
    textColor: "#4a2218",
    decorative: "none",
    envelopeColor: "#f0d2bf",
    liningBg: "#4a2218",
    liningPattern: "chevron",
    photoUrl: photo("photo-1527529482837-4698179dc6ce"),
    sampleBride: "Emir",
    sampleGroom: "Doğum Günü",
    subtitle: "Eğlence Başlasın",
  },
  {
    id: "d-15",
    code: "LINK",
    name: "Modern Açılış",
    category: "business",
    theme: "ocean-modern",
    layout: "bold-type",
    bg: "#e7eff3",
    accent: "#1f5a7a",
    textColor: "#0f2a3a",
    decorative: "none",
    envelopeColor: "#dbe6ed",
    liningBg: "#0f2a3a",
    liningPattern: "chevron",
    sampleBride: "Atölye",
    sampleGroom: "İstanbul",
    subtitle: "Açılışa Davetlisiniz",
  },
  {
    id: "d-16",
    code: "PROA",
    name: "Prestij",
    category: "business",
    theme: "forest-deep",
    layout: "classic",
    bg: "#e4ece5",
    accent: "#214735",
    textColor: "#14291e",
    decorative: "gold",
    envelopeColor: "#d9e4db",
    liningBg: "#14291e",
    liningPattern: "gold",
    sampleBride: "Brand&Co",
    sampleGroom: "Lansman",
    subtitle: "Yeni Bir Başlangıç",
  },

  /* ── New layout-driven variants ───────────────────────────────── */
  {
    id: "d-17",
    code: "ARCH",
    name: "Katedral Arch",
    category: "wedding",
    theme: "cream-elegance",
    layout: "arch",
    bg: "#f4ebd8",
    accent: "#8c6f3a",
    textColor: "#3a2e18",
    decorative: "gold",
    envelopeColor: "#efe4c9",
    liningBg: "#1b140b",
    liningPattern: "gold",
    sampleBride: "Nisa",
    sampleGroom: "Mert",
    subtitle: "Yolumuz Bir Oldu",
  },
  {
    id: "d-18",
    code: "PHFR",
    name: "Fotoğraf Çerçevesi",
    category: "wedding",
    theme: "blush-rose",
    layout: "photo-top",
    bg: "#fbeae2",
    accent: "#b85a6b",
    textColor: "#4a2026",
    decorative: "rose",
    envelopeColor: "#f5ddd4",
    liningBg: "#3a1620",
    liningPattern: "rose",
    photoUrl: photo("photo-1523348837708-15d4a09cfac2"),
    sampleBride: "Elif",
    sampleGroom: "Emre",
    subtitle: "Bugün Başlıyoruz",
  },
  {
    id: "d-19",
    code: "FULL",
    name: "Tam Portre",
    category: "wedding",
    theme: "bronze-boho",
    layout: "photo-full",
    bg: "#2b1e12",
    accent: "#e0bd87",
    textColor: "#f5e8cf",
    decorative: "gold",
    envelopeColor: "#ecdcc2",
    liningBg: "#e0bd87",
    liningPattern: "gold",
    flapColor: "#ecdcc2",
    photoUrl: photo("photo-1549417229-7686ac5595fd"),
    sampleBride: "Ceren",
    sampleGroom: "Barış",
    subtitle: "Bir Macera",
  },
  {
    id: "d-20",
    code: "MONO",
    name: "Dairesel Monogram",
    category: "wedding",
    theme: "sand-minimal",
    layout: "monogram-circle",
    bg: "#f0eadd",
    accent: "#6f5a33",
    textColor: "#2b2415",
    decorative: "gold",
    envelopeColor: "#eadfc5",
    liningBg: "#1d1709",
    liningPattern: "gold",
    sampleBride: "Aylin",
    sampleGroom: "Kerem",
    subtitle: "İki Yolda Bir Son",
  },
  {
    id: "d-21",
    code: "BOTF",
    name: "Botanik Kenar",
    category: "engagement",
    theme: "sage-botanical",
    layout: "botanical-frame",
    bg: "#e9efe1",
    accent: "#465c3a",
    textColor: "#1f2b18",
    decorative: "rose",
    envelopeColor: "#dfe7d4",
    liningBg: "#1a2213",
    liningPattern: "rose",
    sampleBride: "Zehra",
    sampleGroom: "Cem",
    subtitle: "Yaşamımız Çiçeklensin",
  },
  {
    id: "d-22",
    code: "BOLD",
    name: "Büyük Tipografi",
    category: "business",
    theme: "ocean-modern",
    layout: "bold-type",
    bg: "#f4f4f4",
    accent: "#101820",
    textColor: "#101820",
    decorative: "none",
    envelopeColor: "#e8e8e8",
    liningBg: "#101820",
    liningPattern: "chevron",
    sampleBride: "Studio",
    sampleGroom: "No.42",
    subtitle: "Grand Opening",
  },
  {
    id: "d-23",
    code: "CRWN",
    name: "Çiçekli Taç",
    category: "birthday",
    theme: "blush-rose",
    layout: "floral-crown",
    bg: "#fdeeeb",
    accent: "#c27a6d",
    textColor: "#4a1f18",
    decorative: "rose",
    envelopeColor: "#f8dfd9",
    liningBg: "#4a1f18",
    liningPattern: "rose",
    sampleBride: "Mira",
    sampleGroom: "3 Yaş",
    subtitle: "Minik Bir Kutlama",
  },
  {
    id: "d-24",
    code: "ARPH",
    name: "Arch + Fotoğraf",
    category: "wedding",
    theme: "blush-gold",
    layout: "photo-top",
    bg: "#fbf1e5",
    accent: "#a77a3e",
    textColor: "#3d2a14",
    decorative: "gold",
    envelopeColor: "#f4e6cd",
    liningBg: "#2a1c0c",
    liningPattern: "gold",
    photoUrl: photo("photo-1537907510278-10acdb198d0f"),
    sampleBride: "İrem",
    sampleGroom: "Doruk",
    subtitle: "Birlikte Daha Güçlü",
  },
];
