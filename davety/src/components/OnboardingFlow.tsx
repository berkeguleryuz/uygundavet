"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { getOnboardingIcon } from "./OnboardingIcons";

const STEPS = 6;

/**
 * Onboarding "done" flag is scoped per-invitation so that creating a new
 * invitation re-triggers the walkthrough, once the user dismissed it on
 * any single invitation we used to never show it again, which made the
 * flow effectively invisible the second time someone visited the editor.
 */
function storageKey(docId?: string): string {
  return docId
    ? `davety.onboarding.v1.${docId}`
    : "davety.onboarding.v1";
}

export function OnboardingFlow({ docId }: { docId?: string }) {
  const t = useTranslations("Editor.onboarding");
  const [step, setStep] = useState<number | null>(null);

  useEffect(() => {
    // localStorage is the external system here, the deferred read pattern
    // matches React's "useEffect for external stores" guidance. The lint
    // rule still flags it, suppressed below.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (localStorage.getItem(storageKey(docId)) !== "done") setStep(0);
    } catch {
      // ignore
    }
  }, [docId]);

  function dismiss() {
    try {
      localStorage.setItem(storageKey(docId), "done");
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
          localStorage.setItem(storageKey(docId), "done");
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
                  ← {t("back")}
                </button>
              ) : null}
              <button
                onClick={next}
                className="text-xs rounded-full bg-primary text-primary-foreground px-5 py-2.5 font-chakra uppercase tracking-[0.2em] cursor-pointer"
              >
                {step === STEPS - 1 ? t("letsStart") : `→ ${t("next")}`}
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
