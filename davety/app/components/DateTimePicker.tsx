"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

const DAY_NAMES = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTH_NAMES = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

/* ──────────────────────────── Calendar ───────────────────────────── */

export interface CalendarProps {
  /** ISO yyyy-mm-dd value. Empty string means no selection. */
  value: string;
  onChange(next: string): void;
  /** Disable selecting any date strictly before this ISO. Defaults to today. */
  minDate?: string;
}

export function Calendar({ value, onChange, minDate }: CalendarProps) {
  const today = useMemo(() => new Date(), []);
  const todayIso = toIso(today);
  const min = minDate ?? todayIso;

  const selected = value ? parseIso(value) : null;
  const initialView = selected ?? today;

  const [viewYear, setViewYear] = useState(initialView.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialView.getMonth());

  const cells = useMemo(
    () => buildMonthCells(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  function shiftMonth(delta: number) {
    let m = viewMonth + delta;
    let y = viewYear;
    while (m < 0) {
      m += 12;
      y -= 1;
    }
    while (m > 11) {
      m -= 12;
      y += 1;
    }
    setViewYear(y);
    setViewMonth(m);
  }

  function jumpTo(d: Date) {
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
    onChange(toIso(d));
  }

  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      {/* Month header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/40">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          className="size-7 rounded-full hover:bg-background inline-flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Önceki ay"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="text-sm font-medium">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </div>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="size-7 rounded-full hover:bg-background inline-flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Sonraki ay"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Day-of-week labels */}
      <div className="grid grid-cols-7 px-2 pt-2 text-[10px] uppercase tracking-wider text-muted-foreground text-center">
        {DAY_NAMES.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0.5 px-2 pb-2">
        {cells.map((cell) => {
          const iso = toIso(cell.date);
          const isSelected = value === iso;
          const isToday = iso === todayIso;
          const isPast = iso < min;
          const inMonth = cell.inMonth;
          return (
            <button
              key={iso}
              type="button"
              disabled={isPast}
              onClick={() => onChange(iso)}
              className={`relative aspect-square text-xs rounded-md inline-flex items-center justify-center transition-colors ${
                isSelected
                  ? "bg-foreground text-background font-medium"
                  : isPast
                    ? "text-muted-foreground/40 cursor-not-allowed"
                    : inMonth
                      ? "text-foreground hover:bg-muted cursor-pointer"
                      : "text-muted-foreground/60 hover:bg-muted/60 cursor-pointer"
              }`}
            >
              {cell.date.getDate()}
              {isToday && !isSelected ? (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-foreground" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Quick shortcuts */}
      <div className="flex items-center gap-1 px-2 pb-2 pt-1 border-t border-border bg-muted/20">
        <QuickBtn label="Yarın" onClick={() => jumpTo(addDays(today, 1))} />
        <QuickBtn label="Bu Hafta Sonu" onClick={() => jumpTo(nextSaturday(today))} />
        <QuickBtn label="1 Ay Sonra" onClick={() => jumpTo(addMonths(today, 1))} />
        <QuickBtn label="3 Ay Sonra" onClick={() => jumpTo(addMonths(today, 3))} />
      </div>
    </div>
  );
}

function QuickBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 cursor-pointer transition-colors"
    >
      {label}
    </button>
  );
}

/* ──────────────────────────── Time Picker ─────────────────────────── */

export interface TimePickerProps {
  /** HH:mm */
  value: string;
  onChange(next: string): void;
}

const TIME_PRESETS = ["16:00", "17:00", "18:00", "19:00", "20:00"];

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [hh, mm] = parseTime(value);

  function setHour(h: number) {
    const wrapped = ((h % 24) + 24) % 24;
    onChange(formatTime(wrapped, mm));
  }
  function setMinute(m: number) {
    const wrapped = ((m % 60) + 60) % 60;
    onChange(formatTime(hh, wrapped));
  }

  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      <div className="flex items-stretch divide-x divide-border">
        <Spinner
          value={hh}
          onChange={setHour}
          step={1}
          max={23}
          format={(n) => n.toString().padStart(2, "0")}
          label="Saat"
        />
        <div className="flex items-center px-1 text-2xl font-medium text-muted-foreground">
          :
        </div>
        <Spinner
          value={mm}
          onChange={setMinute}
          step={5}
          max={59}
          format={(n) => n.toString().padStart(2, "0")}
          label="Dakika"
        />
      </div>

      <div className="flex flex-wrap items-center gap-1 px-2 py-2 border-t border-border bg-muted/20">
        {TIME_PRESETS.map((t) => {
          const active = value === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              className={`text-[11px] tabular-nums px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                active
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Spinner({
  value,
  onChange,
  step,
  max,
  format,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  step: number;
  max: number;
  format: (n: number) => string;
  label: string;
}) {
  return (
    <div className="flex-1 flex flex-col items-center py-3 gap-1">
      <button
        type="button"
        onClick={() => onChange(value + step)}
        className="size-6 rounded-full inline-flex items-center justify-center hover:bg-muted cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
        aria-label={`${label} arttır`}
      >
        <ChevronUp className="size-3.5" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={format(value)}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
          const n = parseInt(raw, 10);
          if (!Number.isFinite(n)) return;
          onChange(Math.min(max, Math.max(0, n)));
        }}
        onFocus={(e) => e.target.select()}
        className="w-14 text-center text-2xl font-medium tabular-nums leading-none py-1 bg-transparent border-0 focus:outline-none focus:bg-muted/40 rounded cursor-text"
        aria-label={label}
      />
      <button
        type="button"
        onClick={() => onChange(value - step)}
        className="size-6 rounded-full inline-flex items-center justify-center hover:bg-muted cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
        aria-label={`${label} azalt`}
      >
        <ChevronDown className="size-3.5" />
      </button>
    </div>
  );
}

/* ─────────────────────────── helpers ──────────────────────────────── */

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function toIso(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseIso(s: string): Date {
  const [y, m, d] = s.split("-").map((p) => parseInt(p, 10));
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function parseTime(s: string): [number, number] {
  const [h, m] = s.split(":").map((p) => parseInt(p, 10));
  return [
    Number.isFinite(h) ? Math.max(0, Math.min(23, h)) : 19,
    Number.isFinite(m) ? Math.max(0, Math.min(59, m)) : 0,
  ];
}

function formatTime(h: number, m: number): string {
  return `${pad(h)}:${pad(m)}`;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function addMonths(d: Date, n: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() + n);
  return r;
}

function nextSaturday(d: Date): Date {
  const r = new Date(d);
  const day = r.getDay(); // 0 Sun, 6 Sat
  // 6 - day handles 0..6 → days until Saturday; if today is Sat, jump 7
  const delta = day === 6 ? 7 : (6 - day + 7) % 7 || 7;
  r.setDate(r.getDate() + delta);
  return r;
}

interface MonthCell {
  date: Date;
  inMonth: boolean;
}

/** Build a 6-row × 7-col grid of dates anchored on the given month, with
 *  surrounding leading/trailing days from neighbouring months filled in. */
function buildMonthCells(year: number, monthIdx: number): MonthCell[] {
  const first = new Date(year, monthIdx, 1);
  const firstDow = (first.getDay() + 6) % 7; // 0 = Mon … 6 = Sun
  const start = new Date(year, monthIdx, 1 - firstDow);
  const cells: MonthCell[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push({ date: d, inMonth: d.getMonth() === monthIdx });
  }
  return cells;
}
