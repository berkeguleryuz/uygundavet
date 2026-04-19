"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useWedding } from "../_lib/context";
import { OrnamentalDivider } from "./OrnamentalDivider";
import { ScrollReveal } from "./ScrollReveal";
import { AnimatedCheckMark, AnimatedCrossMark } from "@/app/components/AnimatedRsvpMarks";

type RsvpStatus = "confirmed" | "declined";

interface AdditionalGuest {
  id: string;
  name: string;
}

const inputClass =
  "w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/20 focus:border-[#d5d1ad]/50 focus:outline-none transition-all font-sans";

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
      toast.error("Lütfen adınızı girin.");
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
        throw new Error(data?.error || "Bir hata oluştu");
      }

      setIsSuccess(true);
      toast.success("LCV'niz başarıyla kaydedildi!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Bir hata oluştu. Tekrar deneyin."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <ScrollReveal>
        <div className="text-center space-y-4 mb-8">
          <OrnamentalDivider />
          <h2 className="font-merienda text-3xl text-[#d5d1ad]">
            {brideFirst} & {groomFirst}
          </h2>
          <p className="font-sans text-sm text-white/50">
            {weddingDate} &middot; {wedding.weddingTime}
          </p>
          {wedding.venueName && (
            <p className="font-sans text-sm text-white/40">
              {wedding.venueName}
            </p>
          )}
        </div>
      </ScrollReveal>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-[#1c1a1b] rounded-2xl border border-white/10 p-10 text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto"
            >
              <Check className="size-8 text-emerald-400" />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-merienda text-2xl text-[#d5d1ad]"
            >
              Teşekkür Ederiz!
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-sans text-sm text-white/50"
            >
              LCV&apos;niz kaydedildi
            </motion.p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="bg-[#1c1a1b] rounded-2xl border border-white/10 p-6 space-y-6"
          >
            <div className="space-y-2">
              <label className="font-chakra text-xs uppercase tracking-wider text-white/40">
                Ad Soyad *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınızı girin"
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="font-chakra text-xs uppercase tracking-wider text-white/40">
                Telefon
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefon numaranız (isteğe bağlı)"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className="font-chakra text-xs uppercase tracking-wider text-white/40">
                Katılım Durumu
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRsvpStatus("confirmed")}
                  className={cn(
                    "rounded-xl border flex flex-col items-center justify-center gap-1.5 py-3.5 px-2 transition-all",
                    rsvpStatus === "confirmed"
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                      : "border-white/10 bg-white/5 text-white/40 hover:text-white/60"
                  )}
                >
                  <AnimatedCheckMark active={rsvpStatus === "confirmed"} />
                  <span className="font-sans text-[13px] font-medium tracking-wide">
                    Katılacağım
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpStatus("declined")}
                  className={cn(
                    "rounded-xl border flex flex-col items-center justify-center gap-1.5 py-3.5 px-2 transition-all",
                    rsvpStatus === "declined"
                      ? "bg-rose-500/15 border-rose-500/40 text-rose-400"
                      : "border-white/10 bg-white/5 text-white/40 hover:text-white/60"
                  )}
                >
                  <AnimatedCrossMark active={rsvpStatus === "declined"} />
                  <span className="font-sans text-[13px] font-medium tracking-wide">
                    Katılamayacağım
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
                    <label className="font-chakra text-xs uppercase tracking-wider text-white/40">
                      Ek Misafirler
                    </label>
                    <button
                      type="button"
                      onClick={addGuest}
                      className="flex items-center gap-1.5 text-xs font-sans text-[#d5d1ad]/70 hover:text-[#d5d1ad] transition-colors"
                    >
                      <Plus className="size-3.5" />
                      Misafir Ekle
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
                          placeholder="Misafir adı"
                          className={cn(inputClass, "flex-1")}
                        />
                        <button
                          type="button"
                          onClick={() => removeGuest(guest.id)}
                          className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/30 hover:text-rose-400 hover:border-rose-500/30 transition-all"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="font-chakra text-xs uppercase tracking-wider text-white/40">
                Not
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Bir notunuz var mı? (isteğe bağlı)"
                rows={3}
                className={cn(
                  inputClass,
                  "h-auto py-3 resize-none"
                )}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-[#d5d1ad] text-[#252224] font-semibold font-sans text-sm transition-all hover:bg-[#d5d1ad]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                "Gönder"
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
