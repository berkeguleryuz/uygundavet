import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en", "de"],
  defaultLocale: "tr",
  localePrefix: "never",
  alternateLinks: false,
});
