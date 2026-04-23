"use client";

import { useEditorStore } from "@/src/store/editor-store";

const PATTERNS: { id: "daisy" | "rose" | "none"; label: string }[] = [
  { id: "daisy", label: "Papatya" },
  { id: "rose", label: "Gül" },
  { id: "none", label: "Düz" },
];

export function EnvelopeTab() {
  const doc = useEditorStore((s) => s.doc);
  const updateTheme = useEditorStore((s) => s.updateTheme);

  if (!doc) return null;
  const env = doc.theme.envelope;

  return (
    <div className="border-t border-border pt-4 mt-2 flex flex-col gap-3">
      <div className="text-xs font-medium">Zarf Tasarımı</div>

      <div>
        <label className="text-[11px] text-muted-foreground">Zarf Rengi</label>
        <input
          type="color"
          value={env.color}
          onChange={(e) =>
            updateTheme({ envelope: { ...env, color: e.target.value } })
          }
          className="mt-1 w-full h-9 rounded-md border border-input bg-background cursor-pointer"
        />
      </div>

      <div>
        <label className="text-[11px] text-muted-foreground">Kapak Rengi</label>
        <input
          type="color"
          value={env.flapColor}
          onChange={(e) =>
            updateTheme({ envelope: { ...env, flapColor: e.target.value } })
          }
          className="mt-1 w-full h-9 rounded-md border border-input bg-background cursor-pointer"
        />
      </div>

      <div>
        <label className="text-[11px] text-muted-foreground">İç Astar</label>
        <div className="mt-1 grid grid-cols-3 gap-1">
          {PATTERNS.map((p) => (
            <button
              key={p.id}
              onClick={() =>
                updateTheme({ envelope: { ...env, liningPattern: p.id } })
              }
              className={`text-[11px] py-2 rounded-md border cursor-pointer ${
                env.liningPattern === p.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-muted"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
