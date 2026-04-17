"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { CompassIcon } from "../_icons/CompassIcon";
import { WaveIcon } from "../_icons/WaveIcon";

type RsvpStatus = "confirmed" | "declined";

function AnimatedCheckMark({ active }: { active: boolean }) {
  return (
    <motion.svg
      width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden
      animate={{ scale: active ? 1.06 : 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.circle
        cx="16" cy="16" r="13"
        stroke="currentColor" strokeWidth="1.5" fill="none"
        initial={false}
        animate={{ opacity: active ? 1 : 0.4 }}
        transition={{ duration: 0.25 }}
      />
      <motion.path
        d="M10 16.5 l4 4 8-9"
        stroke="currentColor" strokeWidth="2.4" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.4, delay: active ? 0.1 : 0, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.svg>
  );
}

function AnimatedCrossMark({ active }: { active: boolean }) {
  return (
    <motion.svg
      width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden
      animate={{ scale: active ? 1.06 : 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.circle
        cx="16" cy="16" r="13"
        stroke="currentColor" strokeWidth="1.5" fill="none"
        initial={false}
        animate={{ opacity: active ? 1 : 0.4 }}
        transition={{ duration: 0.25 }}
      />
      <motion.path
        d="M11 11 L21 21"
        stroke="currentColor" strokeWidth="2.4" fill="none"
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.3, delay: active ? 0.1 : 0 }}
      />
      <motion.path
        d="M21 11 L11 21"
        stroke="currentColor" strokeWidth="2.4" fill="none"
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.3, delay: active ? 0.25 : 0 }}
      />
    </motion.svg>
  );
}

interface AdditionalGuest { id: string; name: string; }

const inputClass =
  "w-full h-12 rounded-xl border border-[#2d8b8b]/25 bg-white px-4 text-sm text-[#1a2332] placeholder:text-[#1a2332]/35 focus:border-[#2d8b8b] focus:outline-none focus:ring-2 focus:ring-[#2d8b8b]/20 transition-all font-sans";

export function RsvpForm() {
  const wedding = useWedding();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>("confirmed");
  const [additionalGuests, setAdditionalGuests] = useState<AdditionalGuest[]>([]);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const weddingDate = useMemo(
    () => new Date(wedding.weddingDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
    [wedding.weddingDate]
  );

  const addGuest = () => {
    setAdditionalGuests((prev) => [...prev, { id: crypto.randomUUID(), name: "" }]);
  };
  const removeGuest = (id: string) => {
    setAdditionalGuests((prev) => prev.filter((g) => g.id !== id));
  };
  const updateGuest = (id: string, value: string) => {
    setAdditionalGuests((prev) => prev.map((g) => (g.id === id ? { ...g, name: value } : g)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(t("rsvpNameRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      const body = {
        name: name.trim(),
        phone: phone.trim(),
        rsvpStatus,
        additionalGuests:
          rsvpStatus === "confirmed"
            ? additionalGuests.filter((g) => g.name.trim()).map((g) => ({ name: g.name.trim() }))
            : [],
        note: note.trim(),
        source: "website" as const,
      };

      const res = await fetch(`/api/public/rsvp/${wedding.inviteCode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || t("rsvpErrorToast"));
      }

      setIsSuccess(true);
      toast.success(t("rsvpSuccessToast"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("rsvpErrorToast"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <div className="inline-flex items-center gap-3 mb-3">
          <div className="h-px w-10 bg-[#2d8b8b]/50" />
          <CompassIcon size={18} className="text-[#2d8b8b]" />
          <div className="h-px w-10 bg-[#2d8b8b]/50" />
        </div>
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#2d8b8b] mb-3 font-semibold">
          {t("navRsvp")}
        </p>
        <h2 className="font-merienda text-4xl text-[#1a2332]">
          {brideFirst} &amp; {groomFirst}
        </h2>
        <p className="font-sans text-sm text-[#1a2332]/55 mt-2">
          {weddingDate}
          {wedding.weddingTime && ` · ${wedding.weddingTime}`}
        </p>
        {wedding.venueName && (
          <p className="font-sans text-sm text-[#1a2332]/35 mt-1">{wedding.venueName}</p>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-[#f1faee] rounded-[1.5rem] border border-[#2d8b8b]/25 shadow-sm p-10 text-center space-y-5"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              className="w-20 h-20 rounded-full bg-[#2d8b8b]/15 border-2 border-[#2d8b8b]/40 flex items-center justify-center mx-auto"
            >
              <CompassIcon size={36} className="text-[#2d8b8b]" />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-merienda text-2xl text-[#1a2332]"
            >
              {t("rsvpSuccessTitle")}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-sans text-sm text-[#1a2332]/55 leading-relaxed"
            >
              {t("rsvpSuccessMessage")}
            </motion.p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="bg-[#f1faee] rounded-[1.5rem] border border-[#2d8b8b]/20 shadow-sm p-8 space-y-6"
          >
            <div className="space-y-2">
              <label htmlFor="rsvp-name" className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#2d8b8b] font-bold">
                {t("rsvpNamePlaceholder")} *
              </label>
              <input
                id="rsvp-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("rsvpNamePlaceholder")}
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="rsvp-phone" className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#2d8b8b] font-bold">
                {t("rsvpPhonePlaceholder")}
              </label>
              <input
                id="rsvp-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("rsvpPhonePlaceholder")}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#2d8b8b] font-bold">
                {t("rsvpAttendanceLabel")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRsvpStatus("confirmed")}
                  className={cn(
                    "rounded-xl border flex flex-col items-center justify-center gap-1.5 py-3.5 px-2 transition-all",
                    rsvpStatus === "confirmed"
                      ? "bg-[#2d8b8b]/15 border-[#2d8b8b] text-[#2d8b8b]"
                      : "border-[#2d8b8b]/20 bg-white text-[#1a2332]/40 hover:text-[#2d8b8b]/70"
                  )}
                >
                  <AnimatedCheckMark active={rsvpStatus === "confirmed"} />
                  <span className="font-sans text-[13px] font-semibold tracking-wide">
                    {t("rsvpAttending")}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpStatus("declined")}
                  className={cn(
                    "rounded-xl border flex flex-col items-center justify-center gap-1.5 py-3.5 px-2 transition-all",
                    rsvpStatus === "declined"
                      ? "bg-[#1a2332]/10 border-[#1a2332]/60 text-[#1a2332]"
                      : "border-[#2d8b8b]/20 bg-white text-[#1a2332]/40 hover:text-[#1a2332]/70"
                  )}
                >
                  <AnimatedCrossMark active={rsvpStatus === "declined"} />
                  <span className="font-sans text-[13px] font-semibold tracking-wide">
                    {t("rsvpNotAttending")}
                  </span>
                </button>
              </div>
            </div>

            <AnimatePresence>
              {rsvpStatus === "confirmed" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#2d8b8b] font-bold">
                      {t("rsvpAdditionalGuests")}
                    </label>
                    <button
                      type="button"
                      onClick={addGuest}
                      className="flex items-center gap-1.5 text-xs font-sans font-bold text-[#2d8b8b] hover:text-[#1a2332] transition-colors tracking-wide"
                    >
                      + {t("rsvpAddGuest")}
                    </button>
                  </div>

                  <AnimatePresence>
                    {additionalGuests.map((guest) => (
                      <motion.div
                        key={guest.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={guest.name}
                          onChange={(e) => updateGuest(guest.id, e.target.value)}
                          placeholder={t("rsvpGuestPlaceholder")}
                          className={cn(inputClass, "flex-1")}
                        />
                        <button
                          type="button"
                          onClick={() => removeGuest(guest.id)}
                          className="w-12 h-12 rounded-xl border border-[#2d8b8b]/20 bg-white flex items-center justify-center text-[#1a2332]/40 hover:text-[#1a2332] hover:border-[#1a2332]/40 transition-all"
                        >
                          &times;
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label htmlFor="rsvp-note" className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#2d8b8b] font-bold">
                {t("rsvpNotePlaceholder")}
              </label>
              <textarea
                id="rsvp-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("rsvpNotePlaceholder")}
                rows={3}
                className={cn(inputClass, "h-auto py-3 resize-none")}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-[#1a2332] text-[#f1faee] font-bold font-sans text-sm tracking-[0.15em] uppercase transition-all hover:bg-[#2d8b8b] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <WaveIcon size={14} />
              {isSubmitting ? t("rsvpSubmitting") : t("rsvpSubmit")}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
