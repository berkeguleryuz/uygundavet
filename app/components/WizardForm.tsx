"use client";

import { useEffect, useState } from "react";
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
  Palette,
  CreditCard,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useWizardStore } from "@/store/wizard-store";
import { PricingCard } from "./PricingCard";
import { THEME_OPTIONS } from "@/lib/themes";
import { PACKAGES, type PackageKey } from "@/lib/packages";
import axios from "axios";

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

function WizardInput({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2 font-sans text-left">
      <label className="text-sm font-medium text-white">
        {label} <span className="text-red-400">*</span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-12 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30 backdrop-blur-sm transition-all focus:border-white/60 focus:bg-white/10 focus:outline-hidden"
      />
    </div>
  );
}

interface WizardFormProps {
  onComplete?: () => void;
}

export function WizardForm({ onComplete }: WizardFormProps = {}) {
  const t = useTranslations("Wizard");
  const tPricing = useTranslations("Pricing");
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const wizard = useWizardStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showVerifyBanner, setShowVerifyBanner] = useState(false);
  const [showResendVerify, setShowResendVerify] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isRegister, setIsRegister] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isLoggedIn = !isPending && !!session?.user;

  useEffect(() => {
    if (wizard.selectedPackage) return;
    try {
      const stored = localStorage.getItem("selectedPackage");
      if (stored === "starter" || stored === "pro" || stored === "business") {
        wizard.setPackage(stored);
        localStorage.removeItem("selectedPackage");
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const STEPS = [
    { id: 1, name: t("step1Name"), description: t("step1Desc"), icon: Users },
    { id: 2, name: t("step2Name"), description: t("step2Desc"), icon: CalendarDays },
    { id: 3, name: t("step3Name"), description: t("step3Desc"), icon: Package },
  ];

  const packages = [
    {
      key: "starter" as PackageKey,
      name: tPricing("starter.name"),
      price: tPricing("starter.price"),
      desc: tPricing("starter.desc"),
      cta: tPricing("starter.cta"),
      features: tPricing("starter.features").split(","),
    },
    {
      key: "pro" as PackageKey,
      name: tPricing("pro.name"),
      price: tPricing("pro.price"),
      desc: tPricing("pro.desc"),
      cta: tPricing("pro.cta"),
      features: tPricing("pro.features").split(","),
      badge: tPricing("pro.badge"),
      highlighted: true,
    },
    {
      key: "business" as PackageKey,
      name: tPricing("business.name"),
      price: tPricing("business.price"),
      desc: tPricing("business.desc"),
      cta: tPricing("business.cta"),
      features: tPricing("business.features").split(","),
    },
  ];

  const validateStep2 = () => {
    const required = [
      wizard.phone,
      wizard.owner1FirstName, wizard.owner1LastName,
      wizard.owner2FirstName, wizard.owner2LastName,
      wizard.weddingDate, wizard.weddingTime,
    ];
    if (!required.every((v) => v.trim().length > 0)) return false;

    const selectedDate = new Date(wizard.weddingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate <= today) return "invalidDate";

    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !isLoggedIn) {
      toast.error(t("loginRequired"));
      return;
    }
    if (currentStep === 2) {
      const result = validateStep2();
      if (result === false) {
        toast.error(t("fillAllFields"));
        return;
      }
      if (result === "invalidDate") {
        toast.error(t("invalidDate"));
        return;
      }
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
          callbackURL: "/login?verified=true",
        });
        if (error) {
          toast.error(error.message || t("emailExists"));
        } else {
          toast.success(t("verifyEmailSent"), { duration: 8000 });
          setShowEmailForm(false);
          setShowVerifyBanner(true);
        }
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });
        if (error) {
          const msg = error.message || "";
          if (msg.toLowerCase().includes("verify") || msg.toLowerCase().includes("email")) {
            toast.error(t("emailNotVerified"), { duration: 8000 });
            setShowResendVerify(true);
          } else {
            toast.error(t("loginError"));
          }
        } else {
          toast.success(t("loginSuccess"));
          setShowEmailForm(false);
          setShowResendVerify(false);
        }
      }
    } catch {
      toast.error(t("loginError"));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0 || !email) return;
    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: "/login?verified=true",
      });
      toast.success(t("verifyEmailResent"), { duration: 5000 });
      setResendCooldown(900);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch {
      toast.error(t("resendError"));
    }
  };

  const handleComplete = async () => {
    if (!wizard.selectedPackage) {
      toast.error(t("selectPackageRequired"));
      return;
    }
    if (!wizard.selectedTheme) {
      toast.error(t("selectThemeRequired"));
      return;
    }
    if (wizard.selectedTheme === "custom" && !wizard.customThemeRequest.trim()) {
      toast.error(t("customThemeRequired"));
      return;
    }
    if (!wizard.paymentMethod) {
      toast.error(t("selectPaymentRequired"));
      return;
    }

    setSubmitting(true);
    try {
      await axios.post("/api/orders", {
        phone: wizard.phone,
        owner1FirstName: wizard.owner1FirstName,
        owner1LastName: wizard.owner1LastName,
        owner2FirstName: wizard.owner2FirstName,
        owner2LastName: wizard.owner2LastName,
        weddingDate: wizard.weddingDate,
        weddingTime: wizard.weddingTime,
        selectedPackage: wizard.selectedPackage,
        selectedTheme: wizard.selectedTheme,
        customThemeRequest: wizard.customThemeRequest,
        paymentMethod: wizard.paymentMethod,
      });
      wizard.reset();
      if (onComplete) {
        onComplete();
      } else {
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error(t("orderExists"));
        if (onComplete) {
          onComplete();
        } else {
          router.push("/dashboard");
        }
      } else {
        toast.error(t("submitError"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const depositAmount = wizard.selectedPackage
    ? Math.round(PACKAGES[wizard.selectedPackage].price * PACKAGES[wizard.selectedPackage].depositPercent)
    : 0;
  const totalAmount = wizard.selectedPackage ? PACKAGES[wizard.selectedPackage].price : 0;

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12 text-center text-white">
        <div className="mb-4 inline-flex items-center rounded-full liquid-glass px-4 py-1.5 text-xs font-medium uppercase tracking-[3px] font-chakra text-muted-foreground">
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

                          {showResendVerify && !isRegister && (
                            <div className="p-3 bg-white/[0.04] border border-white/10 rounded-xl">
                              <div className="flex items-start gap-3 mb-3">
                                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-white/60 font-sans">
                                  {t("emailNotVerified")}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={handleResendVerification}
                                disabled={resendCooldown > 0}
                                className="w-full h-9 rounded-lg bg-white text-black text-xs font-semibold font-sans hover:bg-white/90 transition-colors cursor-pointer disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed"
                              >
                                {resendCooldown > 0
                                  ? t("resendCooldown", { minutes: Math.ceil(resendCooldown / 60) })
                                  : t("resendVerification")}
                              </button>
                            </div>
                          )}
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

                      {showVerifyBanner && !isLoggedIn && (
                        <div className="p-4 mt-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
                          <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-amber-300 font-sans">
                              {t("verifyEmailHeading")}
                            </p>
                            <p className="text-xs text-amber-300/60 font-sans mt-1">
                              {t("verifyEmailDesc")}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6 pt-2">
                      <div>
                        <WizardInput label={t("phoneLabel")} placeholder={t("phonePlaceholder")} type="tel" value={wizard.phone} onChange={(v) => wizard.setField("phone", v)} />
                      </div>
                      <div className="grid gap-6 md:grid-cols-2">
                        <WizardInput label={t("owner1FirstName")} placeholder={t("firstNamePlaceholder")} value={wizard.owner1FirstName} onChange={(v) => wizard.setField("owner1FirstName", v)} />
                        <WizardInput label={t("owner1LastName")} placeholder={t("lastNamePlaceholder")} value={wizard.owner1LastName} onChange={(v) => wizard.setField("owner1LastName", v)} />
                        <WizardInput label={t("owner2FirstName")} placeholder={t("firstNamePlaceholder")} value={wizard.owner2FirstName} onChange={(v) => wizard.setField("owner2FirstName", v)} />
                        <WizardInput label={t("owner2LastName")} placeholder={t("lastNamePlaceholder")} value={wizard.owner2LastName} onChange={(v) => wizard.setField("owner2LastName", v)} />
                      </div>

                      <div className="border-t border-white/10 pt-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          <WizardInput label={t("date")} placeholder="" type="date" value={wizard.weddingDate} onChange={(v) => wizard.setField("weddingDate", v)} />
                          <WizardInput label={t("time")} placeholder="" type="time" value={wizard.weddingTime} onChange={(v) => wizard.setField("weddingTime", v)} />
                        </div>
                        <p className="text-xs text-white/40 font-sans mt-4 text-center leading-relaxed">
                          {t("infoEditable")}
                        </p>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-10">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Package className="w-4 h-4 text-[#d5d1ad]" />
                          <h3 className="text-sm font-chakra uppercase tracking-[0.15em] text-white/70">
                            {t("selectPackage")}
                          </h3>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          {packages.map(({ key, ...rest }) => (
                            <PricingCard
                              key={key}
                              {...rest}
                              compact
                              selected={wizard.selectedPackage === key}
                              onSelect={() => wizard.setPackage(key)}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Palette className="w-4 h-4 text-[#d5d1ad]" />
                          <h3 className="text-sm font-chakra uppercase tracking-[0.15em] text-white/70">
                            {t("selectTheme")}
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-1">
                          {THEME_OPTIONS.map((theme) => (
                            <button
                              key={theme.key}
                              type="button"
                              onClick={() => wizard.setTheme(theme.key)}
                              className={cn(
                                "relative rounded-2xl overflow-hidden aspect-[3/4] border-2 transition-all cursor-pointer group",
                                wizard.selectedTheme === theme.key
                                  ? "border-[#d5d1ad] ring-1 ring-[#d5d1ad]/50"
                                  : "border-white/10 hover:border-white/30"
                              )}
                            >
                              {"video" in theme && theme.video ? (
                                <video
                                  src={theme.image}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <Image
                                  src={theme.image}
                                  alt={theme.key}
                                  fill
                                  sizes="150px"
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              )}
                              <div className="absolute inset-0 bg-black/30" />
                              <span className="absolute bottom-2 left-0 right-0 text-center text-xs font-chakra uppercase tracking-wider text-white">
                                {theme.key}
                              </span>
                              {wizard.selectedTheme === theme.key && (
                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#d5d1ad] flex items-center justify-center">
                                  <Check className="w-3 h-3 text-[#252224]" strokeWidth={3} />
                                </div>
                              )}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => wizard.setTheme("custom")}
                            className={cn(
                              "rounded-2xl aspect-[3/4] border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-2",
                              wizard.selectedTheme === "custom"
                                ? "border-[#d5d1ad] ring-1 ring-[#d5d1ad]/50 bg-white/5"
                                : "border-white/10 hover:border-white/30 bg-white/[0.02]"
                            )}
                          >
                            <Palette className="w-6 h-6 text-white/50" />
                            <span className="text-xs font-chakra uppercase tracking-wider text-white/50">
                              {t("customTheme")}
                            </span>
                            <span className="text-[10px] text-amber-400/70 font-sans">
                              {t("customThemeExtra")}
                            </span>
                          </button>
                        </div>
                        {wizard.selectedTheme === "custom" && (
                          <div className="mt-3 space-y-2">
                            <textarea
                              value={wizard.customThemeRequest}
                              onChange={(e) => wizard.setField("customThemeRequest", e.target.value)}
                              placeholder={t("customThemePlaceholder")}
                              className="w-full h-24 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/60 focus:bg-white/10 focus:outline-hidden transition-all font-sans resize-none"
                            />
                            <p className="text-xs text-amber-400/60 font-sans">
                              {t("customThemeWhatsapp")}
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <CreditCard className="w-4 h-4 text-[#d5d1ad]" />
                          <h3 className="text-sm font-chakra uppercase tracking-[0.15em] text-white/70">
                            {t("paymentMethod")}
                          </h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => wizard.setPaymentMethod("deposit")}
                            className={cn(
                              "rounded-2xl border-2 p-5 text-left transition-all cursor-pointer",
                              wizard.paymentMethod === "deposit"
                                ? "border-[#d5d1ad] bg-white/5"
                                : "border-white/10 hover:border-white/30"
                            )}
                          >
                            <p className="text-sm font-semibold text-white font-sans">{t("depositOption")}</p>
                            <p className="text-xs text-white/50 font-sans mt-1">
                              {t("depositDesc", { deposit: depositAmount.toLocaleString("tr-TR"), remaining: (totalAmount - depositAmount).toLocaleString("tr-TR") })}
                            </p>
                          </button>
                          <button
                            type="button"
                            onClick={() => wizard.setPaymentMethod("full")}
                            className={cn(
                              "rounded-2xl border-2 p-5 text-left transition-all cursor-pointer",
                              wizard.paymentMethod === "full"
                                ? "border-[#d5d1ad] bg-white/5"
                                : "border-white/10 hover:border-white/30"
                            )}
                          >
                            <p className="text-sm font-semibold text-white font-sans">{t("fullPaymentOption")}</p>
                            <p className="text-xs text-white/50 font-sans mt-1">
                              {t("fullPaymentDesc", { total: totalAmount.toLocaleString("tr-TR") })}
                            </p>
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleComplete}
                        disabled={submitting}
                        className="w-full h-14 rounded-xl bg-white text-black font-chakra uppercase tracking-widest text-sm font-semibold hover:bg-white/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {submitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            {t("completeRegistration")}
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {currentStep < 3 && (
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-8">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 text-sm text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-chakra uppercase tracking-wider"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("back")}
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentStep === 1 && !isLoggedIn}
                  className="flex items-center gap-2 rounded-xl border border-white/30 bg-white text-black px-8 py-3 text-sm font-chakra uppercase tracking-wider hover:bg-black hover:text-white hover:border-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {t("next")}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
