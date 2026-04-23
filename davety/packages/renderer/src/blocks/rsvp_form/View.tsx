"use client";

import { useState } from "react";
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
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

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

  if (submitted) {
    return (
      <section className="px-6 py-10 text-center" style={rootStyle}>
        <h3 className="font-display text-2xl mb-2">Teşekkürler</h3>
        <p className="opacity-70 text-sm">Cevabın kaydedildi.</p>
      </section>
    );
  }

  return (
    <section className="px-6 py-10" style={rootStyle}>
      <h3
        {...click("heading")}
        className="font-display text-2xl text-center mb-2"
        style={fieldStyle(block, "heading")}
      >
        Katılım Bilgileri
      </h3>

      {block.data.note ? (
        <p
          {...click("note")}
          className="text-sm text-center max-w-md mx-auto opacity-80 mb-6"
          style={fieldStyle(block, "note")}
        >
          {block.data.note}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAttending("yes")}
            className={`flex-1 py-2 rounded-full text-sm border ${
              attending === "yes"
                ? "bg-current/90 text-white"
                : "border-current/30 hover:bg-current/5"
            }`}
          >
            Katılacağım
          </button>
          <button
            type="button"
            onClick={() => setAttending("no")}
            className={`flex-1 py-2 rounded-full text-sm border ${
              attending === "no"
                ? "bg-current/90 text-white"
                : "border-current/30 hover:bg-current/5"
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
          className="w-full rounded-md border border-current/20 bg-transparent px-3 py-2 text-sm"
        />
        <input
          required
          type="tel"
          placeholder="Telefon"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-md border border-current/20 bg-transparent px-3 py-2 text-sm"
        />
        {attending === "yes" ? (
          <div>
            <label className="text-xs opacity-70 mb-1 block">Kişi Sayısı</label>
            <input
              type="number"
              min={1}
              max={20}
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value, 10) || 1)}
              className="w-full rounded-md border border-current/20 bg-transparent px-3 py-2 text-sm"
            />
          </div>
        ) : null}
        <textarea
          rows={2}
          placeholder="Not (opsiyonel)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-md border border-current/20 bg-transparent px-3 py-2 text-sm resize-none"
        />

        <button
          type="submit"
          disabled={busy || attending === null}
          className="w-full rounded-full bg-current/90 text-white py-3 text-xs font-chakra uppercase tracking-[0.2em] disabled:opacity-40 cursor-pointer"
        >
          {busy ? "..." : "Gönder"}
        </button>
      </form>
    </section>
  );
}
