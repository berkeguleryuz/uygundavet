"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "../_components/ScrollReveal";

const BASE = "/lavanta";

const photos = [
  { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=75", span: "col-span-2 row-span-2" },
  { url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=75", span: "col-span-1 row-span-1" },
  { url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&q=75", span: "col-span-1 row-span-1" },
  { url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&q=75", span: "col-span-1 row-span-1" },
  { url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=75", span: "col-span-1 row-span-1" },
];

export function SectionGalleryPreview() {
  return (
    <section className="relative py-24 md:py-32 bg-[#1c1a1b] overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-[#d5d1ad]/8 to-transparent absolute top-0 inset-x-0" />

      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-14 md:mb-16">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#d5d1ad]/40 mb-3">
            Galeri
          </p>
          <h2 className="font-merienda text-2xl md:text-3xl text-[#d5d1ad]/80">
            Anılarımız
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] md:auto-rows-[200px] gap-2.5 md:gap-3">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`relative rounded-xl overflow-hidden group cursor-pointer ${photo.span}`}
            >
              <Image
                src={photo.url}
                alt={`Galeri ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>

        <ScrollReveal delay={0.3} className="text-center mt-12">
          <Link
            href={`${BASE}/galeri`}
            className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-[#d5d1ad] hover:text-[#d5d1ad]/70 transition-colors group"
          >
            Tüm Galeriyi Gör
            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
