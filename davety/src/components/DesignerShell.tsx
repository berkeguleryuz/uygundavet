"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import type { InvitationDoc } from "@davety/schema";
import { useRouter } from "@/i18n/navigation";
import { useEditorStore } from "@/src/store/editor-store";
import { useUIStore } from "@/src/store/ui-store";
import { useDebouncedAutosave } from "@/src/hooks/useDebouncedAutosave";
import { HeaderCountdown } from "./HeaderCountdown";
import { Canvas } from "./Canvas";
import { SidePanel } from "./SidePanel/SidePanel";
import { MobileSidePanel } from "./MobileSidePanel";
import { OnboardingFlow } from "./OnboardingFlow";
import { PreviewOverlay } from "./PreviewOverlay";

interface DesignerShellProps {
  docId: string;
  initialDoc: InvitationDoc;
  initialUpdatedAt: string;
}

export function DesignerShell({
  docId,
  initialDoc,
  initialUpdatedAt,
}: DesignerShellProps) {
  const t = useTranslations("Editor");
  const router = useRouter();

  const hydrate = useEditorStore((s) => s.hydrate);
  const doc = useEditorStore((s) => s.doc);

  useEffect(() => {
    hydrate({ docId, doc: initialDoc, updatedAt: initialUpdatedAt });
  }, [docId, initialDoc, initialUpdatedAt, hydrate]);

  useDebouncedAutosave();

  if (!doc) {
    return (
      <div className="min-h-dvh flex items-center justify-center text-sm text-muted-foreground">
        {t("errors.saveFailed")}
      </div>
    );
  }

  return (
    <div className="h-dvh grid grid-rows-[56px_1fr] bg-background overflow-hidden">
      {/* Top bar */}
      <header className="border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-full p-1.5 hover:bg-muted cursor-pointer"
            aria-label="close"
          >
            <X className="size-4" />
          </button>
          <span className="text-sm font-medium">{t("stepTitle")}</span>
        </div>

        <HeaderCountdown
          dateIso={doc.meta.weddingDate}
          time={doc.meta.weddingTime}
        />

        <button
          onClick={() => router.push(`/design/invitations/${docId}/save`)}
          className="rounded-full bg-primary text-primary-foreground text-xs px-4 py-1.5 font-chakra uppercase tracking-[0.15em] cursor-pointer hover:opacity-90"
        >
          {t("save")}
        </button>
      </header>

      {/* Workspace — desktop: side-by-side, mobile: full-canvas + bottom sheet */}
      <div className="min-h-0 grid md:grid-cols-[1fr_380px]">
        <Canvas />
        <div className="hidden md:block">
          <SidePanel />
        </div>
      </div>

      <MobileSidePanel />
      <OnboardingFlow />
      <PreviewOverlay />
    </div>
  );
}
