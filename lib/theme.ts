type Theme = "dark" | "light" | "system";

export function useTheme() {
  return {
    theme: "dark" as Theme,
    resolvedTheme: "dark" as Theme,
    systemTheme: "dark" as Theme,
    themes: ["dark"] as Theme[],
    setTheme: (theme: Theme) => {
      void theme;
    },
  };
}
