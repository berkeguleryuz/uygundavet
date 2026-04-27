"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Hand,
  Layers,
  MousePointerClick,
  Save,
  Sparkles,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useUIStore } from "@/src/store/ui-store";
import { useEditorStore } from "@/src/store/editor-store";

const STORAGE_KEY = "davety.mobileHint.dismissed.v1";

interface HintCue {
  id: string;
  icon: LucideIcon;
  /** Short title rendered in bold. */
  title: string;
  /** Body explanation. */
  body: string;
  /** Which bottom-toolbar slot to point at: 0=Tasarla 1=Blok 2=Önizle 3=Kaydet, or null for none. */
  pointAt: 0 | 1 | 2 | 3 | null;
  /** Tone — affects accent colour. */
  tone: "info" | "success" | "warn";
}

/**
 * Persistent contextual coach mark that sits just above the mobile bottom
 * toolbar. The message updates based on the current editor state — what
 * the user just selected, whether there are unsaved changes, etc. — and
 * an animated arrow points at the toolbar button they should tap next.
 *
 * Hidden permanently once the user dismisses with X (per-device).
 */
export function MobileHintBar() {
  const panelMode = useUIStore((s) => s.panelMode);
  const selectedBlockId = useUIStore((s) => s.selectedBlockId);
  const selectedFieldId = useUIStore((s) => s.selectedFieldId);
  const dirty = useEditorStore((s) => s.dirty);
  const doc = useEditorStore((s) => s.doc);

  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    // Defer the setState off the synchronous effect tick so React 19's
    // purity rule doesn't flag the dismissed-state read as unstable.
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        if (localStorage.getItem(STORAGE_KEY) === "1") setDismissed(true);
      } catch {
        // ignore
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }

  if (dismissed) return null;

  // Determine the most relevant cue based on current state.
  const cue = computeCue({
    panelMode,
    selectedBlockId,
    selectedFieldId,
    dirty,
    blockLabel: blockTypeLabel(
      doc?.blocks.find((b) => b.id === selectedBlockId)?.type,
    ),
    fieldLabel: selectedFieldId,
  });

  return (
    <div
      className="md:hidden fixed inset-x-0 z-40 px-3 pointer-events-none"
      style={{
        bottom: "calc(56px + env(safe-area-inset-bottom, 0px) + 8px)",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={cue.id}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="pointer-events-auto"
        >
          <HintCard cue={cue} onDismiss={dismiss} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function HintCard({
  cue,
  onDismiss,
}: {
  cue: HintCue;
  onDismiss: () => void;
}) {
  const tone = TONE_CLASSES[cue.tone];

  // Each toolbar slot is 25% wide; centre of slot N is (N + 0.5) * 25%.
  const arrowLeft = cue.pointAt === null ? null : `${(cue.pointAt + 0.5) * 25}%`;

  return (
    <div
      className={`relative mx-auto max-w-md rounded-2xl border shadow-lg ${tone.card} px-3 py-2.5 pr-9`}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={`size-7 shrink-0 rounded-full inline-flex items-center justify-center ${tone.icon}`}
        >
          <cue.icon className="size-3.5" />
        </span>
        <div className="min-w-0">
          <div className={`text-[12px] font-medium leading-tight ${tone.title}`}>
            {cue.title}
          </div>
          <div className="text-[11px] leading-snug text-muted-foreground mt-0.5">
            {cue.body}
          </div>
        </div>
      </div>

      <button
        onClick={onDismiss}
        className="absolute top-1.5 right-1.5 size-6 rounded-full inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
        aria-label="İpucunu kapat"
      >
        <X className="size-3" />
      </button>

      {/* Pointing arrow + ripple — guides the eye to the relevant toolbar slot */}
      {arrowLeft ? (
        <div
          className="absolute -bottom-2 -translate-x-1/2"
          style={{ left: arrowLeft }}
          aria-hidden="true"
        >
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, 4, 0] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`inline-flex items-center justify-center size-5 rounded-full ${tone.arrowBg} shadow`}
          >
            <ChevronDown className={`size-3 ${tone.arrowText}`} />
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}

function computeCue({
  panelMode,
  selectedBlockId,
  selectedFieldId,
  dirty,
  blockLabel,
  fieldLabel,
}: {
  panelMode: string;
  selectedBlockId: string | null;
  selectedFieldId: string | null;
  dirty: boolean;
  blockLabel: string | null;
  fieldLabel: string | null;
}): HintCue {
  // 1) Highest priority — text/field is selected → push them to "Metin"
  if (panelMode === "text" && selectedFieldId) {
    return {
      id: "field-selected",
      icon: Sparkles,
      title: `${prettyFieldLabel(fieldLabel)} düzenleniyor`,
      body: "Yazı, renk, font ve süslemeler için aşağıdaki Metin sekmesini aç.",
      pointAt: 1,
      tone: "info",
    };
  }

  // 2) Block selected → push to "Blok"
  if (panelMode === "block" && selectedBlockId) {
    return {
      id: "block-selected",
      icon: Layers,
      title: `${blockLabel ?? "Blok"} seçildi`,
      body: "Görünürlük, ikon ve diğer ayarlar için Blok sekmesini aç.",
      pointAt: 1,
      tone: "info",
    };
  }

  // 3) Unsaved changes → push to "Kaydet"
  if (dirty) {
    return {
      id: "unsaved",
      icon: Save,
      title: "Değişiklik kaydedilmedi",
      body: "Kaydet'e dokunarak çalışmanı güvenceye al.",
      pointAt: 3,
      tone: "warn",
    };
  }

  // 4) Default home — guide user to start editing
  if (panelMode === "home") {
    return {
      id: "home",
      icon: MousePointerClick,
      title: "Düzenlemeye başla",
      body: "Davetiyeden bir blok ya da yazıya dokun, ya da Tasarla'dan tema seç.",
      pointAt: 0,
      tone: "info",
    };
  }

  return {
    id: "fallback",
    icon: Hand,
    title: "Hazırsın",
    body: "Davetiyeyi gözden geçir; hazır olunca Önizle'ye dokun.",
    pointAt: 2,
    tone: "info",
  };
}

const TONE_CLASSES: Record<
  HintCue["tone"],
  {
    card: string;
    icon: string;
    title: string;
    arrowBg: string;
    arrowText: string;
  }
> = {
  info: {
    card: "bg-background border-border",
    icon: "bg-primary/10 text-primary",
    title: "text-foreground",
    arrowBg: "bg-primary",
    arrowText: "text-primary-foreground",
  },
  success: {
    card: "bg-emerald-50 border-emerald-200",
    icon: "bg-emerald-500/15 text-emerald-700",
    title: "text-emerald-900",
    arrowBg: "bg-emerald-500",
    arrowText: "text-white",
  },
  warn: {
    card: "bg-amber-50 border-amber-200",
    icon: "bg-amber-500/15 text-amber-700",
    title: "text-amber-900",
    arrowBg: "bg-amber-500",
    arrowText: "text-white",
  },
};

function blockTypeLabel(type?: string | null): string | null {
  if (!type) return null;
  const map: Record<string, string> = {
    hero: "Kapak",
    countdown: "Geri Sayım",
    families: "Aile Bilgileri",
    event_program: "Etkinlik Programı",
    venue: "Mekân",
    story_timeline: "Hikâye Zaman Çizelgesi",
    gallery: "Galeri",
    memory_book: "Anı Defteri",
    rsvp_form: "Katılım Formu",
    donation: "Bağış",
    custom_note: "Özel Not",
    custom_section: "Özel Bölüm",
    cta: "Çağrı Butonu",
    contact: "İletişim",
    footer: "Alt Bilgi",
    decoration: "Süsleme",
  };
  return map[type] ?? type;
}

function prettyFieldLabel(field?: string | null): string {
  if (!field) return "Metin";
  const map: Record<string, string> = {
    brideName: "Gelin adı",
    groomName: "Damat adı",
    coupleNames: "Çift adları",
    subtitle: "Alt başlık",
    description: "Açıklama",
    title: "Başlık",
    body: "Gövde",
    heading: "Başlık",
    venueName: "Mekân adı",
    venueAddress: "Mekân adresi",
    text: "Metin",
    targetIso: "Etkinlik tarihi",
    prompt: "Soru",
  };
  return map[field] ?? "Metin";
}
