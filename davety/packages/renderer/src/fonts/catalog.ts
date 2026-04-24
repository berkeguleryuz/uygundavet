export type FontCategory =
  | "all"
  | "modern"
  | "classic"
  | "typewriter"
  | "handwriting"
  | "display";

export interface FontEntry {
  family: string;
  category: Exclude<FontCategory, "all">;
  weights?: string[];
}

export const fontCategories: FontCategory[] = [
  "all",
  "modern",
  "classic",
  "typewriter",
  "handwriting",
  "display",
];

export const fontCatalog: FontEntry[] = [
  // Modern
  { family: "Inter", category: "modern", weights: ["400", "500", "600", "700"] },
  { family: "Roboto", category: "modern", weights: ["400", "500", "700"] },
  { family: "Open Sans", category: "modern", weights: ["400", "600", "700"] },
  { family: "Montserrat", category: "modern", weights: ["400", "500", "600", "700"] },
  { family: "Nunito", category: "modern", weights: ["400", "600", "700"] },
  { family: "Poppins", category: "modern", weights: ["400", "500", "600", "700"] },
  { family: "Raleway", category: "modern", weights: ["400", "500", "600"] },
  { family: "Lato", category: "modern", weights: ["400", "700"] },
  { family: "Work Sans", category: "modern", weights: ["400", "500", "600"] },
  { family: "DM Sans", category: "modern", weights: ["400", "500", "700"] },

  // Classic (serif)
  { family: "Playfair Display", category: "classic", weights: ["400", "700"] },
  { family: "Lora", category: "classic", weights: ["400", "500", "600"] },
  { family: "Merriweather", category: "classic", weights: ["400", "700"] },
  { family: "PT Serif", category: "classic", weights: ["400", "700"] },
  { family: "Cormorant Garamond", category: "classic", weights: ["400", "500", "600"] },
  { family: "EB Garamond", category: "classic", weights: ["400", "500", "600"] },
  { family: "Crimson Text", category: "classic", weights: ["400", "600"] },

  // Typewriter (monospace)
  { family: "Courier Prime", category: "typewriter", weights: ["400", "700"] },
  { family: "IBM Plex Mono", category: "typewriter", weights: ["400", "500"] },
  { family: "Roboto Mono", category: "typewriter", weights: ["400", "500"] },
  { family: "Special Elite", category: "typewriter", weights: ["400"] },

  // Handwriting
  { family: "Great Vibes", category: "handwriting", weights: ["400"] },
  { family: "Dancing Script", category: "handwriting", weights: ["400", "500", "600", "700"] },
  { family: "Pacifico", category: "handwriting", weights: ["400"] },
  { family: "Sacramento", category: "handwriting", weights: ["400"] },
  { family: "Allura", category: "handwriting", weights: ["400"] },
  { family: "Parisienne", category: "handwriting", weights: ["400"] },
  { family: "Caveat", category: "handwriting", weights: ["400", "500", "700"] },
  { family: "Satisfy", category: "handwriting", weights: ["400"] },

  // Display (showy)
  { family: "Merienda", category: "display", weights: ["400", "700"] },
  { family: "Abril Fatface", category: "display", weights: ["400"] },
  { family: "Bebas Neue", category: "display", weights: ["400"] },
  { family: "Italiana", category: "display", weights: ["400"] },
  { family: "Cinzel", category: "display", weights: ["400", "500", "600", "700"] },
  { family: "Marcellus", category: "display", weights: ["400"] },
  { family: "Beau Rivage", category: "display", weights: ["400"] },
  { family: "Charm", category: "display", weights: ["400", "700"] },
  { family: "Orbitron", category: "display", weights: ["400", "500", "700"] },
];

export function filterByCategory(cat: FontCategory): FontEntry[] {
  if (cat === "all") return fontCatalog;
  return fontCatalog.filter((f) => f.category === cat);
}

export function findFont(family: string): FontEntry | undefined {
  return fontCatalog.find((f) => f.family === family);
}

export function buildFontHref(family: string, weights?: string[]): string {
  const w = weights?.length ? `:wght@${weights.join(";")}` : "";
  const q = encodeURIComponent(family).replace(/%20/g, "+");
  return `https://fonts.googleapis.com/css2?family=${q}${w}&display=swap`;
}
