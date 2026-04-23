"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FileText, MailOpen, Music } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useEditorStore } from "@/src/store/editor-store";
import { useUIStore } from "@/src/store/ui-store";
import { DesignTab } from "./DesignTab";
import { EnvelopeTab } from "./EnvelopeTab";
import { MusicTab } from "./MusicTab";

type Tab = "design" | "envelope" | "music";

export function DesignHomePanel() {
  const t = useTranslations("Editor");
  const router = useRouter();
  const docId = useEditorStore((s) => s.docId);
  const togglePreview = useUIStore((s) => s.togglePreview);

  const [tab, setTab] = useState<Tab>("design");

  return (
    <div className="p-5 flex flex-col gap-4">
      <button
        onClick={() => router.push(`/design/invitations/${docId}/save`)}
        className="rounded-md bg-primary text-primary-foreground py-3 font-medium text-sm cursor-pointer hover:opacity-90"
      >
        {t("mainButton")}
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

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={togglePreview}
          className="rounded-md border border-border py-2 text-xs cursor-pointer hover:bg-muted"
        >
          ▶ {t("viewChanges")}
        </button>
        <button className="rounded-md border border-border py-2 text-xs cursor-pointer hover:bg-muted">
          ⚙ {t("advanced")}
        </button>
      </div>

      {tab === "design" ? <DesignTab /> : null}
      {tab === "envelope" ? <EnvelopeTab /> : null}
      {tab === "music" ? <MusicTab /> : null}

      <div className="mt-4 text-xs text-muted-foreground leading-relaxed">
        Davetiyeni düzenlemek için canvas'taki metinlere veya bloklara tıkla.
        Sağdaki panel seçtiğin öğeye göre değişir.
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
