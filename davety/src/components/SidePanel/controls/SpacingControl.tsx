"use client";

export function SpacingControl({
  paddingTop,
  paddingBottom,
  onChange,
}: {
  paddingTop: number | undefined;
  paddingBottom: number | undefined;
  onChange: (patch: { paddingTop?: number; paddingBottom?: number }) => void;
}) {
  // 16px mirrors the Tailwind py-4 default applied in block views, so the
  // slider tracks the visible baseline before the user has overridden it.
  const top = paddingTop ?? 16;
  const bottom = paddingBottom ?? 16;
  return (
    <div className="flex flex-col gap-2 border border-border rounded-md p-3 bg-muted/30">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
          Boşluk
        </span>
        <button
          type="button"
          onClick={() =>
            onChange({ paddingTop: undefined, paddingBottom: undefined })
          }
          className="text-[10px] underline text-muted-foreground hover:text-foreground cursor-pointer"
        >
          sıfırla
        </button>
      </div>
      <label className="flex items-center gap-2 text-[11px]">
        <span className="w-10 text-muted-foreground">Üst</span>
        <input
          type="range"
          min={-40}
          max={80}
          step={2}
          value={top}
          onChange={(e) => onChange({ paddingTop: Number(e.target.value) })}
          className="flex-1 cursor-pointer"
        />
        <span className="w-12 text-right tabular-nums">{top}px</span>
      </label>
      <label className="flex items-center gap-2 text-[11px]">
        <span className="w-10 text-muted-foreground">Alt</span>
        <input
          type="range"
          min={-40}
          max={80}
          step={2}
          value={bottom}
          onChange={(e) => onChange({ paddingBottom: Number(e.target.value) })}
          className="flex-1 cursor-pointer"
        />
        <span className="w-12 text-right tabular-nums">{bottom}px</span>
      </label>
    </div>
  );
}
