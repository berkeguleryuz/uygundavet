"use client";

import { useEffect, useState } from "react";
import type { InvitationDoc } from "@davety/schema";

interface Props {
  doc: InvitationDoc;
  slug: string;
  guest?: { name: string; plusOneMax: number; token?: string };
  /** Davetiye sahibi kendi sayfasını görüyorsa modal açılmasın. */
  isOwner: boolean;
}

const COOKIE_TTL_DAYS = 90;

function readResponded(slug: string): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .map((c) => c.trim())
    .includes(`dyl_rsvp_${slug}=1`);
}

function writeResponded(slug: string): void {
  if (typeof document === "undefined") return;
  const expires = new Date(
    Date.now() + COOKIE_TTL_DAYS * 24 * 60 * 60 * 1000
  ).toUTCString();
  document.cookie = `dyl_rsvp_${slug}=1; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Davetiye açıldığında 1.5 saniye sonra otomatik açılan RSVP popup'ı.
 * Misafir Evet / Hayır / Belki seçiyor, sonra ad girip gönderiyor.
 *
 * Tek seferlik gösterim: cevap verince ya da "Sonra" denince cookie
 * yazılıyor, 90 gün boyunca tekrar açılmıyor. Davetiye sahibinde hiç
 * çıkmıyor.
 */
export function AutoRsvpPrompt({ doc, slug, guest, isOwner }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"choice" | "details" | "thanks">("choice");
  const [attending, setAttending] = useState<"yes" | "no" | "maybe" | null>(
    null
  );
  const [name, setName] = useState(guest?.name ?? "");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [hp, setHp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOwner) return;
    if (readResponded(slug)) return;
    const t = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(t);
  }, [isOwner, slug]);

  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (isOwner || !open) return null;

  const hero = doc.blocks.find((b) => b.type === "hero");
  const heroData = hero?.data as
    | { brideName?: string; groomName?: string }
    | undefined;
  const couple =
    heroData?.brideName && heroData?.groomName
      ? `${heroData.brideName} & ${heroData.groomName}`
      : "Çiftin";
  const eventLabel = labelForCategory(
    (doc.meta as { eventCategory?: string }).eventCategory
  );

  function dismiss() {
    writeResponded(slug);
    setOpen(false);
  }

  async function pickAttending(value: "yes" | "no" | "maybe") {
    setAttending(value);
    if (value === "no") {
      // Hayır seçenler için sadece ad isteyip kapat, kişi sayısı gerekmez.
      setStep("details");
      return;
    }
    setStep("details");
  }

  async function submit() {
    if (!attending || !name.trim()) {
      setError("Adını girer misin?");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/public/design/${slug}/rsvp`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || undefined,
          attending,
          guestCount: attending === "yes" ? guestCount : 1,
          hp,
          source: "auto-popup",
          guestToken: guest?.token,
        }),
      });
      if (res.status === 429) {
        setError("Çok hızlı. Birkaç dakika sonra tekrar dene.");
        return;
      }
      if (res.status === 410) {
        setError("Cevap tarihi geçti.");
        return;
      }
      if (res.status === 404) {
        setError(
          "Davetiye henüz yayında değil. Yayınlandıktan sonra tekrar dene."
        );
        return;
      }
      if (!res.ok) {
        setError("Cevap kaydedilemedi.");
        return;
      }
      writeResponded(slug);
      setStep("thanks");
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/65 flex items-center justify-center p-4"
      onClick={() => !busy && dismiss()}
    >
      <div
        className="relative bg-white text-[#252224] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Kapat"
          className="absolute top-3 right-3 z-10 size-8 rounded-full inline-flex items-center justify-center hover:bg-black/5 cursor-pointer text-lg leading-none"
        >
          ×
        </button>
        {step === "choice" ? (
          <div className="p-6 sm:p-7 flex flex-col items-center text-center gap-4">
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-mono">
              Davet
            </div>
            <h2
              className="text-2xl sm:text-3xl leading-tight"
              style={{ fontFamily: "Merienda, serif" }}
            >
              {guest?.name ? `Sevgili ${guest.name},` : "Merhaba,"}
            </h2>
            <p
              className="text-sm sm:text-base opacity-80 -mt-2"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              <strong>{couple}</strong> {eventLabel} sizi de aralarında
              görmek istiyor. Katılımını işaretler misin?
            </p>
            <div className="grid grid-cols-3 gap-2 w-full mt-2">
              <button
                onClick={() => pickAttending("yes")}
                className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 text-xs font-mono uppercase tracking-[0.18em] cursor-pointer transition-colors"
              >
                Geleceğim
              </button>
              <button
                onClick={() => pickAttending("maybe")}
                className="rounded-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 text-xs font-mono uppercase tracking-[0.18em] cursor-pointer transition-colors"
              >
                Belki
              </button>
              <button
                onClick={() => pickAttending("no")}
                className="rounded-full bg-[#252224] hover:bg-black text-white py-2.5 text-xs font-mono uppercase tracking-[0.18em] cursor-pointer transition-colors"
              >
                Gelemiyorum
              </button>
            </div>
            <button
              onClick={dismiss}
              className="text-[11px] text-muted-foreground hover:text-foreground underline mt-2 cursor-pointer"
            >
              Sonra cevaplarım
            </button>
          </div>
        ) : null}

        {step === "details" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="p-6 sm:p-7 flex flex-col gap-3"
          >
            <h3
              className="text-xl"
              style={{ fontFamily: "Merienda, serif" }}
            >
              {attending === "yes"
                ? "Harika, seni bekliyoruz"
                : attending === "maybe"
                  ? "Karar verince haber et"
                  : "Anladık, üzüldük"}
            </h3>
            <input
              required
              autoFocus
              type="text"
              placeholder="Ad Soyad"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              className="w-full rounded-md border border-black/20 px-3 py-2.5 text-sm focus:outline-none focus:border-black"
            />
            <input
              type="tel"
              placeholder="Telefon (opsiyonel)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={40}
              className="w-full rounded-md border border-black/20 px-3 py-2.5 text-sm focus:outline-none focus:border-black"
            />
            {attending === "yes" ? (
              <label className="flex items-center justify-between text-sm">
                <span>Toplam kaç kişi?</span>
                <input
                  type="number"
                  min={1}
                  max={guest?.plusOneMax ?? 20}
                  value={guestCount}
                  onChange={(e) =>
                    setGuestCount(parseInt(e.target.value, 10) || 1)
                  }
                  className="w-20 rounded-md border border-black/20 px-2 py-1.5 text-sm text-center"
                />
              </label>
            ) : null}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
              name="company"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
            />
            {error ? (
              <div className="text-xs text-red-600">{error}</div>
            ) : null}
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => setStep("choice")}
                disabled={busy}
                className="flex-1 rounded-full border border-black/20 py-2.5 text-xs font-mono uppercase tracking-[0.18em] hover:bg-black/5 cursor-pointer disabled:opacity-50"
              >
                Geri
              </button>
              <button
                type="submit"
                disabled={busy}
                className="flex-1 rounded-full bg-[#252224] hover:bg-black text-white py-2.5 text-xs font-mono uppercase tracking-[0.18em] cursor-pointer disabled:opacity-50"
              >
                {busy ? "..." : "Gönder"}
              </button>
            </div>
          </form>
        ) : null}

        {step === "thanks" ? (
          <div className="p-7 flex flex-col items-center text-center gap-3">
            <div
              className="text-2xl"
              style={{ fontFamily: "Merienda, serif" }}
            >
              Teşekkürler!
            </div>
            <p className="text-sm opacity-80">
              Cevabın kaydedildi. Davetiyeyi rahatça inceleyebilirsin.
            </p>
            <button
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-[#252224] text-white px-6 py-2.5 text-xs font-mono uppercase tracking-[0.18em] cursor-pointer"
            >
              Davetiyeyi Aç
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function labelForCategory(category: string | undefined): string {
  switch (category) {
    case "engagement":
      return "nişan etkinliğine";
    case "circumcision":
      return "sünnet törenine";
    case "birthday":
      return "doğum günü kutlamasına";
    case "business":
      return "etkinliğine";
    case "wedding":
    default:
      return "düğününe";
  }
}
