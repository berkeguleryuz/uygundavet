"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { EventSchedule } from "../_components/EventSchedule";
import { MapPinIcon } from "../_icons/MapPinIcon";
import { CalendarIcon } from "../_icons/CalendarIcon";
import { ClockIcon } from "../_icons/ClockIcon";

export function EtkinlikContent() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const weddingDate = new Date(wedding.weddingDate).toLocaleDateString(
    "tr-TR",
    { day: "numeric", month: "long", year: "numeric", weekday: "long" }
  );

  return (
    <div className="min-h-svh bg-[#1c1917]" data-section-dark>
      <div className="relative h-[50vh] min-h-[320px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&q=80"
          alt="Venue"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917] via-[#1c1917]/50 to-transparent" />

        <div className="absolute bottom-8 left-6 md:left-12 z-10">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#b8a088] mb-2">
            {t("eventLabel")}
          </p>
          <h1 className="font-merienda text-3xl md:text-4xl bg-gradient-to-r from-[#b8a088] to-[#c4a296] bg-clip-text text-transparent">
            {brideFirst} & {groomFirst}
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 -mt-12 relative z-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/5 rounded-3xl border border-white/10 p-6 md:p-8 mb-8 backdrop-blur-sm">
            <h2 className="font-merienda text-xl text-white mb-5">
              {wedding.venueName || t("venueLabel")}
            </h2>

            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              {wedding.venueAddress && (
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#b8a088]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPinIcon className="size-4 text-[#b8a088]" size={16} />
                  </div>
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-wider text-white/30 mb-1">
                      {t("venueAddress")}
                    </p>
                    <p className="font-sans text-white/70 leading-relaxed">
                      {wedding.venueAddress}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#c4a296]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CalendarIcon className="size-4 text-[#c4a296]" size={16} />
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-white/30 mb-1">
                    {t("venueDate")}
                  </p>
                  <p className="font-sans text-white/70">{weddingDate}</p>
                </div>
              </div>
              {wedding.weddingTime && (
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#a89886]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <ClockIcon className="size-4 text-[#a89886]" size={16} />
                  </div>
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-wider text-white/30 mb-1">
                      {t("venueTime")}
                    </p>
                    <p className="font-sans text-white/70">{wedding.weddingTime}</p>
                  </div>
                </div>
              )}
            </div>

            {(wedding.venueAddress || wedding.venueName) ? (
              <div className="mt-6 rounded-2xl overflow-hidden aspect-[16/9]">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(wedding.venueAddress || wedding.venueName)}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-2xl"
                />
              </div>
            ) : (
              <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 aspect-[16/9] flex items-center justify-center">
                <div className="text-center">
                  <MapPinIcon className="size-6 text-white/20 mx-auto mb-1" size={24} />
                  <p className="font-sans text-[10px] text-white/20">
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
          <div className="bg-white/5 rounded-3xl border border-white/10 p-6 md:p-8 mb-8">
            <h2 className="font-merienda text-lg text-white mb-6">
              {t("eventScheduleHeading")}
            </h2>
            <EventSchedule schedule={wedding.eventSchedule} dark />
          </div>
        </motion.div>

        {(wedding.groomFamily || wedding.brideFamily) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white/5 rounded-3xl border border-white/10 p-6 md:p-8">
              <h2 className="font-merienda text-lg text-white mb-5">
                {t("eventFamilyHeading")}
              </h2>

              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[13px]">
                {wedding.brideFamily && (
                  <>
                    <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#c4a296]/60 col-span-1 pt-2">
                      {t("eventBrideFamily")}
                    </p>
                    <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#b8a088]/60 col-span-1 pt-2">
                      {t("eventGroomFamily")}
                    </p>
                    <p className="font-sans text-white/70">
                      {wedding.brideFamily.father.firstName} {wedding.brideFamily.father.lastName}
                    </p>
                    <p className="font-sans text-white/70">
                      {wedding.groomFamily?.father.firstName} {wedding.groomFamily?.father.lastName}
                    </p>
                    <p className="font-sans text-white/70">
                      {wedding.brideFamily.mother.firstName} {wedding.brideFamily.mother.lastName}
                    </p>
                    <p className="font-sans text-white/70">
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
