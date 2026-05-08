"use client";

import { useState } from "react";
import type { DonationData } from "@davety/schema";
import { alignClasses, fieldStyle, styleToCss, type BlockViewProps } from "../types";

export function DonationView({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<DonationData>) {
  const rootStyle = styleToCss(block.style);
  const { iban, title, description } = block.data;
  const [copied, setCopied] = useState(false);

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

  async function handleCopy() {
    if (!iban) return;
    await navigator.clipboard.writeText(iban);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section
      className={`px-2 py-10 flex flex-col ${alignClasses(block.style.align)}`}
      style={rootStyle}
    >
      <h3
        {...click("title")}
        className="font-display text-2xl mb-2"
        style={fieldStyle(block, "title")}
      >
        {title || "Bizlere Destek Olun"}
      </h3>
      {description ? (
        <p
          {...click("description")}
          className="text-sm opacity-80 max-w-md mx-auto mb-5"
          style={fieldStyle(block, "description")}
        >
          {description}
        </p>
      ) : null}

      {iban ? (
        /* Tüm IBAN kartı bir button — kullanıcı kartın herhangi bir yerine
           tıklayınca clipboard'a kopyalanır. Köşedeki "Kopyala" rozeti
           hala görsel ipucu için duruyor, gerçek tetikleyici button'un
           kendisi. Editor'de (editable=true) kopya devre dışı, yoksa
           canvas'ta düzenleme tıklamalarına çakışırdı. */
        <button
          type="button"
          onClick={editable ? undefined : handleCopy}
          aria-label={copied ? "IBAN kopyalandı" : "IBAN'ı kopyala"}
          className={`max-w-md mx-auto w-full border border-current/20 rounded-md p-4 flex items-center justify-between gap-3 text-left transition ${
            editable
              ? "cursor-default"
              : "cursor-pointer hover:bg-current/5 active:scale-[0.99]"
          }`}
        >
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-60">
              IBAN
            </span>
            <code className="text-sm font-chakra break-all">{iban}</code>
            {!editable ? (
              <span className="text-[10px] opacity-50 mt-1">
                Tıkla, panoya kopyalansın
              </span>
            ) : null}
          </div>
          <span className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-current/10">
            {copied ? "Kopyalandı" : "Kopyala"}
          </span>
        </button>
      ) : (
        <div className="text-sm opacity-50 italic">IBAN eklenmedi</div>
      )}
    </section>
  );
}
