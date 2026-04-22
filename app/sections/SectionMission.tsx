"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";


function ScrollWord({
  children,
  progress,
  range,
  highlight = false
}: {
  children: React.ReactNode,
  progress: MotionValue<number>,
  range: [number, number],
  highlight?: boolean
}) {
  const opacity = useTransform(progress, range, [0.3, 1]);

  return (
    <motion.span style={{ opacity }} className={highlight ? "text-[#555670] font-merienda italic" : "text-[#252224]"} >
      {children}{" "}
    </motion.span>
  );
}

export function SectionMission() {
  const t = useTranslations("Mission");
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ["start 0.75", "end center"]
  });

  const p1 = t("paragraph1").split(" ");
  const p2 = t("paragraph2").split(" ");
  const highlights = t("highlights").split(",");

  return (
    <section ref={containerRef} data-theme="light" className="relative w-full pt-32 md:pt-44 pb-32 md:pb-44 px-6 bg-[#f5f6f3] flex flex-col items-center">

      <div ref={textRef} className="relative max-w-4xl mx-auto flex flex-col text-center font-sans mb-16">
        <p className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-[-1px] leading-snug">
          {p1.map((word, i) => {
            const start = i / (p1.length + p2.length);
            const end = start + (1 / (p1.length + p2.length));
            const cleanWord = word.replace(/[^\p{L}]/gu, '');
            const isHighlight = highlights.includes(cleanWord);
            return (
              <ScrollWord key={i} progress={scrollYProgress} range={[start, end]} highlight={isHighlight}>
                {word}
              </ScrollWord>
            );
          })}
        </p>

        <p className="text-xl md:text-2xl lg:text-3xl font-medium mt-10 leading-snug">
          {p2.map((word, i) => {
            const index = i + p1.length;
            const start = index / (p1.length + p2.length);
            const end = start + (1 / (p1.length + p2.length));
            return (
              <ScrollWord key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </ScrollWord>
            );
          })}
        </p>
      </div>

      <div className="w-full max-w-[700px] aspect-video rounded-2xl overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          onContextMenu={(e) => e.preventDefault()}
          className="w-full h-full object-cover"
        >
          <source src="/yuzuk.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
