"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import { ScrollReveal } from "../_components/ScrollReveal";
import { useWedding } from "../_lib/context";

const BASE = "/lavanta";

const TR_MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function SectionVenuePreview() {
  const wedding = useWedding();

  return (
    <section className="relative bg-[#252224] overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-[#d5d1ad]/8 to-transparent" />

      <div className="grid md:grid-cols-[1.1fr_1fr] min-h-[600px] md:min-h-[700px]">
        <ScrollReveal className="relative order-2 md:order-2">
          <div className="relative h-full min-h-[400px] md:min-h-0">
            <Image
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80"
              alt={wedding.venueName || "Düğün mekanı"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 55vw"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#252224]/80 hidden md:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#252224] via-transparent to-transparent md:hidden" />
          </div>
        </ScrollReveal>

        <div className="relative order-1 md:order-1 flex items-center py-16 md:py-24 px-8 md:px-16 lg:px-24">
          <div className="w-full max-w-md ml-auto">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-[#d5d1ad]/25" />
                <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#d5d1ad]/40">
                  Mekan & Etkinlik
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h2 className="font-merienda text-3xl md:text-4xl text-[#d5d1ad] mb-10">
                {wedding.venueName || "Düğün Mekanı"}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="space-y-5 mb-10">
                {wedding.venueAddress && (
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#d5d1ad]/5 border border-[#d5d1ad]/10 flex items-center justify-center shrink-0">
                      <MapPin className="size-3.5 text-[#d5d1ad]/50" />
                    </div>
                    <div className="pt-1.5">
                      <p className="font-sans text-[10px] text-white/25 uppercase tracking-[0.2em] mb-1">Adres</p>
                      <p className="font-sans text-sm text-white/55 leading-relaxed">{wedding.venueAddress}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#d5d1ad]/5 border border-[#d5d1ad]/10 flex items-center justify-center shrink-0">
                    <Calendar className="size-3.5 text-[#d5d1ad]/50" />
                  </div>
                  <div className="pt-1.5">
                    <p className="font-sans text-[10px] text-white/25 uppercase tracking-[0.2em] mb-1">Tarih</p>
                    <p className="font-sans text-sm text-white/55">{formatDate(wedding.weddingDate)}</p>
                  </div>
                </div>
                {wedding.weddingTime && (
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#d5d1ad]/5 border border-[#d5d1ad]/10 flex items-center justify-center shrink-0">
                      <Clock className="size-3.5 text-[#d5d1ad]/50" />
                    </div>
                    <div className="pt-1.5">
                      <p className="font-sans text-[10px] text-white/25 uppercase tracking-[0.2em] mb-1">Saat</p>
                      <p className="font-sans text-sm text-white/55">{wedding.weddingTime}</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Link
                href={`${BASE}/etkinlik`}
                className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-[#d5d1ad] hover:text-[#d5d1ad]/70 transition-colors group"
              >
                Detayları Görün
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
