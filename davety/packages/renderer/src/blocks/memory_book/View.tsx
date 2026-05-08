"use client";

import { useState } from "react";
import type { MemoryBookData } from "@davety/schema";
import { fieldStyle, styleToCss, type BlockViewProps } from "../types";
import { apiUrl, useRendererContext } from "../../context";

export function MemoryBookView({
  block,
  theme,
  editable,
  onFieldSelect,
}: BlockViewProps<MemoryBookData>) {
  const { slug: ctxSlug, publicBase } = useRendererContext();
  const rootStyle = styleToCss(block.style);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const click = (id: string) =>
    editable && onFieldSelect
      ? {
          "data-field-id": id,
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onFieldSelect(id);
          },
          className: "cursor-pointer hover:bg-yellow-100/30 rounded px-1",
        }
      : {};

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editable) return;
    const slug =
      ctxSlug ?? window.location.pathname.split("/").filter(Boolean).pop();
    if (!slug) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(
        apiUrl(`/api/public/design/${slug}/memories`, publicBase),
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ authorName: name, message, hp }),
        }
      );
      if (res.status === 429) {
        setError("Çok fazla mesaj. Birkaç dakika sonra tekrar dene.");
        return;
      }
      if (res.status === 422) {
        setError("Mesajın kabul edilmedi. Lütfen kibar bir dil kullan.");
        return;
      }
      if (res.status === 404) {
        setError(
          "Davetiye henüz yayında değil. Yayınlandıktan sonra tekrar dene."
        );
        return;
      }
      if (!res.ok) {
        setError("Mesaj kaydedilemedi.");
        return;
      }
      setSubmitted(true);
      // Başarı state'i in-modal "Hatıran kaydedildi" görsel feedback
      // sağlıyor, ek toast'a gerek yok. Modal kullanıcı kapatana kadar
      // açık kalır ki onay mesajını okuyabilsin.
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="px-2 py-4" style={rootStyle}>
      <h3
        {...click("heading")}
        className="font-display text-2xl text-center mb-3"
        style={fieldStyle(block, "heading")}
      >
        Hatıra Defteri
      </h3>

      <p
        {...click("prompt")}
        className="text-sm text-center max-w-md mx-auto opacity-80 mb-6"
        style={fieldStyle(block, "prompt")}
      >
        {block.data.prompt}
      </p>

      <div className="text-center">
        {submitted ? (
          <div className="text-sm opacity-70 italic">Teşekkürler!</div>
        ) : (
          <button
            onClick={() => !editable && setOpen(true)}
            className="inline-flex items-center justify-center rounded-full px-8 py-3 text-xs font-chakra uppercase tracking-[0.2em] cursor-pointer hover:opacity-90 transition-opacity"
            style={{
              // RSVP butonu ile aynı temaya uygun renklendirme.
              // Theme'deki actionButtonBg/Text override'ı varsa onu
              // kullan, yoksa accent/bg fallback. bgImage'lı kartlarda
              // varsayılanlar okunmaz olabilir, kullanıcı override'larsa
              // bütün aksiyon butonları beraber değişir.
              background: theme.actionButtonBg ?? theme.accentColor,
              color: theme.actionButtonText ?? theme.bgColor,
            }}
          >
            Hatıra Bırak
          </button>
        )}
      </div>

      {open && !editable ? (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={() => !busy && setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white text-black rounded-2xl p-6 w-full max-w-md"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Kapat"
              className="absolute top-3 right-3 size-8 rounded-full inline-flex items-center justify-center hover:bg-black/5 cursor-pointer text-lg leading-none text-black"
            >
              ×
            </button>
            {submitted ? (
              <div className="flex flex-col items-center text-center gap-3 py-4">
                <div className="size-12 rounded-full bg-emerald-100 text-emerald-600 inline-flex items-center justify-center text-2xl">
                  ✓
                </div>
                <h4 className="font-display text-xl">Hatıran kaydedildi</h4>
                <p className="text-sm opacity-75 max-w-xs">
                  Gelin/damat onayından sonra hatıra defterinde gözükecek.
                  Teşekkürler!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h4 className="font-display text-xl mb-3 pr-8">
                  Hatıra Bırak
                </h4>
                <input
                  required
                  placeholder="Adın"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 mb-3 text-sm"
                />
                <textarea
                  required
                  rows={4}
                  maxLength={2000}
                  placeholder="Mesajın"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 mb-2 text-sm resize-none"
                />
                <input
                  type="text"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                  name="company"
                />
                {error ? (
                  <div className="text-xs text-red-600 mb-2 text-center">
                    {error}
                  </div>
                ) : null}
                <p className="text-[10px] text-center opacity-60 mb-3">
                  Mesajın gelin/damat onayından sonra hatıra defterinde
                  gözükecek.
                </p>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-full bg-black text-white py-2.5 text-xs font-chakra uppercase tracking-[0.2em] disabled:opacity-50 cursor-pointer"
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
