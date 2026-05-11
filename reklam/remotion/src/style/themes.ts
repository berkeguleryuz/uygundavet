// Theme catalog mirrors /public/temalar — used by the theme mosaic / reveal grids.
export type Theme = {
  key: string;
  name: string;
  src: string;
  isImage: boolean;
  tagline: string;
  accent: string;
};

export const THEMES: Theme[] = [
  {
    key: "crystal",
    name: "Crystal",
    src: "temalar/crystal.png",
    isImage: true,
    tagline: "Şeffaf zarafet",
    accent: "#9bb7c4",
  },
  {
    key: "grow",
    name: "Grow",
    src: "temalar/grow.png",
    isImage: true,
    tagline: "Yeşeren bir başlangıç",
    accent: "#8a9a7a",
  },
  {
    key: "sunset",
    name: "Sunset",
    src: "temalar/sunset.mp4",
    isImage: false,
    tagline: "Altın saat",
    accent: "#e0a36a",
  },
  {
    key: "rose",
    name: "Rose",
    src: "temalar/rose.mp4",
    isImage: false,
    tagline: "Yumuşak romantizm",
    accent: "#c89a93",
  },
  {
    key: "pearl",
    name: "Pearl",
    src: "temalar/pearl.mp4",
    isImage: false,
    tagline: "İncimsi minimalizm",
    accent: "#e6dfce",
  },
  {
    key: "ocean",
    name: "Ocean",
    src: "temalar/ocean.mp4",
    isImage: false,
    tagline: "Derin sakinlik",
    accent: "#5a7a86",
  },
  {
    key: "golden",
    name: "Golden",
    src: "temalar/golden.mp4",
    isImage: false,
    tagline: "Klasik ihtişam",
    accent: "#b89968",
  },
  {
    key: "garden",
    name: "Garden",
    src: "temalar/garden.mp4",
    isImage: false,
    tagline: "Bahçe nostaljisi",
    accent: "#7a8a6a",
  },
];

export const HERO_VIDEOS = {
  hero: "hero.mp4",
  hero2: "hero2.mp4",
  kadinerkek: "kadinerkek-compressed.mp4",
  yuzuk: "yuzuk.mp4",
  kutu: "kutu.mp4",
  tuana: "tuanaates.mp4",
  kelebek: "crystal/kelebek.mp4",
  crystalBox: "crystal/kutu.mp4",
  crystalRing: "crystal/yuzuk.mp4",
} as const;

export const STILL_IMAGES = {
  weddingPhoto: "dugunfoto.jpg",
  brandText: "brand-text.png",
  emailBrand: "email-brand.png",
  logoGold: "logo-gold-transparent.png",
  logoGoldFlat: "logo-gold.png",
  appleIcon: "apple-touch-icon.png",
} as const;

export const MUSIC = {
  warm: "musics/music1.mp3",
  cinematic: "musics/music2.mp3",
} as const;
