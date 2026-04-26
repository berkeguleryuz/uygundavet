"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FileText, MailOpen, Music, ChevronDown } from "lucide-react";
import type { Block, HeroData, HeroVariant } from "@davety/schema";
import { useRouter } from "@/i18n/navigation";
import { useEditorStore } from "@/src/store/editor-store";
import { useUIStore } from "@/src/store/ui-store";
import { useManualSave } from "@/src/hooks/useManualSave";
import { DesignTab } from "./DesignTab";
import { EnvelopeTab } from "./EnvelopeTab";
import { MusicTab } from "./MusicTab";

export function DesignHomePanel() {
  const t = useTranslations("Editor");
  const router = useRouter();
  const docId = useEditorStore((s) => s.docId);
  const dirty = useEditorStore((s) => s.dirty);
  const togglePreview = useUIStore((s) => s.togglePreview);
  const tab = useUIStore((s) => s.designTab);
  const setTab = useUIStore((s) => s.setDesignTab);
  const { save, saving } = useManualSave();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  async function handleSaveAndPublish() {
    if (dirty) {
      const ok = await save();
      if (!ok) return;
    }
    router.push(`/design/invitations/${docId}/save`);
  }

  return (
    <div className="p-5 flex flex-col gap-4">
      <button
        onClick={handleSaveAndPublish}
        disabled={saving}
        className="rounded-md bg-primary text-primary-foreground py-3 font-medium text-sm cursor-pointer hover:opacity-90 disabled:opacity-60"
      >
        {saving ? "Kaydediliyor…" : t("mainButton")}
      </button>

      <div className="grid grid-cols-3 gap-2 text-center">
        <TabButton
          icon={<FileText className="size-5" />}
          label={t("tabs.design")}
          active={tab === "design"}
          onClick={() => setTab("design")}
        />
        <TabButton
          icon={<MailOpen className="size-5" />}
          label={t("tabs.envelope")}
          active={tab === "envelope"}
          onClick={() => setTab("envelope")}
        />
        <TabButton
          icon={<Music className="size-5" />}
          label={t("tabs.music")}
          active={tab === "music"}
          onClick={() => setTab("music")}
        />
      </div>

      <div className={`grid gap-2 ${tab === "design" ? "grid-cols-2" : "grid-cols-1"}`}>
        <button
          onClick={togglePreview}
          className="rounded-md border border-border py-2 text-xs cursor-pointer hover:bg-muted"
        >
          ▶ {t("viewChanges")}
        </button>
        {tab === "design" ? (
          <button
            onClick={() => setAdvancedOpen((v) => !v)}
            className={`rounded-md border py-2 text-xs cursor-pointer hover:bg-muted inline-flex items-center justify-center gap-1 ${
              advancedOpen
                ? "border-foreground bg-muted"
                : "border-border"
            }`}
          >
            ⚙ {t("advanced")}
            <ChevronDown
              className={`size-3 transition-transform ${
                advancedOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        ) : null}
      </div>

      {tab === "design" && advancedOpen ? <AdvancedInlinePanel /> : null}

      {tab === "design" ? <DesignTab /> : null}
      {tab === "envelope" ? <EnvelopeTab /> : null}
      {tab === "music" ? <MusicTab /> : null}

      <div className="mt-4 text-xs text-muted-foreground leading-relaxed">
        Davetiyeni düzenlemek için canvas&apos;taki metinlere veya bloklara
        tıkla. Sağdaki panel seçtiğin öğeye göre değişir.
      </div>
    </div>
  );
}

function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 py-2 rounded-md text-xs cursor-pointer ${
        active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

const HERO_VARIANTS: { key: HeroVariant; label: string; description: string }[] = [
  { key: "classic", label: "Klasik", description: "Sade, çerçeveli kart." },
  { key: "arch", label: "Arch", description: "Üstü kemer şeklinde silüet." },
  { key: "photo-top", label: "Foto-Üst", description: "Üstte fotoğraf, altta isimler." },
  { key: "photo-full", label: "Tam Foto", description: "Tam ekran fotoğraf, üzerinde yazı." },
  { key: "floral-crown", label: "Çiçek Tacı", description: "Üstte çiçek dekorasyonu." },
  { key: "monogram-circle", label: "Monogram", description: "Ortada dairesel monogram." },
  { key: "bold-type", label: "Büyük Yazı", description: "İri tipografi, modern." },
  { key: "botanical-frame", label: "Botanik", description: "Yan dallarla çerçevelenmiş." },
];

/** Inline replacement for the old Advanced Settings popup. Lives inside
 *  the home side panel so the user can pick a hero variant and see the
 *  canvas update behind the panel without anything obscuring the card. */
function AdvancedInlinePanel() {
  const doc = useEditorStore((s) => s.doc);
  const updateBlockData = useEditorStore((s) => s.updateBlockData);

  const heroBlock = doc?.blocks.find((b) => b.type === "hero") as
    | Block<HeroData>
    | undefined;
  const currentVariant = heroBlock?.data.variant ?? "classic";

  function pickVariant(v: HeroVariant) {
    if (!heroBlock) return;
    updateBlockData(heroBlock.id, { variant: v });
  }

  if (!heroBlock) return null;

  return (
    <div className="border border-border rounded-md p-3 flex flex-col gap-3 bg-muted/30">
      <div>
        <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Kart Düzeni (Hero)
        </h3>
        <p className="mt-1 text-[11px] text-muted-foreground/80 leading-snug">
          Davetiyenin temel yapısını seç. Değişiklik canvas&apos;a anında
          yansır.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {HERO_VARIANTS.map((v) => {
          const active = currentVariant === v.key;
          return (
            <button
              key={v.key}
              onClick={() => pickVariant(v.key)}
              title={v.description}
              className={`text-left rounded-md border p-2 cursor-pointer transition-colors ${
                active
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-foreground/30"
              }`}
            >
              <div className="text-[11px] font-medium leading-tight">
                {v.label}
              </div>
              <div className="mt-0.5 text-[10px] text-muted-foreground leading-tight">
                {v.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
