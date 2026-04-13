"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { HeartIcon } from "../_icons/HeartIcon";

type RsvpStatus = "confirmed" | "declined";

interface AdditionalGuest {
  id: string;
  name: string;
}

const inputClass =
  "w-full h-12 rounded-lg border border-[#1a1a2e]/10 bg-transparent px-4 text-sm text-[#1a1a2e] placeholder:text-[#a09ba6] focus:border-[#b49a7c] focus:outline-none focus:ring-1 focus:ring-[#b49a7c]/20 transition-all font-sans";

export function RsvpForm() {
  const wedding = useWedding();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>("confirmed");
  const [additionalGuests, setAdditionalGuests] = useState<AdditionalGuest[]>(
    []
  );
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const weddingDate = new Date(wedding.weddingDate).toLocaleDateString(
    "tr-TR",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const addGuest = () => {
    setAdditionalGuests((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "" },
    ]);
  };

  const removeGuest = (id: string) => {
    setAdditionalGuests((prev) => prev.filter((g) => g.id !== id));
  };

  const updateGuest = (id: string, value: string) => {
    setAdditionalGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, name: value } : g))
    );
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
            ? additionalGuests
                .filter((g) => g.name.trim())
                .map((g) => ({ name: g.name.trim() }))
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
      toast.error(
        err instanceof Error ? err.message : t("rsvpErrorToast")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Left-aligned page header with rose-gold line */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="w-12 h-px bg-[#b49a7c] mb-6" />
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#a09ba6] mb-3">
          {t("navRsvp")}
        </p>
        <h2 className="font-merienda text-4xl text-[#1a1a2e]">
          {brideFirst} & {groomFirst}
        </h2>
        <p className="font-sans text-sm text-[#6d6a75] mt-2">
          {weddingDate} &middot; {wedding.weddingTime}
        </p>
        {wedding.venueName && (
          <p className="font-sans text-sm text-[#a09ba6] mt-1">
            {wedding.venueName}
          </p>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-[#1a1a2e]/[0.06] shadow-sm p-10 text-center space-y-5"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto"
            >
              <HeartIcon className="size-10 text-emerald-500" size={40} />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-merienda text-2xl text-[#1a1a2e]"
            >
              {t("rsvpSuccessTitle")}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-sans text-sm text-[#6d6a75] leading-relaxed"
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
            className="bg-white rounded-2xl border border-[#1a1a2e]/[0.06] shadow-sm p-8 space-y-6"
          >
            {/* Name */}
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-wider text-[#a09ba6]">
                {t("rsvpNamePlaceholder")} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("rsvpNamePlaceholder")}
                className={inputClass}
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-wider text-[#a09ba6]">
                {t("rsvpPhonePlaceholder")}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("rsvpPhonePlaceholder")}
                className={inputClass}
              />
            </div>

            {/* RSVP Toggle — two cards side by side */}
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-wider text-[#a09ba6]">
                {t("rsvpAttendanceLabel")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRsvpStatus("confirmed")}
                  className={cn(
                    "h-14 rounded-lg border text-sm font-sans font-medium transition-all",
                    rsvpStatus === "confirmed"
                      ? "bg-[#f0fdf4] border-emerald-200 text-emerald-700"
                      : "border-[#1a1a2e]/10 bg-white text-[#a09ba6] hover:text-[#6d6a75]"
                  )}
                >
                  {t("rsvpAttending")}
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpStatus("declined")}
                  className={cn(
                    "h-14 rounded-lg border text-sm font-sans font-medium transition-all",
                    rsvpStatus === "declined"
                      ? "bg-[#fff1f2] border-rose-200 text-rose-700"
                      : "border-[#1a1a2e]/10 bg-white text-[#a09ba6] hover:text-[#6d6a75]"
                  )}
                >
                  {t("rsvpNotAttending")}
                </button>
              </div>
            </div>

            {/* Additional Guests */}
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
                    <label className="font-sans text-xs uppercase tracking-wider text-[#a09ba6]">
                      {t("rsvpAdditionalGuests")}
                    </label>
                    <button
                      type="button"
                      onClick={addGuest}
                      className="flex items-center gap-1.5 text-xs font-sans text-[#b49a7c] hover:text-[#b49a7c]/80 transition-colors"
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
                          onChange={(e) =>
                            updateGuest(guest.id, e.target.value)
                          }
                          placeholder={t("rsvpGuestPlaceholder")}
                          className={cn(inputClass, "flex-1")}
                        />
                        <button
                          type="button"
                          onClick={() => removeGuest(guest.id)}
                          className="w-12 h-12 rounded-lg border border-[#1a1a2e]/10 bg-white flex items-center justify-center text-[#a09ba6] hover:text-rose-500 hover:border-rose-200 transition-all"
                        >
                          &times;
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Note */}
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-wider text-[#a09ba6]">
                {t("rsvpNotePlaceholder")}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("rsvpNotePlaceholder")}
                rows={3}
                className={cn(inputClass, "h-auto py-3 resize-none")}
              />
            </div>

            {/* Submit — rounded-lg, NOT rounded-full */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-lg bg-[#1a1a2e] text-white font-semibold font-sans text-sm transition-all hover:bg-[#1a1a2e]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? t("rsvpSubmitting") : t("rsvpSubmit")}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
