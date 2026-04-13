"use client";

import { useWedding } from "../_lib/context";
import { OrnamentalDivider } from "../_components/OrnamentalDivider";
import { ScrollReveal } from "../_components/ScrollReveal";
import { EventSchedule } from "../_components/EventSchedule";
import { MapPin, Calendar, Clock, Shirt, Users } from "lucide-react";

export default function EtkinlikPage() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const weddingDate = new Date(wedding.weddingDate).toLocaleDateString(
    "tr-TR",
    { day: "numeric", month: "long", year: "numeric", weekday: "long" }
  );

  return (
    <div className="pt-24 pb-6 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <OrnamentalDivider className="mb-6" />
          <p className="font-sans text-xs tracking-[3px] uppercase text-white/30">
            Etkinlik Bilgileri
          </p>
          <h1 className="font-merienda text-3xl md:text-4xl text-[#d5d1ad] mt-3">
            {brideFirst} & {groomFirst}
          </h1>
        </ScrollReveal>

        {/* 2-column grid */}
        <div className="grid md:grid-cols-2 gap-4 items-start">
          {/* Left: Venue Card — info top, map pinned bottom */}
          <ScrollReveal delay={0.1}>
            <div className="bg-[#1c1a1b] rounded-2xl border border-white/[0.07] p-6 flex flex-col">
              <h2 className="font-merienda text-xl text-[#d5d1ad] mb-5">
                {wedding.venueName || "Mekan"}
              </h2>

              <div className="space-y-3 text-sm">
                {wedding.venueAddress && (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="size-3.5 text-[#d5d1ad]/50 mt-0.5 shrink-0" />
                    <p className="font-sans text-white/55 leading-relaxed">
                      {wedding.venueAddress}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2.5">
                  <Calendar className="size-3.5 text-[#d5d1ad]/50 shrink-0" />
                  <p className="font-sans text-white/55">{weddingDate}</p>
                </div>
                {wedding.weddingTime && (
                  <div className="flex items-center gap-2.5">
                    <Clock className="size-3.5 text-[#d5d1ad]/50 shrink-0" />
                    <p className="font-sans text-white/55">
                      Saat {wedding.weddingTime}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2.5">
                  <Shirt className="size-3.5 text-[#d5d1ad]/50 shrink-0" />
                  <p className="font-sans text-white/55">Resmi / Formal</p>
                </div>
              </div>

              {/* Google Maps — always at the bottom of the card */}
              {(wedding.venueAddress || wedding.venueName) ? (
                <div className="mt-auto pt-4 rounded-xl overflow-hidden aspect-[16/10]">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(wedding.venueAddress || wedding.venueName)}&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-xl"
                  />
                </div>
              ) : (
                <div className="mt-auto pt-4 rounded-xl bg-white/5 border border-white/[0.06] aspect-[16/10] flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="size-6 text-[#d5d1ad]/20 mx-auto mb-1" />
                    <p className="font-sans text-[10px] text-white/20">
                      Harita görünümü
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Right: Schedule + Family stacked */}
          <div className="flex flex-col gap-4">
            {/* Event Schedule */}
            <ScrollReveal delay={0.2}>
              <div className="bg-[#1c1a1b] rounded-2xl border border-white/[0.07] p-6">
                <h2 className="font-merienda text-lg text-[#d5d1ad] mb-5">
                  Etkinlik Programı
                </h2>
                <EventSchedule schedule={wedding.eventSchedule} />
              </div>
            </ScrollReveal>

            {/* Family Names — compact inline layout */}
            {(wedding.groomFamily || wedding.brideFamily) && (
              <ScrollReveal delay={0.3}>
                <div className="bg-[#1c1a1b] rounded-2xl border border-white/[0.07] p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="size-3.5 text-[#d5d1ad]/50" />
                    <h2 className="font-merienda text-lg text-[#d5d1ad]">
                      Aileler
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-x-5 gap-y-0.5 text-[13px]">
                    {wedding.brideFamily && (
                      <>
                        <p className="font-chakra text-[9px] uppercase tracking-[0.15em] text-white/25 col-span-1 pt-1">
                          Gelin Ailesi
                        </p>
                        <p className="font-chakra text-[9px] uppercase tracking-[0.15em] text-white/25 col-span-1 pt-1">
                          Damat Ailesi
                        </p>
                        <p className="font-sans text-white/55">
                          {wedding.brideFamily.father.firstName} {wedding.brideFamily.father.lastName}
                        </p>
                        <p className="font-sans text-white/55">
                          {wedding.groomFamily?.father.firstName} {wedding.groomFamily?.father.lastName}
                        </p>
                        <p className="font-sans text-white/55">
                          {wedding.brideFamily.mother.firstName} {wedding.brideFamily.mother.lastName}
                        </p>
                        <p className="font-sans text-white/55">
                          {wedding.groomFamily?.mother.firstName} {wedding.groomFamily?.mother.lastName}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
