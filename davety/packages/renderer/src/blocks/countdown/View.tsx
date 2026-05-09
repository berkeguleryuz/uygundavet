"use client";

import { useEffect, useState } from "react";
import type { CountdownData } from "@davety/schema";
import { alignClasses, fieldStyle, styleToCss, type BlockViewProps } from "../types";

interface Parts {
  d: number;
  h: number;
  m: number;
  s: number;
  done: boolean;
}

const ZERO_PARTS: Parts = { d: 0, h: 0, m: 0, s: 0, done: false };

function computeParts(target: number): Parts {
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
  // SSR/CSR'de Date.now() farklı sonuç ürettiği için ilk render'da
  // hep sıfır gösteriyoruz, gerçek değerleri client mount'ta useEffect
  // ile dolduruyoruz. Aksi halde "saniye 04 vs 03" gibi hydration
  // mismatch warning'i çıkıyor.
  const [parts, setParts] = useState<Parts>(ZERO_PARTS);

  useEffect(() => {
    // Time is an external system; first sample right after mount to
    // avoid showing all zeros for one frame, then tick every second.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParts(computeParts(target));
    const id = setInterval(() => setParts(computeParts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const rootStyle = styleToCss(block.style);
  const labels = block.data.labels;
  const targetDate = new Date(block.data.targetIso);
  const dateStr = Number.isNaN(targetDate.getTime())
    ? ""
    : targetDate.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
  const timeStr = Number.isNaN(targetDate.getTime())
    ? ""
    : targetDate.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      });

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
    <section className="px-6 py-4" style={rootStyle}>
      <div className={`grid grid-cols-4 gap-3 max-w-md mx-auto ${alignClasses(block.style.align)}`}>
        <Cell value={parts.d} label={labels.days} editable={editable} labelId="days" clickable={clickable} style={fieldStyle(block, "days")} />
        <Cell value={parts.h} label={labels.hours} editable={editable} labelId="hours" clickable={clickable} style={fieldStyle(block, "hours")} />
        <Cell value={parts.m} label={labels.minutes} editable={editable} labelId="minutes" clickable={clickable} style={fieldStyle(block, "minutes")} />
        <Cell value={parts.s} label={labels.seconds} editable={editable} labelId="seconds" clickable={clickable} style={fieldStyle(block, "seconds")} />
      </div>
      {dateStr ? (
        // toLocaleDateString/TimeString Node OS locale ile browser
        // arasında farklı sonuç verebilir (ICU data versiyonu),
        // hydration warning'i bastır.
        <div
          className="mt-4 text-center text-sm font-sans opacity-70 tabular-nums"
          suppressHydrationWarning
        >
          {dateStr}
          {timeStr ? <span className="mx-2">·</span> : null}
          {timeStr}
        </div>
      ) : null}
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
