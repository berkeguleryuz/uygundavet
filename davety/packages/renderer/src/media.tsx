import type { MediaRef } from "@davety/schema";

/**
 * Build `srcSet` + `sizes` for a MediaRef with responsive variants.
 * Falls back to the single `url` when no variants are present.
 */
export function buildImgProps(
  media: MediaRef,
  sizes = "(max-width: 640px) 100vw, 640px"
): React.ImgHTMLAttributes<HTMLImageElement> {
  const v = media.variants;
  if (!v) return { src: media.url };

  const parts: string[] = [];
  if (v.thumb) parts.push(`${v.thumb} 400w`);
  if (v.md) parts.push(`${v.md} 800w`);
  if (v.lg) parts.push(`${v.lg} 1600w`);

  const src = v.md ?? v.lg ?? v.original ?? media.url;
  return {
    src,
    srcSet: parts.length ? parts.join(", ") : undefined,
    sizes: parts.length ? sizes : undefined,
  };
}
