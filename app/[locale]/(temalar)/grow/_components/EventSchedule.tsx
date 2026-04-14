"use client";

import { ScrollReveal } from "./ScrollReveal";

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
}

export function EventSchedule({ schedule: propSchedule }: EventScheduleProps) {
  const schedule =
    propSchedule && propSchedule.length > 0 ? propSchedule : defaultSchedule;
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        {schedule.map((item, index) => (
          <ScrollReveal key={item.time} delay={index * 0.1}>
            <div className="flex items-start gap-6 relative">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-[#d5d1ad]/80 border-2 border-[#d5d1ad]/40 shrink-0 mt-0.5" />
                {index < schedule.length - 1 && (
                  <div className="w-px h-12 bg-[#d5d1ad]/15" />
                )}
              </div>

              <div className="pb-8">
                <p className="font-chakra text-sm text-[#d5d1ad] tracking-wider">
                  {item.time}
                </p>
                <p className="font-sans text-sm text-white/70 mt-0.5">
                  {item.label}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
