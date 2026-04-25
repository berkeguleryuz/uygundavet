export type ClaudeSceneSlug =
  | "kum-saati"
  | "ruzgar-cani"
  | "guguklu-saat";

export interface ClaudeSceneMeta {
  slug: ClaudeSceneSlug;
  index: number;
  title: string;
  physics: string;
  exit: string;
  palette: { bg: string; ink: string; accent: string };
  status: "ready" | "wip";
}

export const CLAUDE_SCENES: readonly ClaudeSceneMeta[] = [
  {
    slug: "kum-saati",
    index: 1,
    title: "Kum Saati + Vidalı Çıkış",
    physics: "Granular flow, gravity, accumulating mass trigger.",
    exit: "Üst hazne boşalınca cam silindir vidasından dönerek yukarı kalkar.",
    palette: { bg: "#efe7d6", ink: "#2b231b", accent: "#c19255" },
    status: "ready",
  },
  {
    slug: "ruzgar-cani",
    index: 2,
    title: "Rüzgar Çanı + Kümülatif Darbe",
    physics: "Pendulum cluster, cumulative impulse threshold.",
    exit: "Belirli darbe sayısından sonra pendant menteşesi serbest kalır.",
    palette: { bg: "#e3eae5", ink: "#161b1d", accent: "#9d7c3d" },
    status: "ready",
  },
  {
    slug: "guguklu-saat",
    index: 3,
    title: "Guguklu Saat",
    physics: "Pendulum + escapement + linear actuator + flutter.",
    exit: "Kapı açılır, kuş öne çıkar, davetiyeyi serbest bırakır.",
    palette: { bg: "#ebe2cd", ink: "#211911", accent: "#7c4427" },
    status: "ready",
  },
] as const;

export function getClaudeScene(slug: string): ClaudeSceneMeta | undefined {
  return CLAUDE_SCENES.find((s) => s.slug === slug);
}
