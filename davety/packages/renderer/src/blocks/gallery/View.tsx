"use client";

import { useState } from "react";
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

  const click = (id: string) =>
    editable && onFieldSelect
      ? {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onFieldSelect(id);
          },
          className: "cursor-pointer hover:bg-yellow-100/30 rounded px-1",
        }
      : {};

  return (
    <section className="px-2 py-10" style={rootStyle}>
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-2xl mx-auto">
          {items.map((m, i) => (
            <button
              key={i}
              onClick={() => !editable && setLightbox(i)}
              className="aspect-square overflow-hidden rounded-md bg-current/5 cursor-pointer"
            >
              {m.mediaType === "video" ? (
                <video
                  src={m.url}
                  className="w-full h-full object-cover"
                  muted
                />
              ) : (
                <img
                  {...buildImgProps(m, "(max-width: 640px) 50vw, 260px")}
                  alt=""
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {lightbox !== null && items[lightbox] ? (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setLightbox(null)}
        >
          {items[lightbox].mediaType === "video" ? (
            <video
              src={items[lightbox].url}
              controls
              autoPlay
              className="max-w-full max-h-full"
            />
          ) : (
            <img
              src={items[lightbox].variants?.lg ?? items[lightbox].variants?.original ?? items[lightbox].url}
              alt=""
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>
      ) : null}
    </section>
  );
}
