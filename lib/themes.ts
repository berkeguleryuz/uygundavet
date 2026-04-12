export const THEME_OPTIONS = [
  {
    key: "rose" as const,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  },
  {
    key: "sunset" as const,
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
  },
  {
    key: "pearl" as const,
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
  },
  {
    key: "crystal" as const,
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
  },
] as const;

export type ThemeKey = "rose" | "sunset" | "pearl" | "crystal" | "custom";
