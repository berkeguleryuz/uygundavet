"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, type Variants } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Package,
  Users,
  CalendarDays,
  Mail,
  Loader2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function SidebarStep({
  step,
  currentStep,
  totalSteps,
}: {
  step: { id: number; name: string; description: string; icon: typeof Users };
  currentStep: number;
  totalSteps: number;
}) {
  const Icon = step.icon;
  const isCompleted = currentStep > step.id;
  const isCurrent = currentStep === step.id;

  return (
    <div className="relative flex items-center gap-4 py-4">
      {step.id !== totalSteps && (
        <div className="absolute left-6 top-10 h-full w-[2px] bg-white/10">
          <motion.div
            className="h-full w-full bg-white"
            initial={{ height: "0%" }}
            animate={{ height: isCompleted ? "100%" : "0%" }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}

      <motion.div
        className={cn(
          "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
          isCompleted
            ? "border-white bg-white text-black"
            : isCurrent
            ? "border-white bg-transparent text-white shadow-[0_0_0_4px_rgba(255,255,255,0.1)]"
            : "border-white/20 bg-transparent text-white/50"
        )}
        whileHover={{ scale: 1.05 }}
      >
        {isCompleted ? (
          <Check className="h-5 w-5" strokeWidth={3} />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </motion.div>

      <div className="flex flex-col">
        <span
          className={cn(
            "text-sm font-semibold transition-colors duration-300 font-sans",
            isCurrent || isCompleted ? "text-white" : "text-white/50"
          )}
        >
          {step.name}
        </span>
        <span className="text-xs text-white/40 font-sans">
          {step.description}
        </span>
      </div>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="space-y-2 font-sans text-left">
      <label className="text-sm font-medium text-white">
        {label} <span className="text-red-400">*</span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="flex h-12 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30 backdrop-blur-sm transition-all focus:border-white/60 focus:bg-white/10 focus:outline-hidden"
      />
    </div>
  );
}

export function WizardForm() {
  const t = useTranslations("Wizard");
  const { data: session, isPending } = authClient.useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isRegister, setIsRegister] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const isLoggedIn = !isPending && !!session?.user;

  const STEPS = [
    { id: 1, name: t("step1Name"), description: t("step1Desc"), icon: Users },
    { id: 2, name: t("step2Name"), description: t("step2Desc"), icon: CalendarDays },
    { id: 3, name: t("step3Name"), description: t("step3Desc"), icon: Package },
  ];

  const handleNext = () => {
    if (currentStep === 1 && !isLoggedIn) {
      toast.error(t("loginRequired"));
      return;
    }
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setAuthLoading(true);

    try {
      if (isRegister) {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name: "",
        });
        if (error) {
          toast.error(error.message || t("emailExists"));
        } else {
          toast.success(t("registerSuccess"));
          setShowEmailForm(false);
        }
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });
        if (error) {
          toast.error(t("loginError"));
        } else {
          toast.success(t("loginSuccess"));
          setShowEmailForm(false);
        }
      }
    } catch {
      toast.error(t("loginError"));
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12 text-center text-white">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider backdrop-blur font-chakra">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          {t("badge")}
        </div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-5xl font-merienda">
          {t("heading")}
        </h1>
        <p className="text-white/60 font-sans max-w-xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#1c1a1b]/80 backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

        <div className="grid lg:grid-cols-[320px_1fr]">
          <div className="border-b border-white/10 bg-black/40 p-8 lg:border-b-0 lg:border-r">
            <div className="space-y-1">
              {STEPS.map((step) => (
                <SidebarStep
                  key={step.id}
                  step={step}
                  currentStep={currentStep}
                  totalSteps={STEPS.length}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col p-8 lg:p-12">
            <div className="flex-1">
              <motion.div
                key={currentStep}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-white font-chakra uppercase text-left">
                    {STEPS[currentStep - 1].name}
                  </h2>
                  <p className="text-sm text-white/60 font-sans mt-2 text-left">
                    {STEPS[currentStep - 1].description}
                  </p>
                </div>

                <div className="min-h-[300px]">
                  {currentStep === 1 && (
                    <div className="flex flex-col gap-4 max-w-sm pt-4">
                      {isLoggedIn ? (
                        <div className="flex flex-col items-center gap-4 py-8">
                          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                            <Check className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-center">
                            <p className="text-white font-semibold font-sans text-lg">
                              {t("welcome")}, {session.user.name || session.user.email}
                            </p>
                            <p className="text-white/50 text-sm font-sans mt-1">
                              {t("loggedInInfo")}
                            </p>
                          </div>
                        </div>
                      ) : showEmailForm ? (
                        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
                          <div className="flex items-center gap-2 mb-2">
                            <button
                              type="button"
                              onClick={() => setShowEmailForm(false)}
                              className="text-white/50 hover:text-white transition-colors"
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </button>
                            <h3 className="text-white font-semibold font-sans">
                              {isRegister ? t("registerTitle") : t("loginTitle")}
                            </h3>
                          </div>

                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t("emailPlaceholder")}
                            className="h-12 w-full rounded-xl border border-white/20 bg-white/5 px-4 text-sm text-white placeholder:text-white/30 focus:border-white/60 focus:bg-white/10 focus:outline-hidden transition-all font-sans"
                          />
                          <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t("passwordPlaceholder")}
                            className="h-12 w-full rounded-xl border border-white/20 bg-white/5 px-4 text-sm text-white placeholder:text-white/30 focus:border-white/60 focus:bg-white/10 focus:outline-hidden transition-all font-sans"
                          />

                          <button
                            type="submit"
                            disabled={authLoading}
                            className="h-12 w-full rounded-xl bg-white text-black font-semibold font-sans hover:bg-white/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                          >
                            {authLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isRegister ? (
                              t("registerBtn")
                            ) : (
                              t("loginBtn")
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setIsRegister(!isRegister)}
                            className="text-sm text-white/50 hover:text-white transition-colors font-sans text-center"
                          >
                            {isRegister ? t("hasAccount") : t("noAccount")}
                          </button>
                        </form>
                      ) : (
                        <>
                          <button
                            onClick={() => authClient.signIn.social({ provider: "google" })}
                            className="flex items-center justify-center gap-3 w-full h-12 rounded-xl border border-white/20 bg-white text-black font-semibold hover:bg-white/90 transition-colors font-sans focus:outline-hidden"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            {t("googleConnect")}
                          </button>

                          <button
                            onClick={() => authClient.signIn.social({ provider: "facebook" })}
                            className="flex items-center justify-center gap-3 w-full h-12 rounded-xl border border-white/20 bg-[#1877F2] text-white font-semibold hover:bg-[#1877F2]/90 transition-colors font-sans focus:outline-hidden"
                          >
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            {t("facebookConnect")}
                          </button>

                          <div className="flex items-center gap-3 my-2">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-xs text-white/30 font-sans uppercase">{t("or")}</span>
                            <div className="flex-1 h-px bg-white/10" />
                          </div>

                          <button
                            onClick={() => setShowEmailForm(true)}
                            className="flex items-center justify-center gap-3 w-full h-12 rounded-xl border border-white/20 bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors font-sans focus:outline-hidden"
                          >
                            <Mail className="w-5 h-5" />
                            {t("emailConnect")}
                          </button>

                          <div className="p-4 mt-2 bg-white/5 border border-white/10 rounded-2xl">
                            <p className="text-sm text-white/70 text-center font-sans">
                              {t("infoBox")}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6 pt-2">
                      <div className="grid gap-6 md:grid-cols-2">
                        <InputField label={t("owner1")} placeholder={t("namePlaceholder")} />
                        <InputField label={t("owner2")} placeholder={t("namePlaceholder")} />
                        <InputField label={t("family1")} placeholder={t("namesPlaceholder")} />
                        <InputField label={t("family2")} placeholder={t("namesPlaceholder")} />
                        <InputField label={t("date")} placeholder={t("datePlaceholder")} type="date" />
                        <InputField label={t("time")} placeholder={t("timePlaceholder")} type="time" />
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6 h-full flex flex-col items-center justify-center text-center py-12">
                      <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-6">
                        <Package className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold font-merienda text-white">
                        {t("doneHeading")}
                      </h3>
                      <p className="text-white/60 font-sans max-w-sm mb-8">
                        {t("doneText")}
                      </p>
                      <button
                        className="h-14 px-8 rounded-xl bg-white text-black font-chakra uppercase tracking-widest text-sm hover:scale-105 transition-transform"
                        onClick={() => window.location.href = '/paketlerimiz'}
                      >
                        {t("doneCta")}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-8">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2 text-sm text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-chakra uppercase tracking-wider"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("back")}
              </button>

              {currentStep < STEPS.length && (
                <button
                  onClick={handleNext}
                  disabled={currentStep === 1 && !isLoggedIn}
                  className="flex items-center gap-2 rounded-xl border border-white/30 bg-white text-black px-8 py-3 text-sm font-chakra uppercase tracking-wider hover:bg-black hover:text-white hover:border-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {t("next")}
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
