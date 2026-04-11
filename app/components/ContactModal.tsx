"use client";

import { useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { X, Loader2, User, Mail, Phone, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Logo } from "./Logo";

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

const PATH_FLAT = "M 0 100 V 100 Q 50 100 100 100 V 100 z";
const PATH_CURVE = "M 0 100 V 50 Q 50 0 100 50 V 100 z";
const PATH_FULL = "M 0 100 V 0 Q 50 0 100 0 V 100 z";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
});

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const t = useTranslations("ContactModal");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const pathControls = useAnimation();
  const textControls = useAnimation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const firstError = result.error.errors[0];
      if (firstError.path[0] === "name") toast.error(t("errorName"));
      else if (firstError.path[0] === "email") toast.error(t("errorEmail"));
      else if (firstError.path[0] === "phone") toast.error(t("errorPhone"));
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/contact", { ...formData, note: "" });
      toast.success(t("successTitle"));
      onClose();
      setFormData({ name: "", email: "", phone: "" });
    } catch {
      toast.error(t("errorMessage"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
    setFormData({ name: "", email: "", phone: "" });
  };

  const handleBtnEnter = async () => {
    textControls.start({ color: "#f5f6f3", transition: { duration: 0.4 } });
    await pathControls.start({ d: PATH_CURVE, transition: { duration: 0.2, ease: "easeIn" } });
    await pathControls.start({ d: PATH_FULL, transition: { duration: 0.2, ease: "easeOut" } });
  };

  const handleBtnLeave = async () => {
    textControls.start({ color: "#1c1a1b", transition: { duration: 0.4 } });
    await pathControls.start({ d: PATH_CURVE, transition: { duration: 0.2, ease: "easeIn" } });
    await pathControls.start({ d: PATH_FLAT, transition: { duration: 0.2, ease: "easeOut" } });
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all font-sans";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={springTransition}
            className="fixed inset-0 z-[71] flex items-center justify-center px-6 pointer-events-none"
          >
            <div
              className="relative w-full max-w-lg rounded-3xl bg-[#1c1a1b] border border-white/10 overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative px-8 pt-8 pb-6 border-b border-white/5">
                <div className="absolute inset-0 bg-linear-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />

                <button
                  onClick={handleClose}
                  className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors z-10 cursor-pointer"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>

                <Logo className="w-9 h-9 mb-5 relative z-10" />

                <h3 className="font-merienda text-2xl text-white relative z-10">
                  {t("title")}
                </h3>
                <p className="text-white/40 text-sm font-sans mt-1.5 relative z-10">
                  {t("subtitle")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="px-8 py-7 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-white/60 text-xs font-sans uppercase tracking-wider flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    {t("nameLabel")}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("namePlaceholder")}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-white/60 text-xs font-sans uppercase tracking-wider flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" />
                      {t("emailLabel")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t("emailPlaceholder")}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-white/60 text-xs font-sans uppercase tracking-wider flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" />
                      {t("phoneLabel")}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t("phonePlaceholder")}
                      className={inputClass}
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  onMouseEnter={handleBtnEnter}
                  onMouseLeave={handleBtnLeave}
                  whileTap={{ scale: 0.97 }}
                  className="relative w-full mt-1 rounded-xl overflow-hidden bg-white text-[#1c1a1b] py-4 font-chakra text-sm uppercase tracking-[0.15em] font-semibold disabled:opacity-60 cursor-pointer"
                >
                  <div className="absolute inset-0 pointer-events-none">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                      <motion.path d={PATH_FLAT} fill="#252224" animate={pathControls} />
                    </svg>
                  </div>
                  <motion.span
                    className="relative z-10 flex items-center justify-center gap-2"
                    animate={textControls}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t("sending")}
                      </>
                    ) : (
                      <>
                        {t("submit")}
                        <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.span>
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
