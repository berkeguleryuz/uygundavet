"use client";

import { useEffect, useState } from "react";
import type { RsvpFormData } from "@davety/schema";
import { fieldStyle, styleToCss, type BlockViewProps } from "../types";
import { apiUrl, useRendererContext } from "../../context";

export function RsvpFormView({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<RsvpFormData>) {
  const { slug: ctxSlug, publicBase } = useRendererContext();
  const rootStyle = styleToCss(block.style);
  const [open, setOpen] = useState(false);
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  // Lock body scroll while the modal is open (guest view only; editors
  // shouldn't have it open anyway).
  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const click = (id: string) =>
    editable && onFieldSelect
      ? {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onFieldSelect(id);
          },
          className: "cursor-pointer hover:bg-yellow-100/30 rounded px-1",
        }
      : {};

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editable || attending === null) return;
    const slug =
      ctxSlug ?? window.location.pathname.split("/").filter(Boolean).pop();
    if (!slug) return;
    setBusy(true);
    try {
      const res = await fetch(apiUrl(`/api/public/design/${slug}/rsvp`, publicBase), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          attending,
          guestCount,
          note,
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      // silent
    } finally {
      setBusy(false);
    }
  }

  const buttonLabel =
    (block.data as { buttonLabel?: string }).buttonLabel ?? "Katılım Bilgisi";

  return (
    <section className="px-6 py-10 text-center" style={rootStyle}>
      <h3
        {...click("heading")}
        className="font-display text-2xl mb-2"
        style={fieldStyle(block, "heading")}
      >
        Katılım Bilgileri
      </h3>
      {block.data.note ? (
        <p
          {...click("note")}
          className="text-sm max-w-md mx-auto opacity-80 mb-5"
          style={fieldStyle(block, "note")}
        >
          {block.data.note}
        </p>
      ) : null}

      <button
        type="button"
        {...click("buttonLabel")}
        onClick={(e) => {
          if (editable) {
            // in editor, let the field-select handler take over via click()
            return;
          }
          e.stopPropagation();
          setOpen(true);
        }}
        className="inline-flex items-center justify-center rounded-full bg-current/90 text-white px-8 py-3 text-xs font-chakra uppercase tracking-[0.2em] cursor-pointer hover:opacity-90"
        style={fieldStyle(block, "buttonLabel")}
      >
        {buttonLabel}
      </button>

      {/* Popup — guest view */}
      {open && !editable ? (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => !busy && setOpen(false)}
        >
          <div
            className="bg-white text-[#252224] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {submitted ? (
              <div className="p-8 text-center">
                <h4 className="font-display text-2xl mb-2">Teşekkürler</h4>
                <p className="opacity-70 text-sm mb-5">Cevabın kaydedildi.</p>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-[#252224] text-white px-6 py-2 text-xs uppercase tracking-[0.2em] cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h4 className="font-display text-xl">Katılım Bilgileri</h4>
                    {block.data.note ? (
                      <p className="text-xs opacity-70 mt-1">{block.data.note}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Kapat"
                    className="shrink-0 rounded-full size-8 flex items-center justify-center hover:bg-black/5 cursor-pointer text-lg"
                  >
                    ×
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAttending("yes")}
                    className={`flex-1 py-2 rounded-full text-sm border ${
                      attending === "yes"
                        ? "bg-[#252224] text-white border-[#252224]"
                        : "border-black/20 hover:bg-black/5"
                    }`}
                  >
                    Katılacağım
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("no")}
                    className={`flex-1 py-2 rounded-full text-sm border ${
                      attending === "no"
                        ? "bg-[#252224] text-white border-[#252224]"
                        : "border-black/20 hover:bg-black/5"
                    }`}
                  >
                    Katılamayacağım
                  </button>
                </div>

                <input
                  required
                  placeholder="Ad Soyad"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-black/20 bg-white px-3 py-2 text-sm"
                />
                <input
                  required
                  type="tel"
                  placeholder="Telefon"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-md border border-black/20 bg-white px-3 py-2 text-sm"
                />
                {attending === "yes" ? (
                  <div>
                    <label className="text-xs opacity-70 mb-1 block">
                      Kişi Sayısı
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={guestCount}
                      onChange={(e) =>
                        setGuestCount(parseInt(e.target.value, 10) || 1)
                      }
                      className="w-full rounded-md border border-black/20 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                ) : null}
                <textarea
                  rows={2}
                  placeholder="Not (opsiyonel)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-md border border-black/20 bg-white px-3 py-2 text-sm resize-none"
                />

                <button
                  type="submit"
                  disabled={busy || attending === null}
                  className="w-full rounded-full bg-[#252224] text-white py-3 text-xs font-chakra uppercase tracking-[0.2em] disabled:opacity-40 cursor-pointer"
                >
                  {busy ? "..." : "Gönder"}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
