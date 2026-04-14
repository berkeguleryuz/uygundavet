"use client";

import { AnimatePresence, motion } from "framer-motion";

interface CountdownUnitProps {
  value: number;
  label: string;
}

export function CountdownUnit({ value, label }: CountdownUnitProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[2.5rem] md:h-[3.5rem] overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="font-chakra text-3xl md:text-5xl text-white tabular-nums"
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="font-sans text-[9px] md:text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1.5">
        {label}
      </span>
    </div>
  );
}
