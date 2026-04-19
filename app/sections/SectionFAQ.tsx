"use client";

import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

function FAQItem({
  question,
  answer,
  index,
  num,
}: {
  question: string;
  answer: string;
  index: number;
  num: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      {...fadeUp(0.2 + index * 0.08)}
      className="group"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-5 text-left cursor-pointer py-6"
      >
        <span className="text-[#d5d1ad]/40 font-chakra text-sm tracking-wider shrink-0">
          {num}
        </span>

        <span className="flex-1 font-chakra text-xs md:text-sm text-foreground/90 uppercase tracking-wider font-medium">
          {question}
        </span>

        <div className="shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
          {open ? (
            <Minus className="w-3.5 h-3.5 text-[#d5d1ad]" />
          ) : (
            <Plus className="w-3.5 h-3.5 text-[#d5d1ad]" />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pl-[calc(1.25rem+1.25rem)] pb-6">
              <p className="text-muted-foreground text-sm font-sans leading-relaxed max-w-md">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-px bg-white/[0.06]" />
    </motion.div>
  );
}

export function SectionFAQ() {
  const t = useTranslations("FAQ");

  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
    { q: t("q6"), a: t("a6") },
    { q: t("q7"), a: t("a7") },
  ];

  const leftCol = faqs.filter((_, i) => i % 2 === 0);
  const rightCol = faqs.filter((_, i) => i % 2 === 1);

  return (
    <section
      id="sss"
      className="w-full py-32 md:py-44 px-6 bg-[#252224] border-t border-white/10"
    >
      <div className="max-w-6xl mx-auto">
        <motion.p
          {...fadeUp(0.1)}
          className="text-xs tracking-[3px] uppercase text-muted-foreground mb-4 font-sans text-center"
        >
          {t("label")}
        </motion.p>

        <motion.h2
          {...fadeUp(0.15)}
          className="text-4xl md:text-6xl text-[#d5d1ad] font-chakra mb-6 tracking-tight uppercase text-center"
        >
          {t("headingPrefix")}{" "}
          <span className="font-merienda italic lowercase text-white">
            {t("headingHighlight")}
          </span>{" "}
          {t("headingSuffix")}
        </motion.h2>

        <motion.p
          {...fadeUp(0.2)}
          className="text-muted-foreground text-lg mb-16 max-w-2xl mx-auto font-sans text-center"
        >
          {t("subtitle")}
        </motion.p>

        <div className="md:hidden">
          <div className="h-px bg-white/[0.06]" />
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.q}
              answer={faq.a}
              index={i}
              num={String(i + 1).padStart(2, "0")}
            />
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-2 gap-x-12 lg:gap-x-20">
          <div>
            <div className="h-px bg-white/[0.06]" />
            {leftCol.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.q}
                answer={faq.a}
                index={i * 2}
                num={String(i * 2 + 1).padStart(2, "0")}
              />
            ))}
          </div>
          <div>
            <div className="h-px bg-white/[0.06]" />
            {rightCol.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.q}
                answer={faq.a}
                index={i * 2 + 1}
                num={String(i * 2 + 2).padStart(2, "0")}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
