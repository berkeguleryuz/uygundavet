"use client";

import { motion } from "framer-motion";
import { WaveIcon } from "../_icons/WaveIcon";

interface ScheduleItem {
  time: string;
  label: string;
}

const defaultSchedule: ScheduleItem[] = [
  { time: "17:00", label: "Karşılama" },
  { time: "18:00", label: "Nikah Töreni" },
  { time: "19:00", label: "Yemek" },
  { time: "21:00", label: "Parti & Dans" },
];

interface EventScheduleProps {
  schedule?: { time: string; label: string }[];
  dark?: boolean;
}

export function EventSchedule({ schedule: propSchedule, dark = false }: EventScheduleProps) {
  const schedule = propSchedule && propSchedule.length > 0 ? propSchedule : defaultSchedule;

  return (
    <div className="w-full">
      {/* Horizontal rail — desktop */}
      <div className="hidden md:block">
        <div className="relative">
          <div
            className={`absolute top-[14px] left-0 right-0 h-0.5 ${dark ? "bg-gradient-to-r from-[#2d8b8b]/20 via-[#a8dadc]/45 to-[#2d8b8b]/20" : "bg-gradient-to-r from-[#2d8b8b]/25 via-[#1a2332]/40 to-[#2d8b8b]/25"}`}
          />

          <div className="flex justify-between relative">
            {schedule.map((item, index) => (
              <motion.div
                key={`${item.time}-${index}`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12, duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`w-7 h-7 rounded-full ${dark ? "bg-[#0d1620] border-2 border-[#a8dadc]/70" : "bg-[#f1faee] border-2 border-[#2d8b8b]/70"} relative z-10 mb-4 shadow-[0_0_0_4px_rgba(45,139,139,0.1)] flex items-center justify-center`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${dark ? "bg-[#a8dadc]" : "bg-[#2d8b8b]"}`} />
                </div>

                <p className={`font-sans text-sm font-bold tabular-nums mb-1 tracking-[0.05em] ${dark ? "text-[#a8dadc]" : "text-[#2d8b8b]"}`}>
                  {item.time}
                </p>
                <p className={`font-sans text-xs tracking-wide ${dark ? "text-[#f1faee]/85" : "text-[#1a2332]"}`}>
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Vertical — mobile */}
      <div className="md:hidden">
        <div className="relative">
          <div
            className={`absolute top-0 bottom-0 left-[13px] w-0.5 ${dark ? "bg-gradient-to-b from-[#2d8b8b]/30 via-[#a8dadc]/40 to-[#2d8b8b]/30" : "bg-gradient-to-b from-[#2d8b8b]/30 via-[#1a2332]/40 to-[#2d8b8b]/30"}`}
          />

          {schedule.map((item, index) => (
            <motion.div
              key={`${item.time}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-start gap-5 relative pb-7 last:pb-0"
            >
              <div
                className={`shrink-0 w-7 h-7 rounded-full ${dark ? "bg-[#0d1620] border-2 border-[#a8dadc]/70" : "bg-[#f1faee] border-2 border-[#2d8b8b]/70"} flex items-center justify-center relative z-10`}
              >
                <WaveIcon size={12} className={dark ? "text-[#a8dadc]" : "text-[#2d8b8b]"} />
              </div>

              <div className="flex-1">
                <p className={`font-sans text-sm font-bold tabular-nums ${dark ? "text-[#a8dadc]" : "text-[#2d8b8b]"}`}>
                  {item.time}
                </p>
                <p className={`font-sans text-sm mt-0.5 ${dark ? "text-[#f1faee]/85" : "text-[#1a2332]"}`}>
                  {item.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
