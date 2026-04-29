"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { getOnboardingIcon } from "./OnboardingIcons";

const STORAGE_KEY = "davety.onboarding.v1";

const STEPS = 6;

export function OnboardingFlow() {
  const t = useTranslations("Editor.onboarding");
  const [step, setStep] = useState<number | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "done") setStep(0);
    } catch {
      // ignore
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "done");
    } catch {
      // ignore
    }
    setStep(null);
  }

  function next() {
    setStep((s) => {
      if (s === null) return null;
      if (s + 1 >= STEPS) {
        try {
          localStorage.setItem(STORAGE_KEY, "done");
        } catch {}
        return null;
      }
      return s + 1;
    });
  }

  function prev() {
    setStep((s) => (s === null ? null : Math.max(0, s - 1)));
  }

  const content = step === null ? null : stepContent(step, t);

  return (
    <AnimatePresence>
      {step !== null && content ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-card rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted cursor-pointer"
              aria-label="close"
            >
              <X className="size-4" />
            </button>

            <div className="text-center">
              <div className="mb-3 flex items-center justify-center">
                {getOnboardingIcon(step)}
              </div>
              {content.title ? (
                <h3 className="font-display text-2xl mb-2">{content.title}</h3>
              ) : null}
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {content.body}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              {step > 0 ? (
                <button
                  onClick={prev}
                  className="text-xs rounded-full bg-warning/20 text-warning px-5 py-2.5 font-chakra uppercase tracking-[0.2em] cursor-pointer"
                >
                  ← Geri Git
                </button>
              ) : null}
              <button
                onClick={next}
                className="text-xs rounded-full bg-primary text-primary-foreground px-5 py-2.5 font-chakra uppercase tracking-[0.2em] cursor-pointer"
              >
                → İlerle
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-1">
              {Array.from({ length: STEPS }).map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i === step ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function stepContent(
  step: number,
  t: (k: string) => string
): { title?: string; body: string } | null {
  switch (step) {
    case 0:
      return { title: t("congrats"), body: t("firstStep") };
    case 1:
      return { body: t("editHint") };
    case 2:
      return { body: t("buttonsHint") + "\n\n" + t("hideButton") };
    case 3:
      return { body: t("infoButton") };
    case 4:
      return { body: t("styleButton") };
    case 5:
      return { body: t("spacingButtons") + "\n\n" + t("yellowHint") };
    default:
      return null;
  }
}
