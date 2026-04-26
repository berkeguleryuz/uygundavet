"use client";

import { useEffect, useState } from "react";
import type { CountdownData } from "@davety/schema";
import { alignClasses, fieldStyle, styleToCss, type BlockViewProps } from "../types";

function computeParts(target: number) {
  const now = Date.now();
  const diff = target - now;
  if (Number.isNaN(diff) || diff <= 0) {
    return { d: 0, h: 0, m: 0, s: 0, done: true };
  }
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff / 3_600_000) % 24),
    m: Math.floor((diff / 60_000) % 60),
    s: Math.floor((diff / 1000) % 60),
    done: false,
  };
}

export function CountdownView({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<CountdownData>) {
  const target = new Date(block.data.targetIso).getTime();
  const [parts, setParts] = useState(() => computeParts(target));

  useEffect(() => {
    const id = setInterval(() => setParts(computeParts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const rootStyle = styleToCss(block.style);
  const labels = block.data.labels;

  const clickable = (id: string) =>
    editable && onFieldSelect
      ? {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onFieldSelect(id);
          },
          className: "cursor-pointer hover:bg-yellow-100/30 rounded px-1",
        }
      : {};

  return (
    <section className="px-6 py-8" style={rootStyle}>
      <div className={`grid grid-cols-4 gap-3 max-w-md mx-auto ${alignClasses(block.style.align)}`}>
        <Cell value={parts.d} label={labels.days} editable={editable} labelId="days" clickable={clickable} style={fieldStyle(block, "days")} />
        <Cell value={parts.h} label={labels.hours} editable={editable} labelId="hours" clickable={clickable} style={fieldStyle(block, "hours")} />
        <Cell value={parts.m} label={labels.minutes} editable={editable} labelId="minutes" clickable={clickable} style={fieldStyle(block, "minutes")} />
        <Cell value={parts.s} label={labels.seconds} editable={editable} labelId="seconds" clickable={clickable} style={fieldStyle(block, "seconds")} />
      </div>
    </section>
  );
}

function Cell({
  value,
  label,
  editable,
  labelId,
  clickable,
  style,
}: {
  value: number;
  label: string;
  editable?: boolean;
  labelId: string;
  clickable: (id: string) => object;
  style: React.CSSProperties;
}) {
  return (
    <div>
      <div className="text-4xl font-display tabular-nums" style={style}>
        {value.toString().padStart(2, "0")}
      </div>
      <div
        {...clickable(labelId)}
        className={`text-xs font-sans opacity-70 mt-1 ${
          editable ? "cursor-pointer hover:bg-yellow-100/30 rounded" : ""
        }`}
      >
        {label}
      </div>
    </div>
  );
}
