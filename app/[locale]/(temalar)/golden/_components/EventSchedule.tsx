"use client";

import { motion } from "framer-motion";
import { SunIcon } from "../_icons/SunIcon";

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

const dotAccents = ["text-[#f4a900]", "text-[#c1666b]", "text-[#d4b896]", "text-[#8a7560]"];

interface EventScheduleProps {
  schedule?: { time: string; label: string }[];
  dark?: boolean;
}

export function EventSchedule({ schedule: propSchedule, dark = false }: EventScheduleProps) {
  const schedule = propSchedule && propSchedule.length > 0 ? propSchedule : defaultSchedule;

  return (
    <div className="w-full">
      <div className="relative">
        <div className={`absolute top-0 bottom-0 left-[11px] w-px ${dark ? "bg-[#f4a900]/30" : "bg-[#c1666b]/35"}`} />

        {schedule.map((item, index) => (
          <motion.div
            key={`${item.time}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex items-start gap-5 relative pb-7 last:pb-0"
          >
            <div
              className={`shrink-0 w-[22px] h-[22px] rounded-full border flex items-center justify-center relative z-10 ${dark ? "bg-[#2d2620] border-[#f4a900]/50" : "bg-[#faf5ec] border-[#c1666b]/50"}`}
            >
              <SunIcon size={12} className={dotAccents[index % dotAccents.length]} />
            </div>

            <div className="flex-1 flex items-baseline gap-4 md:gap-6">
              <p className={`font-merienda text-lg tabular-nums shrink-0 ${dark ? "text-[#f4a900]" : "text-[#c1666b]"}`}>
                {item.time}
              </p>
              <div className={`h-px flex-1 ${dark ? "bg-[#d4b896]/20" : "bg-[#4a403a]/15"} relative top-[-2px]`} />
              <p className={`font-sans text-sm tracking-wide font-medium ${dark ? "text-[#faf5ec]/85" : "text-[#4a403a]"}`}>
                {item.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
