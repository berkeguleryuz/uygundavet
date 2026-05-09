"use client";

import { useId } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { useSupportStore } from "@/src/store/support-store";

// SupportWidget framer-motion + 6 lucide icon + chat UI içeriyor; her
// public sayfada (davetiye render dahil) bundle'da görünüyordu.
// Dinamik import + ssr:false ile sadece kullanıcı launcher'ı tıklayıp
// store'da isOpen=true olunca yüklenir, public davetiye render'larında
// hiç inmemiş oluyor.
const SupportWidget = dynamic(
  () => import("./SupportWidget").then((m) => ({ default: m.SupportWidget })),
  { ssr: false },
);

/**
 * Sağ alt köşede sabit duran chat launcher butonu + panel. Tıklandığında
 * SupportWidget panelini açıp kapatıyor.
 *
 * uygundavet'in MainBottomBar'ındaki ChatSmileGlyph animasyonunun aynısı
 * (3 nokta typing indicator + balon), büyük beyaz daire, kırmızı bildirim
 * noktası. Hover'da hafif scale up.
 *
 * Görünmez kalması gereken yerler:
 *   - Public davetiye sayfaları (/davetiyem/[slug] ve token'lı versiyonu),
 *     misafirler envelope animasyonunu görüyor, üstüne chat
 *     butonu binmesin.
 *   - Editor canvas'ı (/design/invitations/[id]/editor), zaten kendi
 *     toolbar'ı var.
 */
const HIDDEN_PATH_PATTERNS = [
  /\/i\/[^/]+/,
  /\/design\/invitations\/[^/]+\/editor/,
];

function ChatSmileGlyph({ className }: { className?: string }) {
  const maskId = useId();
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="white" />
          <circle cx="8" cy="10" r="1" fill="black">
            <animate
              attributeName="r"
              values="0.6;1.4;0.6"
              keyTimes="0;0.5;1"
              dur="1.2s"
              begin="0s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              keyTimes="0;0.5;1"
              dur="1.2s"
              begin="0s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="12" cy="10" r="1" fill="black">
            <animate
              attributeName="r"
              values="0.6;1.4;0.6"
              keyTimes="0;0.5;1"
              dur="1.2s"
              begin="0.2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              keyTimes="0;0.5;1"
              dur="1.2s"
              begin="0.2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="16" cy="10" r="1" fill="black">
            <animate
              attributeName="r"
              values="0.6;1.4;0.6"
              keyTimes="0;0.5;1"
              dur="1.2s"
              begin="0.4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              keyTimes="0;0.5;1"
              dur="1.2s"
              begin="0.4s"
              repeatCount="indefinite"
            />
          </circle>
        </mask>
      </defs>
      <path
        mask={`url(#${maskId})`}
        d="M6 3.5A2.5 2.5 0 0 0 3.5 6v8A2.5 2.5 0 0 0 6 16.5h1.3v2.6c0 .57.68.87 1.1.48l3.4-3.08H18a2.5 2.5 0 0 0 2.5-2.5V6A2.5 2.5 0 0 0 18 3.5H6Z"
      />
    </svg>
  );
}

export function SupportLauncher() {
  const pathname = usePathname() ?? "";
  const isOpen = useSupportStore((s) => s.isOpen);
  // Store'da sticky tutulan flag — kullanıcı bir kez açınca true kalır,
  // kapatma sonrası da widget mount'ta kalır (animasyon + state).
  // Sayfa yüklenir yüklenmez bundle'a düşmesin diye lazy.
  const hasEverOpened = useSupportStore((s) => s.hasEverOpened);
  const toggle = useSupportStore((s) => s.toggle);
  const t = useTranslations("Support");

  const hidden = HIDDEN_PATH_PATTERNS.some((re) => re.test(pathname));
  if (hidden) return null;

  return (
    <>
      {hasEverOpened ? <SupportWidget /> : null}
      <button
        type="button"
        onClick={toggle}
        aria-label={isOpen ? t("close") : t("openSupport")}
        aria-expanded={isOpen}
        className="fixed right-5 bottom-5 sm:right-6 sm:bottom-6 z-[71] w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)] border border-black/5"
        style={{
          background: isOpen ? "#1c1a1b" : "#ffffff",
          color: isOpen ? "#d5d1ad" : "#1c1a1b",
        }}
      >
        {isOpen ? (
          <X className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.2} />
        ) : (
          <>
            <ChatSmileGlyph className="w-6 h-6 sm:w-7 sm:h-7" />
            <span
              className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#ef4444]"
              style={{ boxShadow: "0 0 0 2px #ffffff" }}
              aria-hidden="true"
            />
          </>
        )}
      </button>
    </>
  );
}
