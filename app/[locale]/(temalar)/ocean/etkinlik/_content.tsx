"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { EventSchedule } from "../_components/EventSchedule";
import { MapPinIcon } from "../_icons/MapPinIcon";
import { CalendarIcon } from "../_icons/CalendarIcon";
import { ClockIcon } from "../_icons/ClockIcon";
import { WaveIcon } from "../_icons/WaveIcon";
import { CompassIcon } from "../_icons/CompassIcon";

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
    <div className="min-h-svh bg-[#0d1620]">
      <div className="relative h-[55vh] min-h-[340px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=85"
          alt="Venue"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1620] via-[#0d1620]/60 to-transparent" />
        <div className="absolute inset-0 bg-[#2d8b8b]/10 mix-blend-multiply" />

        <div className="absolute bottom-8 left-6 md:left-12 z-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <WaveIcon size={14} className="text-[#a8dadc]" />
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#a8dadc] font-bold">
              {t("eventLabel")}
            </p>
          </div>
          <h1 className="font-merienda text-3xl md:text-5xl text-[#f1faee]">
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
          <div className="bg-[#1a2332]/70 backdrop-blur-sm rounded-[1.75rem] border border-[#a8dadc]/20 p-6 md:p-8 mb-8">
            <div className="flex items-center gap-2.5 mb-6">
              <CompassIcon size={18} className="text-[#a8dadc]" />
              <h2 className="font-merienda text-xl text-[#f1faee]">
                {wedding.venueName || t("venueLabel")}
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              {wedding.venueAddress && (
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#2d8b8b]/20 border border-[#a8dadc]/25 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPinIcon size={16} className="text-[#a8dadc]" />
                  </div>
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#a8dadc]/70 mb-1 font-semibold">
                      {t("venueAddress")}
                    </p>
                    <p className="font-sans text-[#f1faee]/80 leading-relaxed">
                      {wedding.venueAddress}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#2d8b8b]/20 border border-[#a8dadc]/25 flex items-center justify-center shrink-0 mt-0.5">
                  <CalendarIcon size={16} className="text-[#a8dadc]" />
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#a8dadc]/70 mb-1 font-semibold">
                    {t("venueDate")}
                  </p>
                  <p className="font-sans text-[#f1faee]/80">{weddingDate}</p>
                </div>
              </div>
              {wedding.weddingTime && (
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#2d8b8b]/20 border border-[#a8dadc]/25 flex items-center justify-center shrink-0 mt-0.5">
                    <ClockIcon size={16} className="text-[#a8dadc]" />
                  </div>
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#a8dadc]/70 mb-1 font-semibold">
                      {t("venueTime")}
                    </p>
                    <p className="font-sans text-[#f1faee]/80">{wedding.weddingTime}</p>
                  </div>
                </div>
              )}
            </div>

            {wedding.venueAddress || wedding.venueName ? (
              <div className="mt-6 rounded-[1.25rem] overflow-hidden aspect-[16/9] border border-[#a8dadc]/20">
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
              <div className="mt-6 rounded-[1.25rem] bg-[#0d1620]/60 border border-[#a8dadc]/15 aspect-[16/9] flex items-center justify-center">
                <div className="text-center">
                  <MapPinIcon size={24} className="text-[#a8dadc]/30 mx-auto mb-1" />
                  <p className="font-sans text-[10px] text-[#f1faee]/25">
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
          <div className="bg-[#1a2332]/70 backdrop-blur-sm rounded-[1.75rem] border border-[#a8dadc]/20 p-6 md:p-8 mb-8">
            <div className="flex items-center gap-2.5 mb-6">
              <WaveIcon size={16} className="text-[#a8dadc]" />
              <h2 className="font-merienda text-lg text-[#f1faee]">
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
            <div className="bg-[#1a2332]/70 backdrop-blur-sm rounded-[1.75rem] border border-[#a8dadc]/20 p-6 md:p-8">
              <div className="flex items-center gap-2.5 mb-5">
                <CompassIcon size={16} className="text-[#a8dadc]" />
                <h2 className="font-merienda text-lg text-[#f1faee]">
                  {t("eventFamilyHeading")}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[13px]">
                {wedding.brideFamily && (
                  <>
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#a8dadc]/70 col-span-1 pt-2 font-semibold">
                      {t("eventBrideFamily")}
                    </p>
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#a8dadc]/70 col-span-1 pt-2 font-semibold">
                      {t("eventGroomFamily")}
                    </p>
                    <p className="font-sans text-[#f1faee]/80">
                      {wedding.brideFamily.father.firstName} {wedding.brideFamily.father.lastName}
                    </p>
                    <p className="font-sans text-[#f1faee]/80">
                      {wedding.groomFamily?.father.firstName} {wedding.groomFamily?.father.lastName}
                    </p>
                    <p className="font-sans text-[#f1faee]/80">
                      {wedding.brideFamily.mother.firstName} {wedding.brideFamily.mother.lastName}
                    </p>
                    <p className="font-sans text-[#f1faee]/80">
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
