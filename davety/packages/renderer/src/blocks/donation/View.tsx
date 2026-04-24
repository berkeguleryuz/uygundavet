"use client";

import { useState } from "react";
import type { DonationData } from "@davety/schema";
import { fieldStyle, styleToCss, type BlockViewProps } from "../types";

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
    <section className="px-6 py-10 text-center" style={rootStyle}>
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
        <div className="max-w-md mx-auto border border-current/20 rounded-md p-4 flex items-center justify-between gap-3">
          <code className="text-sm font-chakra break-all">{iban}</code>
          <button
            onClick={handleCopy}
            className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-current/10 hover:bg-current/20"
          >
            {copied ? "Kopyalandı" : "Kopyala"}
          </button>
        </div>
      ) : (
        <div className="text-sm opacity-50 italic">IBAN eklenmedi</div>
      )}
    </section>
  );
}
