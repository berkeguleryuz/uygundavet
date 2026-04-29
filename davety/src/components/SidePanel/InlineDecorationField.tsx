"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { findDecoration } from "@davety/renderer";

/**
 * Tek/çok satırlı düzenlenebilir alan; storage formatı `"{{daisy}} ... "`
 * gibi metin marker'ları taşıyor ama kullanıcı text alanında doğrudan
 * süsleme ikonunun kendisini görüyor. Marker'lar `contenteditable=false`
 * span'ler olarak render ediliyor — backspace ile bütün ikon tek seferde
 * siliniyor, ikon ekle butonu cursor pozisyonuna ekliyor.
 *
 * Çift senkron:
 *   - dış string ↔ içerideki DOM ağacı (sadece value gerçekten değişince
 *     yeniden kuruluyor; her tuşa basıldığında yeniden render etmek
 *     cursor'ı bozardı)
 *   - DOM içerisindeki text + `[data-icon]` span'ler → marker'lı string
 */

const ICON_SVG_NS = "http://www.w3.org/2000/svg";

export interface InlineDecorationFieldHandle {
  /** Süsleme ekleme butonunun çağırdığı yardımcı; cursor pozisyonuna
   *  `{{key}}` marker'ı ekler. Eğer alan focus'ta değilse sona ekler. */
  insertIcon(iconKey: string): void;
  /** Geri uyumluluk için, harici kodun input ref'i gibi kullanmasına
   *  izin verir (focus/blur). */
  focus(): void;
}

interface Props {
  value: string;
  onChange: (next: string) => void;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
}

export const InlineDecorationField = forwardRef<
  InlineDecorationFieldHandle,
  Props
>(function InlineDecorationField(
  { value, onChange, multiline = false, placeholder, className },
  ref,
) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  /** Son yazdığımız string. Dışarıdan gelen `value` bundan farklıysa DOM
   *  yeniden kurulur; aynıysa kullanıcı yazıyor demektir, dokunmuyoruz. */
  const lastWrittenRef = useRef<string>("");

  /* ─── DOM ⇆ string yardımcıları ─── */

  const buildDom = useCallback((root: HTMLElement, raw: string) => {
    root.innerHTML = "";
    if (!raw) return;
    const parts = raw.split(/(\{\{[a-z0-9-]+\}\})/gi);
    for (const part of parts) {
      if (!part) continue;
      const match = /^\{\{([a-z0-9-]+)\}\}$/i.exec(part);
      if (match) {
        const key = match[1];
        const icon = findDecoration(key);
        if (!icon) continue;
        const span = document.createElement("span");
        span.dataset.icon = key;
        span.setAttribute("contenteditable", "false");
        span.className =
          "inline-flex align-middle mx-[1px] -my-[2px] text-current";
        const svg = document.createElementNS(ICON_SVG_NS, "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "1.5");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        // Catalog svg payload is the inner contents of the SVG, not a
        // full <svg> wrapper — innerHTML works because element is in
        // the SVG namespace via createElementNS.
        svg.innerHTML = icon.svg;
        span.appendChild(svg);
        root.appendChild(span);
      } else {
        root.appendChild(document.createTextNode(part));
      }
    }
  }, []);

  const readDom = useCallback((root: HTMLElement): string => {
    let out = "";
    for (const node of Array.from(root.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        out += node.textContent ?? "";
      } else if (node instanceof HTMLElement) {
        const key = node.dataset.icon;
        if (key) {
          out += `{{${key}}}`;
        } else if (node.tagName === "BR") {
          out += "\n";
        } else {
          // İç içe bir element olursa içindeki text'i toparla.
          out += node.textContent ?? "";
        }
      }
    }
    return out;
  }, []);

  /* ─── Dışarıdan gelen value senkronizasyonu ─── */

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (value === lastWrittenRef.current) return;
    buildDom(root, value);
    lastWrittenRef.current = value;
  }, [value, buildDom]);

  /* ─── Kullanıcı input'u ─── */

  const handleInput = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const next = readDom(root);
    lastWrittenRef.current = next;
    onChange(next);
  }, [onChange, readDom]);

  /* ─── insertIcon imperative API ─── */

  useImperativeHandle(
    ref,
    () => ({
      insertIcon(iconKey) {
        const root = rootRef.current;
        if (!root) return;
        const icon = findDecoration(iconKey);
        if (!icon) return;

        // Span oluştur — buildDom ile aynı şablon.
        const span = document.createElement("span");
        span.dataset.icon = iconKey;
        span.setAttribute("contenteditable", "false");
        span.className =
          "inline-flex align-middle mx-[1px] -my-[2px] text-current";
        const svg = document.createElementNS(ICON_SVG_NS, "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "1.5");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.innerHTML = icon.svg;
        span.appendChild(svg);

        const sel = window.getSelection();
        const ownsSelection =
          sel && sel.rangeCount > 0 && root.contains(sel.anchorNode);

        if (ownsSelection) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          range.insertNode(span);
          // Cursor'ı span'in arkasına al
          const after = document.createRange();
          after.setStartAfter(span);
          after.collapse(true);
          sel.removeAllRanges();
          sel.addRange(after);
        } else {
          root.appendChild(span);
          // Cursor'ı sona koy
          root.focus();
          const after = document.createRange();
          after.selectNodeContents(root);
          after.collapse(false);
          const s = window.getSelection();
          s?.removeAllRanges();
          s?.addRange(after);
        }
        handleInput();
      },
      focus() {
        rootRef.current?.focus();
      },
    }),
    [handleInput],
  );

  /* ─── Render ─── */

  const baseCls =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-ring";
  const sizeCls = multiline ? "min-h-[96px] resize-y" : "min-h-[36px]";
  const isEmpty = value.length === 0;

  return (
    <div className="relative">
      <div
        ref={rootRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className={`${baseCls} ${sizeCls} ${className ?? ""}`}
        // Yeni satır karakterini sadece çok-satırlı modda önlemiyoruz.
        onKeyDown={(e) => {
          if (!multiline && e.key === "Enter") e.preventDefault();
        }}
        role="textbox"
        aria-multiline={multiline}
      />
      {isEmpty && placeholder ? (
        <div className="absolute inset-x-3 top-2 pointer-events-none text-sm text-muted-foreground">
          {placeholder}
        </div>
      ) : null}
    </div>
  );
});
