"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { EventSchedule } from "../_components/EventSchedule";
import { MapPinIcon } from "../_icons/MapPinIcon";
import { CalendarIcon } from "../_icons/CalendarIcon";
import { ClockIcon } from "../_icons/ClockIcon";
import { SunIcon } from "../_icons/SunIcon";
import { HaloIcon } from "../_icons/HaloIcon";

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
    <div className="min-h-svh bg-[#faf5ec]">
      <div className="relative h-[55vh] min-h-[340px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=85"
          alt="Venue"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2d2620] via-[#2d2620]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#f4a900]/20 via-transparent to-[#c1666b]/30 mix-blend-multiply" />

        <div className="absolute bottom-8 left-6 md:left-12 z-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <SunIcon size={14} className="text-[#f4a900]" />
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#f4a900] font-bold">
              {t("eventLabel")}
            </p>
          </div>
          <h1 className="font-merienda text-3xl md:text-5xl text-[#faf5ec]">
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
          <div className="bg-[#faf5ec] border-[3px] border-[#f4a900]/35 rounded-[1.75rem] shadow-[0_25px_50px_-20px_rgba(74,64,58,0.3)] p-6 md:p-8 mb-8 relative overflow-hidden">
            <HaloIcon size={200} className="absolute -right-6 -top-6 text-[#f4a900]/12 pointer-events-none" />

            <div className="flex items-center gap-2.5 mb-6 relative">
              <SunIcon size={18} className="text-[#f4a900]" />
              <h2 className="font-merienda text-xl text-[#4a403a]">
                {wedding.venueName || t("venueLabel")}
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-sm relative">
              {wedding.venueAddress && (
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#c1666b]/15 border border-[#c1666b]/35 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPinIcon size={16} className="text-[#c1666b]" />
                  </div>
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#c1666b] mb-1 font-bold">
                      {t("venueAddress")}
                    </p>
                    <p className="font-sans text-[#4a403a] leading-relaxed">
                      {wedding.venueAddress}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#f4a900]/15 border border-[#f4a900]/40 flex items-center justify-center shrink-0 mt-0.5">
                  <CalendarIcon size={16} className="text-[#f4a900]" />
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#c1666b] mb-1 font-bold">
                    {t("venueDate")}
                  </p>
                  <p className="font-sans text-[#4a403a]">{weddingDate}</p>
                </div>
              </div>
              {wedding.weddingTime && (
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#8a7560]/15 border border-[#8a7560]/35 flex items-center justify-center shrink-0 mt-0.5">
                    <ClockIcon size={16} className="text-[#8a7560]" />
                  </div>
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#c1666b] mb-1 font-bold">
                      {t("venueTime")}
                    </p>
                    <p className="font-sans text-[#4a403a]">{wedding.weddingTime}</p>
                  </div>
                </div>
              )}
            </div>

            {wedding.venueAddress || wedding.venueName ? (
              <div className="mt-6 rounded-[1.25rem] overflow-hidden aspect-[16/9] border border-[#c1666b]/25">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(wedding.venueAddress || wedding.venueName)}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-[1.25rem]"
                />
              </div>
            ) : (
              <div className="mt-6 rounded-[1.25rem] bg-[#d4b896]/20 border border-[#c1666b]/20 aspect-[16/9] flex items-center justify-center">
                <div className="text-center">
                  <MapPinIcon size={24} className="text-[#c1666b]/40 mx-auto mb-1" />
                  <p className="font-sans text-[10px] text-[#4a403a]/40">
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
          <div className="bg-[#faf5ec] border-[3px] border-[#f4a900]/35 rounded-[1.75rem] shadow-[0_20px_45px_-20px_rgba(74,64,58,0.25)] p-6 md:p-8 mb-8">
            <div className="flex items-center gap-2.5 mb-6">
              <SunIcon size={16} className="text-[#f4a900]" />
              <h2 className="font-merienda text-lg text-[#4a403a]">
                {t("eventScheduleHeading")}
              </h2>
            </div>
            <EventSchedule schedule={wedding.eventSchedule} />
          </div>
        </motion.div>

        {(wedding.groomFamily || wedding.brideFamily) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-[#faf5ec] border-[3px] border-[#f4a900]/35 rounded-[1.75rem] shadow-[0_20px_45px_-20px_rgba(74,64,58,0.25)] p-6 md:p-8">
              <div className="flex items-center gap-2.5 mb-5">
                <SunIcon size={16} className="text-[#f4a900]" />
                <h2 className="font-merienda text-lg text-[#4a403a]">
                  {t("eventFamilyHeading")}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[13px]">
                {wedding.brideFamily && (
                  <>
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#c1666b] col-span-1 pt-2 font-bold">
                      {t("eventBrideFamily")}
                    </p>
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#f4a900] col-span-1 pt-2 font-bold">
                      {t("eventGroomFamily")}
                    </p>
                    <p className="font-sans text-[#4a403a]">
                      {wedding.brideFamily.father.firstName} {wedding.brideFamily.father.lastName}
                    </p>
                    <p className="font-sans text-[#4a403a]">
                      {wedding.groomFamily?.father.firstName} {wedding.groomFamily?.father.lastName}
                    </p>
                    <p className="font-sans text-[#4a403a]">
                      {wedding.brideFamily.mother.firstName} {wedding.brideFamily.mother.lastName}
                    </p>
                    <p className="font-sans text-[#4a403a]">
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
