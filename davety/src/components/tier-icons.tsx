"use client";

/**
 * Paylaşımlı tier ikonları — hem SaveScreen TierPicker'da hem de
 * homepage PricingTable'da aynı görünüp aynı "draw from 0" animasyon
 * ile çiziliyor. Tek bir yapıdan beslendikleri için fiyatlandırma UI'ı
 * her yerde tutarlı.
 *
 * Kullanım:
 *   <TierIconStyles />              // sayfada bir kez
 *   <SparkleIcon className="..." /> // free
 *   <StarIcon className="..." />    // basic
 *   <ZapIcon className="..." />     // pro
 *   <CrownIcon className="..." />   // premium
 */

import type { PlanTier } from "@davety/schema";

export type TierIconComponent = (props: {
  className?: string;
}) => React.ReactElement;

export function TierIconStyles() {
  return (
    <style>{`
      @keyframes ssp-draw {
        from { stroke-dashoffset: 100; }
        to   { stroke-dashoffset: 0; }
      }
      @keyframes ssp-fadein {
        from { opacity: 0; transform: scale(0.6); }
        to   { opacity: 1; transform: scale(1); }
      }
      @keyframes ssp-idle {
        0%,100% { transform: translateY(0); }
        50%     { transform: translateY(-1px); }
      }

      .ssp-draw-1, .ssp-draw-2, .ssp-draw-3, .ssp-draw-4 {
        stroke-dasharray: 100;
        stroke-dashoffset: 100;
        animation:
          ssp-draw 1.4s ease-out forwards,
          ssp-idle 3.2s ease-in-out 1.6s infinite;
      }
      .ssp-draw-1 { animation-delay: 0s, 1.4s; }
      .ssp-draw-2 { animation-delay: 0.25s, 1.65s; }
      .ssp-draw-3 { animation-delay: 0.5s, 1.9s; }
      .ssp-draw-4 { animation-delay: 0.75s, 2.15s; }

      .ssp-dot {
        transform-box: fill-box;
        transform-origin: center;
        opacity: 0;
        animation: ssp-fadein 0.4s ease-out forwards;
      }
      .ssp-dot-1 { animation-delay: 1.0s; }
      .ssp-dot-2 { animation-delay: 1.2s; }
      .ssp-dot-3 { animation-delay: 1.4s; }

      @media (prefers-reduced-motion: reduce) {
        .ssp-draw-1, .ssp-draw-2, .ssp-draw-3, .ssp-draw-4 {
          stroke-dashoffset: 0;
          animation: none;
        }
        .ssp-dot { opacity: 1; animation: none; }
      }
    `}</style>
  );
}

export function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        className="ssp-draw-1"
        pathLength={100}
        d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
      />
      <path className="ssp-draw-2" pathLength={100} d="M20 3v4" />
      <path className="ssp-draw-3" pathLength={100} d="M22 5h-4" />
    </svg>
  );
}

export function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        className="ssp-draw-1"
        pathLength={100}
        d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755A2.122 2.122 0 0 0 9.213 6.974z"
      />
    </svg>
  );
}

export function ZapIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        className="ssp-draw-1"
        pathLength={100}
        d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
      />
      <circle className="ssp-dot ssp-dot-1" cx="20.5" cy="4" r="0.8" fill="currentColor" stroke="none" />
      <circle className="ssp-dot ssp-dot-2" cx="3" cy="20" r="0.7" fill="currentColor" stroke="none" />
      <circle className="ssp-dot ssp-dot-3" cx="21" cy="21" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CrownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        className="ssp-draw-1"
        pathLength={100}
        d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.518L7.09 9.165a1 1 0 0 0 1.517-.294z"
      />
      <path className="ssp-draw-2" pathLength={100} d="M5 21h14" />
      <circle className="ssp-dot ssp-dot-1" cx="12" cy="3.6" r="0.9" fill="currentColor" stroke="none" />
      <circle className="ssp-dot ssp-dot-2" cx="3" cy="6" r="0.7" fill="currentColor" stroke="none" />
      <circle className="ssp-dot ssp-dot-3" cx="21" cy="6" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function tierIconFor(tier: PlanTier): TierIconComponent {
  switch (tier) {
    case "free":
      return SparkleIcon;
    case "basic":
      return StarIcon;
    case "pro":
      return ZapIcon;
    case "premium":
      return CrownIcon;
  }
}
