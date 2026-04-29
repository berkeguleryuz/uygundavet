import type { Block, BlockType, HeroVariant, InvitationDoc, Locale } from "@davety/schema";

export type PremiumTemplateCategory =
  | "wedding"
  | "engagement"
  | "henna"
  | "circumcision"
  | "birthday"
  | "baby"
  | "celebration"
  | "business";

export const PREMIUM_TEMPLATE_CATEGORIES: {
  key: PremiumTemplateCategory;
  label: string;
}[] = [
  { key: "wedding", label: "Düğün" },
  { key: "engagement", label: "Nişan / Nikah" },
  { key: "henna", label: "Kına" },
  { key: "circumcision", label: "Sünnet" },
  { key: "birthday", label: "Doğum Günü" },
  { key: "baby", label: "Baby Shower" },
  { key: "celebration", label: "Özel Kutlama" },
  { key: "business", label: "Açılış / Lansman" },
];

export interface PremiumTemplate {
  slug: string;
  title: string;
  category: PremiumTemplateCategory;
  description: string;
  palette: {
    bg: string;
    accent: string;
    text: string;
    page: string;
    envelope: string;
    flap: string;
    lining: string;
    pattern: "daisy" | "rose" | "gold" | "none" | "chevron";
  };
  hero: {
    variant: HeroVariant;
    decorative: "daisy" | "rose" | "gold" | "none";
    primary: string;
    secondary: string;
    subtitle: string;
    description: string;
    photoUrl?: string;
  };
  program: { time: string; label: string; icon?: string }[];
  assets: string[];
  previewUrl: string;
}

type AssetGroup =
  | "floral-corners"
  | "botanical-frames"
  | "gold-ornaments"
  | "wax-seals"
  | "ribbons"
  | "kids-party"
  | "baby-shower"
  | "circumcision-classic"
  | "business-luxe"
  | "monograms"
  | "dividers"
  | "badges";

const PALETTES = [
  ["#fbf7ef", "#b8914b", "#3f3322", "#2a241b", "#f2eadc", "#ead9b8", "#211a10", "gold"],
  ["#f8ece8", "#b86c73", "#4a2228", "#3b1d23", "#f4ddd9", "#efc8c5", "#35181d", "rose"],
  ["#edf2e8", "#536b45", "#25311f", "#182112", "#e2eadb", "#d1dec6", "#1d2718", "rose"],
  ["#171412", "#d4af62", "#f5e6c8", "#0f0d0b", "#211d19", "#171412", "#f5e6c8", "gold"],
  ["#f1e2d2", "#9a6235", "#3a2518", "#332014", "#ead6bf", "#dfc2a5", "#2f1d12", "chevron"],
  ["#eaf0f6", "#31528f", "#182541", "#10192e", "#dfe7f1", "#cfdced", "#10192e", "gold"],
  ["#f3edf8", "#8a62a8", "#3a2849", "#2b1e35", "#eadff2", "#decdec", "#3a2849", "rose"],
  ["#e8f1f4", "#1f6482", "#102c3b", "#0e2633", "#dce9ee", "#c7dce5", "#102c3b", "chevron"],
] as const;

const CATEGORY_PLANS: {
  category: PremiumTemplateCategory;
  count: number;
  names: string[];
  people: [string, string][];
  subtitles: string[];
  assetBias: AssetGroup[];
}[] = [
  {
    category: "wedding",
    count: 12,
    names: ["Altın Vals", "İpek Bahçe", "Noir Nikah", "Porselen Gül", "Katedral Işık", "Saklı Bahar", "Ay Işığı", "Zarif Monogram", "Beyaz Orkide", "Sonsuz Çizgi", "Şampanya Tonu", "İnci Kemer"],
    people: [["Ela", "Mert"], ["Duru", "Kaan"], ["Selin", "Aras"], ["Lina", "Emir"]],
    subtitles: ["Sonsuza Kadar Evet", "Bir Ömürlük Başlangıç", "Aşkın En Güzel Hali"],
    assetBias: ["floral-corners", "botanical-frames", "gold-ornaments", "wax-seals", "monograms", "dividers"],
  },
  {
    category: "engagement",
    count: 8,
    names: ["Sage Söz", "Gül Nikahı", "İnce Çember", "Soft Yemin", "Botanik İmza", "Krem Tören", "Modern Nişan", "Zeytin Dalı"],
    people: [["Ayça", "Ege"], ["Nehir", "Deniz"], ["Mina", "Bora"], ["İrem", "Can"]],
    subtitles: ["Sözümüz Bir", "İki Kalp Bir Yol", "Nikahımıza Davetlisiniz"],
    assetBias: ["botanical-frames", "floral-corners", "monograms", "dividers", "badges"],
  },
  {
    category: "henna",
    count: 5,
    names: ["Kına Gecesi", "Bordo Dantel", "Altın Bindallı", "Nar Çiçeği", "Gece Sürmesi"],
    people: [["Zeynep", "Kına"], ["Melis", "Kına"], ["Aslı", "Kına"]],
    subtitles: ["Kınamıza Bekleriz", "Gelenek ve Neşe", "Bu Gece Bizim"],
    assetBias: ["gold-ornaments", "ribbons", "badges", "wax-seals", "dividers"],
  },
  {
    category: "circumcision",
    count: 6,
    names: ["Küçük Şehzade", "Mavi Kaftan", "Altın Sancak", "Saray Daveti", "Hilal Töreni", "Prens Günü"],
    people: [["Ömer", "Sünnet"], ["Ali", "Şehzade"], ["Eymen", "Prens"]],
    subtitles: ["Mutlu Günümüze Davetlisiniz", "Şimdi Koca Adam", "Ailemizin Özel Günü"],
    assetBias: ["circumcision-classic", "gold-ornaments", "badges", "dividers", "ribbons"],
  },
  {
    category: "birthday",
    count: 6,
    names: ["Pastel Parti", "Mini Sirk", "Yıldız Yaş", "Balon Bahçesi", "Neşeli Taç", "Şeker Rüya"],
    people: [["Mira", "3 Yaş"], ["Emir", "5 Yaş"], ["Ada", "7 Yaş"]],
    subtitles: ["Eğlence Başlasın", "Neşe Dolu Bir Gün", "Kutlamaya Bekleriz"],
    assetBias: ["kids-party", "badges", "ribbons", "dividers", "floral-corners"],
  },
  {
    category: "baby",
    count: 4,
    names: ["Pamuk Bulut", "Minik Mucize", "Ay Bebek", "Tatlı Bekleyiş"],
    people: [["Baby", "Shower"], ["Minik", "Misafir"], ["Hoş", "Geldin"]],
    subtitles: ["Tatlı Bekleyişimize Davetlisiniz", "Minik Bir Kutlama", "Sevincimizi Paylaşalım"],
    assetBias: ["baby-shower", "ribbons", "badges", "floral-corners", "dividers"],
  },
  {
    category: "celebration",
    count: 3,
    names: ["Mezuniyet Işığı", "Gala Akşamı", "Özel Davet"],
    people: [["Mezuniyet", "Töreni"], ["Gala", "Gecesi"], ["Özel", "Kutlama"]],
    subtitles: ["Başarıyı Kutluyoruz", "Bu Gece Birlikteyiz", "Davetimize Bekleriz"],
    assetBias: ["badges", "gold-ornaments", "ribbons", "dividers", "monograms"],
  },
  {
    category: "business",
    count: 4,
    names: ["Prestij Açılış", "Studio Launch", "Noir Lansman", "Kurumsal İmza"],
    people: [["Atölye", "İstanbul"], ["Studio", "No.42"], ["Brand", "Launch"]],
    subtitles: ["Açılışa Davetlisiniz", "Yeni Bir Başlangıç", "Lansmanımıza Bekleriz"],
    assetBias: ["business-luxe", "monograms", "gold-ornaments", "badges", "dividers"],
  },
];

const HERO_VARIANTS: HeroVariant[] = [
  "floral-crown",
  "arch",
  "botanical-frame",
  "monogram-circle",
  "bold-type",
  "classic",
  "photo-top",
  "photo-full",
];

const DECORATIVES: PremiumTemplate["hero"]["decorative"][] = [
  "gold",
  "rose",
  "daisy",
  "none",
];

export const PREMIUM_TEMPLATES: PremiumTemplate[] = buildTemplates();

export function buildPremiumTemplateDoc(
  template: PremiumTemplate,
  args: { weddingDate: string; weddingTime: string; locale?: Locale },
): InvitationDoc {
  const locale = args.locale ?? "tr";
  const targetIso = `${args.weddingDate}T${args.weddingTime}:00`;
  const now = "2026-04-27T00:00:00.000Z";

  const blocks: Block[] = [
    block(template, "hero", {
      brideName: template.hero.primary,
      groomName: template.hero.secondary,
      subtitle: template.hero.subtitle,
      description: template.hero.description,
      variant: template.hero.variant,
      decorative: template.hero.decorative,
      accent: template.palette.accent,
      photoUrl: template.hero.photoUrl,
    }, { align: "center", color: template.palette.text, fontFamily: "Merienda" }),
    block(template, "decoration", {
      iconKey: decorationIcon(template.category),
      sizePx: 54,
      color: template.palette.accent,
      align: "center",
    }, { align: "center", paddingTop: 0, paddingBottom: 0 }),
    block(template, "countdown", {
      targetIso,
      labels: { days: "Gün", hours: "Saat", minutes: "Dakika", seconds: "Saniye" },
    }, { align: "center" }),
    block(template, "families", {
      bride: { title: familyTitle(template.category, "left"), members: [] },
      groom: { title: familyTitle(template.category, "right"), members: [] },
    }, { align: "center" }),
    block(template, "venue", {
      venueName: venueTitle(template.category),
      venueAddress: "",
      reminderEnabled: true,
    }, { align: "center" }, true),
    block(template, "event_program", { items: template.program }, { align: "center" }),
    block(template, "rsvp_form", {
      enabled: true,
      note: rsvpNote(template.category),
    }, { align: "center" }, true),
    block(template, "memory_book", {
      enabled: true,
      prompt: memoryPrompt(template.category),
    }, { align: "center" }, true),
    block(template, "gallery", { items: [] }, { align: "center" }, true),
    block(template, "footer", { text: "davety.app" }, { align: "center" }),
  ];

  return {
    meta: {
      createdAt: now,
      updatedAt: now,
      weddingDate: args.weddingDate,
      weddingTime: args.weddingTime,
      status: "draft",
      locale,
    },
    theme: {
      bgColor: template.palette.bg,
      accentColor: template.palette.accent,
      pageBgColor: template.palette.page,
      envelope: {
        color: template.palette.envelope,
        flapColor: template.palette.flap,
        liningBg: template.palette.lining,
        liningPattern: template.palette.pattern,
        stampEnabled: true,
        stampColor: template.palette.accent,
        stampLabel: initials(template.hero.primary, template.hero.secondary),
      },
    },
    blocks,
  };
}

function buildTemplates(): PremiumTemplate[] {
  const templates: PremiumTemplate[] = [];
  let index = 0;

  for (const plan of CATEGORY_PLANS) {
    for (let i = 0; i < plan.count; i += 1) {
      const palette = PALETTES[(index + i) % PALETTES.length];
      const people = plan.people[i % plan.people.length];
      const slug = `${plan.category}-${slugify(plan.names[i])}`;
      const assetSeed = index + i + 1;
      const assets = plan.assetBias.flatMap((group, groupIndex) => [
        assetPath(group, assetSeed + groupIndex),
        assetPath(group, assetSeed + groupIndex + 48),
      ]);

      templates.push({
        slug,
        title: plan.names[i],
        category: plan.category,
        description: `${plan.names[i]} premium ${categoryLabel(plan.category).toLowerCase()} davetiyesi.`,
        palette: {
          bg: palette[0],
          accent: palette[1],
          text: palette[2],
          page: palette[3],
          envelope: palette[4],
          flap: palette[5],
          lining: palette[6],
          pattern: palette[7],
        },
        hero: {
          variant: HERO_VARIANTS[(index + i) % HERO_VARIANTS.length],
          decorative: DECORATIVES[(index + i) % DECORATIVES.length],
          primary: people[0],
          secondary: people[1],
          subtitle: plan.subtitles[i % plan.subtitles.length],
          description: descriptionFor(plan.category),
          photoUrl: photoFor(index + i),
        },
        program: programFor(plan.category),
        assets,
        previewUrl: `/assets/templates/previews/${slug}.svg`,
      });
    }
    index += plan.count;
  }

  return templates;
}

function block<T extends Record<string, unknown>>(
  template: PremiumTemplate,
  type: BlockType,
  data: T,
  style: Block["style"],
  locked = false,
): Block<T> {
  return {
    id: `${template.slug}-${type}`,
    type,
    visible: true,
    locked: locked || undefined,
    data,
    style,
  };
}

function assetPath(group: AssetGroup, seed: number) {
  const number = String(((seed - 1) % 12) + 1).padStart(2, "0");
  return `/assets/templates/${group}/${group}-${number}.svg`;
}

function slugify(value: string) {
  return value
    .toLocaleLowerCase("tr")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function categoryLabel(category: PremiumTemplateCategory) {
  return PREMIUM_TEMPLATE_CATEGORIES.find((item) => item.key === category)?.label ?? category;
}

function descriptionFor(category: PremiumTemplateCategory) {
  if (category === "business") return "Yeni başlangıcınızı seçkin bir davetle duyurun.";
  if (category === "birthday") return "Neşeli anları zarif bir kutlama diliyle paylaşın.";
  if (category === "circumcision") return "Ailenizin özel gününde sevdiklerinizi yanınızda görmekten mutluluk duyarız.";
  if (category === "baby") return "Minik mutluluğumuzun heyecanını birlikte paylaşalım.";
  if (category === "henna") return "Gelenek, müzik ve neşeyle dolu bu geceye davetlisiniz.";
  if (category === "celebration") return "Bu anlamlı günü birlikte kutlamak için sizi aramızda görmek isteriz.";
  return "Bu özel günde sizi aramızda görmekten mutluluk duyarız.";
}

function programFor(category: PremiumTemplateCategory) {
  if (category === "business") {
    return [
      { time: "18:30", label: "Karşılama", icon: "sparkles" },
      { time: "19:00", label: "Açılış Konuşması", icon: "mic" },
      { time: "19:30", label: "Tanıtım", icon: "star" },
      { time: "20:00", label: "Kokteyl", icon: "champagne" },
    ];
  }
  if (category === "birthday" || category === "baby") {
    return [
      { time: "14:00", label: "Karşılama", icon: "balloon" },
      { time: "15:00", label: "Oyunlar", icon: "sparkles" },
      { time: "16:00", label: "Pasta", icon: "cake" },
      { time: "17:00", label: "Hatıra Fotoğrafı", icon: "star" },
    ];
  }
  return [
    { time: "18:00", label: "Karşılama", icon: "sparkles" },
    { time: "19:00", label: "Tören", icon: "ring" },
    { time: "20:00", label: "Yemek", icon: "food" },
    { time: "21:00", label: "Müzik", icon: "music" },
  ];
}

function venueTitle(category: PremiumTemplateCategory) {
  if (category === "business") return "Etkinlik Alanı";
  if (category === "birthday" || category === "baby") return "Kutlama Mekanı";
  return "Davet Mekanı";
}

function rsvpNote(category: PremiumTemplateCategory) {
  if (category === "business") return "Katılım durumunuzu paylaşarak hazırlıklarımızı tamamlamamıza yardımcı olun.";
  return "Katılım durumunuzu bizimle paylaşmanız bizi mutlu eder.";
}

function memoryPrompt(category: PremiumTemplateCategory) {
  if (category === "business") return "Etkinlikle ilgili notlarınızı ve iyi dileklerinizi paylaşabilirsiniz.";
  return "Anılarınızı, dileklerinizi ve güzel mesajlarınızı bu alanda paylaşabilirsiniz.";
}

function familyTitle(category: PremiumTemplateCategory, side: "left" | "right") {
  if (category === "business") return side === "left" ? "Ev Sahibi" : "Ekip";
  if (category === "birthday" || category === "baby") return side === "left" ? "Aile" : "Sevdiklerimiz";
  return side === "left" ? "Ailemiz" : "Dostlarımız";
}

function decorationIcon(category: PremiumTemplateCategory) {
  if (category === "business") return "diamond";
  if (category === "birthday") return "balloon";
  if (category === "baby") return "star";
  if (category === "circumcision") return "crown";
  if (category === "henna") return "lantern";
  return "ornate-divider";
}

function initials(primary: string, secondary: string) {
  return `${primary[0] ?? ""}&${secondary[0] ?? ""}`.toLocaleUpperCase("tr");
}

function photoFor(index: number) {
  const photos = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1525772764200-be829a350797?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80",
  ];
  return photos[index % photos.length];
}
