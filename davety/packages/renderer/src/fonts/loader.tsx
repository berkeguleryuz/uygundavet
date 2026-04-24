"use client";

import { useEffect } from "react";
import type { InvitationDoc } from "@davety/schema";
import { buildFontHref, findFont } from "./catalog";

const injected = new Set<string>();

export function ensureFont(family: string) {
  if (typeof document === "undefined") return;
  if (injected.has(family)) return;
  injected.add(family);

  const entry = findFont(family);
  const href = buildFontHref(family, entry?.weights);
  if (document.head.querySelector(`link[data-davety-font="${family}"]`)) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.dataset.davetyFont = family;
  document.head.appendChild(link);
}

export function collectFontFamilies(doc: InvitationDoc): string[] {
  const set = new Set<string>();
  for (const block of doc.blocks) {
    if (block.style.fontFamily) set.add(block.style.fontFamily);
    const overrides = block.style.fieldOverrides;
    if (overrides) {
      for (const key of Object.keys(overrides)) {
        const o = overrides[key];
        if (o?.fontFamily) set.add(o.fontFamily);
      }
    }
  }
  return Array.from(set);
}

/**
 * SSR-safe font preloader. Emits `<link>` tags on the server for the fonts
 * referenced by the document, and ensures they are in the injected-set on the
 * client so subsequent edits don't duplicate.
 */
export function FontBoot({ doc }: { doc: InvitationDoc }) {
  const families = collectFontFamilies(doc);

  useEffect(() => {
    for (const family of families) {
      ensureFont(family);
    }
  }, [families.join(",")]);

  return (
    <>
      {families.map((family) => {
        const entry = findFont(family);
        const href = buildFontHref(family, entry?.weights);
        return (
          <link
            key={family}
            rel="stylesheet"
            href={href}
            data-davety-font={family}
          />
        );
      })}
    </>
  );
}
