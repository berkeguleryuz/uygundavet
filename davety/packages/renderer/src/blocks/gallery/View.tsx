/* eslint-disable @next/next/no-img-element -- renderer package supports
 * non-Next.js consumers and the gallery already serves pre-resized
 * webp variants from R2, Next/Image would add no benefit. */
"use client";

import { useEffect, useState } from "react";
import type { GalleryData } from "@davety/schema";
import { fieldStyle, styleToCss, type BlockViewProps } from "../types";
import { buildImgProps } from "../../media";

export function GalleryView({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<GalleryData>) {
  const rootStyle = styleToCss(block.style);
  const { items } = block.data;
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (lightbox === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft" && lightbox !== null && lightbox > 0) {
        setLightbox(lightbox - 1);
      }
      if (
        e.key === "ArrowRight" &&
        lightbox !== null &&
        lightbox < items.length - 1
      ) {
        setLightbox(lightbox + 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, items.length]);

  const click = (id: string) =>
    editable && onFieldSelect
      ? {
          "data-field-id": id,
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onFieldSelect(id);
          },
          className: "cursor-pointer hover:bg-yellow-100/30 rounded px-1",
        }
      : {};

  return (
    <section className="px-2 py-4" style={rootStyle} aria-label="Galeri">
      <h3
        {...click("heading")}
        className="font-display text-2xl text-center mb-6"
        style={fieldStyle(block, "heading")}
      >
        Galeri
      </h3>

      {items.length === 0 ? (
        <div className="text-center text-sm opacity-50 italic py-8">
          Henüz fotoğraf yok
        </div>
      ) : (
        <ul
          className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-2xl mx-auto"
          role="list"
        >
          {items.map((m, i) => {
            const altText =
              (m as { alt?: string }).alt ??
              `Galeri ${m.mediaType === "video" ? "videosu" : "görseli"} ${
                i + 1
              }`;
            return (
              <li key={i} className="list-none">
                <button
                  type="button"
                  onClick={() => !editable && setLightbox(i)}
                  aria-label={`Galeri ${m.mediaType ?? "image"} ${i + 1}`}
                  className="block w-full aspect-square overflow-hidden rounded-md bg-current/5 cursor-pointer focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-current"
                >
                  {m.mediaType === "video" ? (
                    <video
                      src={m.url}
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition: `${m.focalX ?? 50}% ${m.focalY ?? 50}%`,
                      }}
                      muted
                      preload="metadata"
                      aria-label={altText}
                    />
                  ) : (
                    <img
                      {...buildImgProps(m, "(max-width: 640px) 50vw, 260px")}
                      alt={altText}
                      loading="lazy"
                      decoding="async"
                      style={{
                        objectPosition: `${m.focalX ?? 50}% ${m.focalY ?? 50}%`,
                      }}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {lightbox !== null && items[lightbox] ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galeri büyük görünüm"
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            aria-label="Kapat"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
            className="absolute top-4 right-4 size-10 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            ×
          </button>
          {items[lightbox].mediaType === "video" ? (
            <video
              src={items[lightbox].url}
              controls
              autoPlay
              className="max-w-full max-h-full"
              aria-label={`Galeri video ${lightbox + 1}`}
            />
          ) : (
            <img
              src={
                items[lightbox].variants?.lg ??
                items[lightbox].variants?.original ??
                items[lightbox].url
              }
              alt={
                (items[lightbox] as { alt?: string }).alt ??
                `Galeri görseli ${lightbox + 1}`
              }
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>
      ) : null}
    </section>
  );
}
