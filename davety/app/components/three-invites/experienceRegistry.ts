export type InviteExperienceRoute =
  | "scroll"
  | "ring-box"
  | "glass-dome"
  | "book"
  | "flower"
  | "tray"
  | "music-box"
  | "butterfly-box"
  | "crystal"
  | "film"
  | "drawer"
  | "ribbon-envelope"
  | "moonlight"
  | "gallery"
  | "cube"
  | "mailbox"
  | "curtain"
  | "bottle"
  | "mirror"
  | "origami";

export type InviteSceneKind = InviteExperienceRoute;

export interface InviteExperienceConfig {
  route: InviteExperienceRoute;
  sceneKind: InviteSceneKind;
  templateSlug: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  palette: {
    background: string;
    paper: string;
    accent: string;
    dark: string;
    secondary: string;
  };
}

export const INVITE_EXPERIENCES = [
  {
    route: "book",
    sceneKind: "book",
    templateSlug: "book-3d-invite",
    eyebrow: "Davety / Book 3D",
    title: "Açılan kitabın son sayfası",
    description: "Kitap kapağı ve sayfalar döner; son sayfa davetiye kartına dönüşür.",
    cta: "Kitabı Aç",
    palette: {
      background: "#eee7d8",
      paper: "#fbf1d4",
      accent: "#5e3426",
      dark: "#2b211c",
      secondary: "#b9884a",
    },
  },
  {
    route: "music-box",
    sceneKind: "music-box",
    templateSlug: "music-box-3d-invite",
    eyebrow: "Davety / Music Box 3D",
    title: "Müzik kutusundan çıkan davetiye",
    description: "Kutu açılır, küçük mekanizma döner ve davetiye yukarı doğru yükselir.",
    cta: "Müziği Başlat",
    palette: {
      background: "#ebe7df",
      paper: "#fff9ee",
      accent: "#925d3b",
      dark: "#261f1d",
      secondary: "#c9a349",
    },
  },
  {
    route: "curtain",
    sceneKind: "curtain",
    templateSlug: "curtain-3d-invite",
    eyebrow: "Davety / Curtain 3D",
    title: "Sahne perdesi arkasındaki davetiye",
    description: "Perdeler yana açılır, spot ışığı davetiyeyi sahnenin ortasında yakalar.",
    cta: "Perdeyi Aç",
    palette: {
      background: "#171313",
      paper: "#fff3dc",
      accent: "#9c1d2d",
      dark: "#f4ead5",
      secondary: "#c9a349",
    },
  },
] as const satisfies readonly InviteExperienceConfig[];

export const INVITE_EXPERIENCE_ROUTES = INVITE_EXPERIENCES.map((experience) => experience.route);

export function getInviteExperienceByRoute(route: InviteExperienceRoute) {
  return INVITE_EXPERIENCES.find((experience) => experience.route === route) ?? INVITE_EXPERIENCES[0];
}
