"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function HeaderCountdown({
  targetIso,
}: {
  /** Full ISO timestamp the countdown counts down to. Should match the
   *  countdown block's target so the header and canvas never disagree. */
  targetIso: string;
}) {
  const t = useTranslations("Editor.countdown");
  const target = new Date(targetIso).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = target - now;
  if (Number.isNaN(diff) || diff <= 0) {
    return <span className="text-xs text-muted-foreground">{t("today")}</span>;
  }
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff / 3_600_000) % 24);
  const m = Math.floor((diff / 60_000) % 60);
  const s = Math.floor((diff / 1000) % 60);

  return (
    <span className="text-xs text-muted-foreground font-chakra tabular-nums">
      {d}
      {t("days").charAt(0).toLowerCase()} {h}:{m.toString().padStart(2, "0")}:
      {s.toString().padStart(2, "0")}
    </span>
  );
}
