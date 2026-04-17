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
  {
    key: "garden" as const,
    image: "/temalar/garden.jpg",
  },
  {
    key: "ocean" as const,
    image: "/temalar/ocean.jpg",
  },
  {
    key: "golden" as const,
    image: "/temalar/golden.jpg",
  },
] as const;

export type ThemeKey = "grow" | "pearl" | "rose" | "sunset" | "crystal" | "garden" | "ocean" | "golden" | "custom";
