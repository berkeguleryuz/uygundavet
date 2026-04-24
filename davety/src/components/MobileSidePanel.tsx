"use client";

import { Drawer } from "vaul";
import { ChevronUp } from "lucide-react";
import { useUIStore } from "@/src/store/ui-store";
import { DesignHomePanel } from "./SidePanel/DesignHomePanel";
import { TextStylePanel } from "./SidePanel/TextStylePanel";
import { BlockControlsPanel } from "./SidePanel/BlockControlsPanel";

export function MobileSidePanel() {
  const panelMode = useUIStore((s) => s.panelMode);
  const selectedBlockId = useUIStore((s) => s.selectedBlockId);
  const selectedFieldId = useUIStore((s) => s.selectedFieldId);

  const label =
    panelMode === "text"
      ? `Metin · ${selectedFieldId ?? ""}`
      : panelMode === "block"
      ? `Blok · ${selectedBlockId?.slice(0, 4) ?? ""}`
      : "Davetiye Tasarımı";

  return (
    <Drawer.Root shouldScaleBackground={false}>
      <Drawer.Trigger asChild>
        <button className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-xs font-chakra uppercase tracking-[0.15em] shadow-xl cursor-pointer md:hidden">
          <ChevronUp className="size-4" /> {label}
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl border-t border-border max-h-[85dvh] flex flex-col">
          <Drawer.Title className="sr-only">Editor paneli</Drawer.Title>
          <div className="mx-auto mt-3 mb-1 w-10 h-1 rounded-full bg-border" />
          <div className="overflow-y-auto">
            {panelMode === "home" ? <DesignHomePanel /> : null}
            {panelMode === "block" ? <BlockControlsPanel /> : null}
            {panelMode === "text" ? <TextStylePanel /> : null}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
