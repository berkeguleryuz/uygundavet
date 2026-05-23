export function stripEmDash(text: string): string {
  return text
    .replace(/\s—\s/g, ", ")
    .replace(/—/g, ", ")
    .replace(/\s–\s/g, " - ")
    .replace(/–/g, "-");
}
