"use client";

import { useUIStore } from "@/src/store/ui-store";
import { DesignHomePanel } from "./DesignHomePanel";
import { TextStylePanel } from "./TextStylePanel";
import { BlockControlsPanel } from "./BlockControlsPanel";

export function SidePanel() {
  const panelMode = useUIStore((s) => s.panelMode);

  return (
    <aside className="border-l border-border bg-card min-h-0 overflow-y-auto">
      {panelMode === "home" ? <DesignHomePanel /> : null}
      {panelMode === "block" ? <BlockControlsPanel /> : null}
      {panelMode === "text" ? <TextStylePanel /> : null}
    </aside>
  );
}
