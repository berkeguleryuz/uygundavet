export function useTheme() {
  return {
    theme: "dark" as const,
    resolvedTheme: "dark" as const,
    systemTheme: "dark" as const,
    themes: ["dark"],
    setTheme: () => {},
  };
}
