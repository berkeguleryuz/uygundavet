export const THEME_OPTIONS = [
  {
    key: "grow" as const,
    image: "/temalar/grow.jpg",
  },
  {
    key: "pearl" as const,
    image: "/temalar/pearl.mp4",
    video: true,
  },
  {
    key: "rose" as const,
    image: "/temalar/rose.mp4",
    video: true,
  },
  {
    key: "sunset" as const,
    image: "/temalar/sunset.mp4",
    video: true,
  },
  {
    key: "crystal" as const,
    image: "/temalar/crystal.png",
  },
] as const;

export type ThemeKey = "grow" | "pearl" | "rose" | "sunset" | "crystal" | "custom";
