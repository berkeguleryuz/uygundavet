"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { EventSchedule } from "../_components/EventSchedule";
import { MapPinIcon } from "../_icons/MapPinIcon";
import { CalendarIcon } from "../_icons/CalendarIcon";
import { ClockIcon } from "../_icons/ClockIcon";
import { LeafIcon } from "../_icons/LeafIcon";
import { BloomIcon } from "../_icons/BloomIcon";

export function EtkinlikContent() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const weddingDate = new Date(wedding.weddingDate).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  });

  return (
    <div className="min-h-svh bg-[#1f2a22]" data-section-dark>
      <div className="relative h-[55vh] min-h-[340px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=85"
          alt="Venue"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f2a22] via-[#1f2a22]/60 to-transparent" />

        <div className="absolute bottom-8 left-6 md:left-12 z-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <LeafIcon size={14} className="text-[#f9a620] rotate-[-20deg]" />
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#f9a620] font-semibold">
              {t("eventLabel")}
            </p>
          </div>
          <h1 className="font-merienda text-3xl md:text-5xl text-[#f9a620]">
            {brideFirst} &amp; {groomFirst}
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 -mt-14 relative z-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-[#f5f3ed]/5 rounded-[2rem] border border-[#f9a620]/20 p-6 md:p-8 mb-8 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 mb-6">
              <BloomIcon size={18} className="text-[#f9a620]" />
              <h2 className="font-merienda text-xl text-[#f5f3ed]">
                {wedding.venueName || t("venueLabel")}
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              {wedding.venueAddress && (
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#4a7c59]/20 border border-[#4a7c59]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPinIcon size={16} className="text-[#8ea68a]" />
                  </div>
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f9a620]/70 mb-1 font-semibold">
                      {t("venueAddress")}
                    </p>
                    <p className="font-sans text-[#f5f3ed]/80 leading-relaxed">
                      {wedding.venueAddress}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#f9a620]/15 border border-[#f9a620]/40 flex items-center justify-center shrink-0 mt-0.5">
                  <CalendarIcon size={16} className="text-[#f9a620]" />
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f9a620]/70 mb-1 font-semibold">
                    {t("venueDate")}
                  </p>
                  <p className="font-sans text-[#f5f3ed]/80">{weddingDate}</p>
                </div>
              </div>
              {wedding.weddingTime && (
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#b7472a]/15 border border-[#b7472a]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <ClockIcon size={16} className="text-[#e38a6e]" />
                  </div>
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f9a620]/70 mb-1 font-semibold">
                      {t("venueTime")}
                    </p>
                    <p className="font-sans text-[#f5f3ed]/80">{wedding.weddingTime}</p>
                  </div>
                </div>
              )}
            </div>

            {wedding.venueAddress || wedding.venueName ? (
              <div className="mt-6 rounded-[1.5rem] overflow-hidden aspect-[16/9] border border-[#f9a620]/15">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(wedding.venueAddress || wedding.venueName)}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-[1.5rem]"
                />
              </div>
            ) : (
              <div className="mt-6 rounded-[1.5rem] bg-[#f5f3ed]/5 border border-[#f9a620]/15 aspect-[16/9] flex items-center justify-center">
                <div className="text-center">
                  <MapPinIcon size={24} className="text-[#f9a620]/30 mx-auto mb-1" />
                  <p className="font-sans text-[10px] text-[#f5f3ed]/25">
                    {t("venueAddress")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-[#f5f3ed]/5 rounded-[2rem] border border-[#f9a620]/20 p-6 md:p-8 mb-8">
            <div className="flex items-center gap-2.5 mb-6">
              <LeafIcon size={16} className="text-[#f9a620] rotate-[-20deg]" />
              <h2 className="font-merienda text-lg text-[#f5f3ed]">
                {t("eventScheduleHeading")}
              </h2>
            </div>
            <EventSchedule schedule={wedding.eventSchedule} dark />
          </div>
        </motion.div>

        {(wedding.groomFamily || wedding.brideFamily) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-[#f5f3ed]/5 rounded-[2rem] border border-[#f9a620]/20 p-6 md:p-8">
              <div className="flex items-center gap-2.5 mb-5">
                <BloomIcon size={16} className="text-[#f9a620]" />
                <h2 className="font-merienda text-lg text-[#f5f3ed]">
                  {t("eventFamilyHeading")}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[13px]">
                {wedding.brideFamily && (
                  <>
                    <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#f9a620]/70 col-span-1 pt-2 font-semibold">
                      {t("eventBrideFamily")}
                    </p>
                    <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#8ea68a]/90 col-span-1 pt-2 font-semibold">
                      {t("eventGroomFamily")}
                    </p>
                    <p className="font-sans text-[#f5f3ed]/80">
                      {wedding.brideFamily.father.firstName} {wedding.brideFamily.father.lastName}
                    </p>
                    <p className="font-sans text-[#f5f3ed]/80">
                      {wedding.groomFamily?.father.firstName} {wedding.groomFamily?.father.lastName}
                    </p>
                    <p className="font-sans text-[#f5f3ed]/80">
                      {wedding.brideFamily.mother.firstName} {wedding.brideFamily.mother.lastName}
                    </p>
                    <p className="font-sans text-[#f5f3ed]/80">
                      {wedding.groomFamily?.mother.firstName} {wedding.groomFamily?.mother.lastName}
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
