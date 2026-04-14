"use client";

import { motion } from "framer-motion";

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

const dotColors = [
  "bg-[#c75050]", // rose
  "bg-[#d4898a]", // pink
  "bg-[#c9a96e]", // gold
  "bg-[#8a5a5a]", // muted rose
];

interface EventScheduleProps {
  schedule?: { time: string; label: string }[];
  dark?: boolean;
}

export function EventSchedule({ schedule: propSchedule, dark = false }: EventScheduleProps) {
  const schedule =
    propSchedule && propSchedule.length > 0 ? propSchedule : defaultSchedule;

  return (
    <div className="w-full">
      <div className="hidden md:block">
        <div className="relative">
          <div className="absolute top-3 left-0 right-0 h-0.5 bg-gradient-to-r from-[#c75050] to-[#d4898a] rounded-full" />

          <div className="flex justify-between relative">
            {schedule.map((item, index) => (
              <motion.div
                key={item.time}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`w-3 h-3 rounded-full ${dotColors[index % dotColors.length]} border-2 ${dark ? "border-[#1a1210]" : "border-[#f5ebe4]"} relative z-10 mb-4 shadow-sm`}
                />

                <p className={`font-merienda text-sm mb-1 ${dark ? "text-[#c75050]" : "text-[#c75050]"}`}>
                  {item.time}
                </p>
                <p className={`font-sans text-sm ${dark ? "text-white" : "text-[#1a1210]"}`}>
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-[5px] w-0.5 bg-gradient-to-b from-[#c75050] to-[#d4898a] rounded-full" />

          {schedule.map((item, index) => (
            <motion.div
              key={item.time}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="flex items-start gap-5 relative">
                <div
                  className={`w-3 h-3 rounded-full ${dotColors[index % dotColors.length]} shrink-0 mt-1 relative z-10 shadow-sm`}
                />

                <div className="pb-7">
                  <p className="font-merienda text-sm text-[#c75050]">
                    {item.time}
                  </p>
                  <p className={`font-sans text-sm mt-0.5 ${dark ? "text-white" : "text-[#1a1210]"}`}>
                    {item.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
