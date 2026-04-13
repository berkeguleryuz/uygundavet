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
    <div className="min-h-svh pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <OrnamentalDivider className="mb-6" />
          <p className="font-sans text-xs tracking-[3px] uppercase text-white/30">
            Etkinlik Bilgileri
          </p>
          <h1 className="font-merienda text-3xl md:text-4xl text-[#d5d1ad] mt-3">
            {brideFirst} & {groomFirst}
          </h1>
          <p className="font-sans text-sm text-white/40 mt-2">
            Sizi de aramızda görmekten mutluluk duyarız
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Venue Card */}
          <ScrollReveal delay={0.1}>
            <div className="liquid-glass rounded-3xl border border-white/10 p-8 h-full">
              <h2 className="font-merienda text-2xl text-[#d5d1ad] mb-6">
                {wedding.venueName || "Mekan"}
              </h2>

              <div className="space-y-4">
                {wedding.venueAddress && (
                  <div className="flex items-start gap-3">
                    <MapPin className="size-4 text-[#d5d1ad]/60 mt-0.5 shrink-0" />
                    <p className="font-sans text-sm text-white/60">
                      {wedding.venueAddress}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar className="size-4 text-[#d5d1ad]/60 shrink-0" />
                  <p className="font-sans text-sm text-white/60">
                    {weddingDate}
                  </p>
                </div>

                {wedding.weddingTime && (
                  <div className="flex items-center gap-3">
                    <Clock className="size-4 text-[#d5d1ad]/60 shrink-0" />
                    <p className="font-sans text-sm text-white/60">
                      Saat {wedding.weddingTime}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Shirt className="size-4 text-[#d5d1ad]/60 shrink-0" />
                  <p className="font-sans text-sm text-white/60">
                    Resmi / Formal
                  </p>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="size-8 text-[#d5d1ad]/30 mx-auto mb-2" />
                  <p className="font-sans text-xs text-white/30">
                    Harita görünümü
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Schedule + Family Card */}
          <div className="space-y-6">
            <ScrollReveal delay={0.2}>
              <div className="liquid-glass rounded-3xl border border-white/10 p-8">
                <h2 className="font-merienda text-xl text-[#d5d1ad] mb-6">
                  Etkinlik Programı
                </h2>
                <EventSchedule />
              </div>
            </ScrollReveal>

            {/* Family Names */}
            {(wedding.groomFamily || wedding.brideFamily) && (
              <ScrollReveal delay={0.3}>
                <div className="liquid-glass rounded-3xl border border-white/10 p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Users className="size-4 text-[#d5d1ad]/60" />
                    <h2 className="font-merienda text-xl text-[#d5d1ad]">
                      Aileler
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {wedding.brideFamily && (
                      <div>
                        <p className="font-chakra text-xs uppercase tracking-wider text-white/40 mb-2">
                          Gelin Ailesi
                        </p>
                        <p className="font-sans text-sm text-white/70">
                          {wedding.brideFamily.father.firstName}{" "}
                          {wedding.brideFamily.father.lastName}
                        </p>
                        <p className="font-sans text-sm text-white/70">
                          {wedding.brideFamily.mother.firstName}{" "}
                          {wedding.brideFamily.mother.lastName}
                        </p>
                      </div>
                    )}

                    {wedding.groomFamily && (
                      <div>
                        <p className="font-chakra text-xs uppercase tracking-wider text-white/40 mb-2">
                          Damat Ailesi
                        </p>
                        <p className="font-sans text-sm text-white/70">
                          {wedding.groomFamily.father.firstName}{" "}
                          {wedding.groomFamily.father.lastName}
                        </p>
                        <p className="font-sans text-sm text-white/70">
                          {wedding.groomFamily.mother.firstName}{" "}
                          {wedding.groomFamily.mother.lastName}
                        </p>
                      </div>
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
