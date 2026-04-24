"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { EnvelopeViewer } from "@davety/renderer";
import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/src/lib/auth-client";

export function LandingClient() {
  const t = useTranslations("Landing");
  const tDialog = useTranslations("DateDialog");
  const tEnvelope = useTranslations("Envelope");

  const router = useRouter();
  const session = useSession();

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [busy, setBusy] = useState(false);
  const [envelopeState, setEnvelopeState] = useState<"closed" | "open">("closed");

  function openDialog() {
    if (!session.data?.user) {
      router.push("/login?returnTo=/");
      return;
    }
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    router.push(
      `/design/new?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}` as never
    );
  }

  return (
    <>
      <div className="cursor-pointer">
        <EnvelopeViewer
          state={envelopeState}
          onToggle={(next) => {
            setEnvelopeState(next);
            if (next === "open") {
              setTimeout(() => openDialog(), 1500);
            }
          }}
          viewLabel={tEnvelope("view")}
          width={320}
        >
          <div className="h-full w-full p-5 flex flex-col items-center justify-center text-center">
            <div className="font-display text-3xl text-[#6b5a42]">davety</div>
            <div className="mt-2 text-xs font-chakra uppercase tracking-[0.2em] text-[#6b5a42]/60">
              Dijital Davetiye
            </div>
          </div>
        </EnvelopeViewer>
      </div>

      <button
        onClick={openDialog}
        className="rounded-full bg-primary text-primary-foreground px-10 py-5 font-chakra uppercase tracking-[0.2em] text-sm hover:bg-primary/90 transition-colors cursor-pointer"
      >
        {t("cta")}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => !busy && setOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="bg-card rounded-2xl p-6 w-full max-w-md shadow-xl"
          >
            <h2 className="font-display text-2xl mb-1">{tDialog("title")}</h2>
            <p className="text-sm text-muted-foreground mb-5">
              {tDialog("subtitle")}
            </p>

            <label className="block text-sm mb-2">{tDialog("dateLabel")}</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 mb-4"
            />

            <label className="block text-sm mb-2">{tDialog("timeLabel")}</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 mb-6"
            />

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-primary text-primary-foreground py-3 font-chakra uppercase tracking-[0.2em] text-sm disabled:opacity-50 cursor-pointer"
            >
              {busy ? "..." : tDialog("submit")}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
