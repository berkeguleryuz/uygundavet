"use client";

/**
 * Tier ikonları, paket-bazlı sıfırdan tasarlanmış sürekli animasyonlu
 * SVG'ler. Hem PricingTable hem SaveScreen'de aynı yapıyı kullanıyor.
 *
 * Tasarım prensibi: animasyonlar her zaman görünür olsun, kullanıcı ilk
 * paint'i kaçırsa bile pakete bakınca hareket fark etmeli. Her ikon
 * birden fazla animasyon katmanı içerir (motion + scale + opacity).
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
      /* ── Free, parıltı + yörünge ────────────────────────────────── */
      @keyframes tier-sparkle-pulse {
        0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
        50%      { transform: scale(1.25) rotate(15deg); opacity: 0.85; }
      }
      @keyframes tier-orbit-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes tier-orbit-counter-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(-360deg); }
      }
      @keyframes tier-particle-burst {
        0%   { opacity: 0; r: 0.3; }
        25%  { opacity: 1; r: 1.3; }
        70%  { opacity: 1; r: 1.0; }
        100% { opacity: 0; r: 0.3; }
      }
      .tier-sparkle-core {
        transform-origin: 12px 12px;
        animation: tier-sparkle-pulse 1.6s ease-in-out infinite;
      }
      .tier-sparkle-orbit-cw {
        transform-origin: 12px 12px;
        animation: tier-orbit-spin 6s linear infinite;
      }
      .tier-sparkle-orbit-ccw {
        transform-origin: 12px 12px;
        animation: tier-orbit-counter-spin 8s linear infinite;
      }
      .tier-particle {
        animation: tier-particle-burst 1.8s ease-in-out infinite;
      }
      .tier-particle-d1 { animation-delay: 0.0s; }
      .tier-particle-d2 { animation-delay: 0.3s; }
      .tier-particle-d3 { animation-delay: 0.6s; }
      .tier-particle-d4 { animation-delay: 0.9s; }
      .tier-particle-d5 { animation-delay: 1.2s; }

      /* ── Basic, yıldız twinkle + halo + dolan ışık ──────────────── */
      @keyframes tier-star-fill {
        0%, 100% { fill-opacity: 0.15; }
        50%      { fill-opacity: 0.55; }
      }
      @keyframes tier-star-bob {
        0%, 100% { transform: translateY(0) rotate(-4deg); }
        50%      { transform: translateY(-1px) rotate(4deg); }
      }
      @keyframes tier-star-halo {
        0%, 100% { opacity: 0.1;  transform: scale(0.85); }
        50%      { opacity: 0.45; transform: scale(1.15); }
      }
      @keyframes tier-star-flash {
        0%, 90%, 100% { opacity: 0; transform: translateX(-14px) skewX(-20deg); }
        45%           { opacity: 0.85; transform: translateX(14px) skewX(-20deg); }
      }
      .tier-star-host {
        transform-origin: 12px 12px;
        animation: tier-star-bob 2.2s ease-in-out infinite;
      }
      .tier-star-fill {
        animation: tier-star-fill 1.6s ease-in-out infinite;
      }
      .tier-star-halo {
        transform-origin: 12px 12px;
        animation: tier-star-halo 1.8s ease-in-out infinite;
      }
      .tier-star-flash {
        animation: tier-star-flash 2.4s ease-in-out infinite;
      }

      /* ── Pro, yıldırım flash + arc'lar + titreme ────────────────── */
      @keyframes tier-bolt-shake {
        0%, 100% { transform: translate(0, 0); }
        10%      { transform: translate(-0.5px, 0.5px); }
        30%      { transform: translate(0.5px, -0.5px); }
        50%      { transform: translate(-0.3px, -0.5px); }
        70%      { transform: translate(0.5px, 0.3px); }
        90%      { transform: translate(-0.5px, 0.5px); }
      }
      @keyframes tier-bolt-glow {
        0%, 100% { fill-opacity: 0.2; filter: drop-shadow(0 0 0px currentColor); }
        50%      { fill-opacity: 0.6; filter: drop-shadow(0 0 4px currentColor); }
      }
      @keyframes tier-bolt-arc {
        0%   { stroke-dashoffset: 30; opacity: 0; }
        15%  { opacity: 1; }
        70%  { opacity: 1; }
        100% { stroke-dashoffset: -30; opacity: 0; }
      }
      @keyframes tier-bolt-spark {
        0%   { opacity: 0; transform: translate(0, 0) scale(0.4); }
        30%  { opacity: 1; }
        100% { opacity: 0; transform: var(--spark-end) scale(1.5); }
      }
      .tier-bolt-host {
        transform-origin: 12px 12px;
        animation: tier-bolt-shake 0.4s ease-in-out infinite;
      }
      .tier-bolt-fill {
        animation: tier-bolt-glow 1s ease-in-out infinite;
      }
      .tier-bolt-arc-1 {
        stroke-dasharray: 30;
        animation: tier-bolt-arc 1.4s ease-in-out infinite;
      }
      .tier-bolt-arc-2 {
        stroke-dasharray: 30;
        animation: tier-bolt-arc 1.4s ease-in-out 0.45s infinite;
      }
      .tier-bolt-arc-3 {
        stroke-dasharray: 30;
        animation: tier-bolt-arc 1.4s ease-in-out 0.9s infinite;
      }
      .tier-bolt-spark {
        transform-box: fill-box;
        transform-origin: center;
        animation: tier-bolt-spark 1.4s ease-out infinite;
      }
      .tier-bolt-spark-1 { --spark-end: translate(-3px, -3px); animation-delay: 0s;    }
      .tier-bolt-spark-2 { --spark-end: translate(3px, -3px);  animation-delay: 0.2s; }
      .tier-bolt-spark-3 { --spark-end: translate(-3px, 3px);  animation-delay: 0.4s; }
      .tier-bolt-spark-4 { --spark-end: translate(3px, 3px);   animation-delay: 0.7s; }
      .tier-bolt-spark-5 { --spark-end: translate(0, -4px);    animation-delay: 1.0s; }

      /* ── Premium, taç + ışın + mücevherler + pırıltılar ─────────── */
      @keyframes tier-crown-float {
        0%, 100% { transform: translateY(0) rotate(-2deg); }
        25%      { transform: translateY(-1.2px) rotate(0deg); }
        50%      { transform: translateY(-1.8px) rotate(2deg); }
        75%      { transform: translateY(-1.2px) rotate(0deg); }
      }
      @keyframes tier-crown-gem-pulse {
        0%, 100% { opacity: 0.65; transform: scale(0.85); }
        50%      { opacity: 1;    transform: scale(1.4); }
      }
      @keyframes tier-crown-rays {
        0%, 100% { opacity: 0;    transform: scale(0.4) rotate(0deg); }
        40%      { opacity: 0.6;  transform: scale(1.2) rotate(45deg); }
        70%      { opacity: 0.4;  transform: scale(1.4) rotate(90deg); }
        100%     { opacity: 0;    transform: scale(1.6) rotate(180deg); }
      }
      @keyframes tier-crown-shimmer {
        0%   { opacity: 0; transform: translateX(-16px) skewX(-25deg); }
        50%  { opacity: 0.85; }
        100% { opacity: 0; transform: translateX(16px) skewX(-25deg); }
      }
      @keyframes tier-crown-sparkle {
        0%, 100% { opacity: 0; transform: scale(0.3) rotate(0deg); }
        40%      { opacity: 1; transform: scale(1.3) rotate(45deg); }
        80%      { opacity: 0.5; transform: scale(0.8) rotate(90deg); }
      }
      .tier-crown-host {
        transform-origin: 12px 18px;
        animation: tier-crown-float 2.6s ease-in-out infinite;
      }
      .tier-crown-rays {
        transform-origin: 12px 12px;
        animation: tier-crown-rays 2.4s ease-out infinite;
      }
      .tier-crown-gem-1 {
        transform-box: fill-box;
        transform-origin: center;
        animation: tier-crown-gem-pulse 1.4s ease-in-out infinite;
      }
      .tier-crown-gem-2 {
        transform-box: fill-box;
        transform-origin: center;
        animation: tier-crown-gem-pulse 1.4s ease-in-out 0.35s infinite;
      }
      .tier-crown-gem-3 {
        transform-box: fill-box;
        transform-origin: center;
        animation: tier-crown-gem-pulse 1.4s ease-in-out 0.7s infinite;
      }
      .tier-crown-shimmer {
        animation: tier-crown-shimmer 2.2s ease-in-out infinite;
      }
      .tier-crown-sparkle-1 {
        transform-box: fill-box;
        transform-origin: center;
        animation: tier-crown-sparkle 2.0s ease-in-out infinite;
      }
      .tier-crown-sparkle-2 {
        transform-box: fill-box;
        transform-origin: center;
        animation: tier-crown-sparkle 2.0s ease-in-out 0.6s infinite;
      }
      .tier-crown-sparkle-3 {
        transform-box: fill-box;
        transform-origin: center;
        animation: tier-crown-sparkle 2.0s ease-in-out 1.2s infinite;
      }
      .tier-crown-sparkle-4 {
        transform-box: fill-box;
        transform-origin: center;
        animation: tier-crown-sparkle 2.0s ease-in-out 1.6s infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .tier-sparkle-core, .tier-sparkle-orbit-cw, .tier-sparkle-orbit-ccw,
        .tier-particle,
        .tier-star-host, .tier-star-fill, .tier-star-halo, .tier-star-flash,
        .tier-bolt-host, .tier-bolt-fill,
        .tier-bolt-arc-1, .tier-bolt-arc-2, .tier-bolt-arc-3,
        .tier-bolt-spark,
        .tier-crown-host, .tier-crown-rays,
        .tier-crown-gem-1, .tier-crown-gem-2, .tier-crown-gem-3,
        .tier-crown-shimmer,
        .tier-crown-sparkle-1, .tier-crown-sparkle-2,
        .tier-crown-sparkle-3, .tier-crown-sparkle-4 {
          animation: none !important;
        }
      }
    `}</style>
  );
}

/* Free, başlangıç paketi: pulse eden elmas + 2 yönde dönen yörüngeler + parçacık burst'leri */
export function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <g className="tier-sparkle-core">
        <path
          d="M12 4 L13.6 10.4 L20 12 L13.6 13.6 L12 20 L10.4 13.6 L4 12 L10.4 10.4 Z"
          fill="currentColor"
          fillOpacity="0.25"
        />
        <path d="M12 4 L13.6 10.4 L20 12 L13.6 13.6 L12 20 L10.4 13.6 L4 12 L10.4 10.4 Z" />
      </g>
      {/* Saat yönünde dönen iç yörünge */}
      <g className="tier-sparkle-orbit-cw">
        <circle
          className="tier-particle tier-particle-d1"
          cx="20"
          cy="6"
          r="0.8"
          fill="currentColor"
          stroke="none"
        />
        <circle
          className="tier-particle tier-particle-d3"
          cx="4"
          cy="6"
          r="0.7"
          fill="currentColor"
          stroke="none"
        />
      </g>
      {/* Saat tersine dönen dış yörünge */}
      <g className="tier-sparkle-orbit-ccw">
        <circle
          className="tier-particle tier-particle-d2"
          cx="21"
          cy="20"
          r="0.7"
          fill="currentColor"
          stroke="none"
        />
        <circle
          className="tier-particle tier-particle-d4"
          cx="3"
          cy="20"
          r="0.8"
          fill="currentColor"
          stroke="none"
        />
        <circle
          className="tier-particle tier-particle-d5"
          cx="12"
          cy="2"
          r="0.6"
          fill="currentColor"
          stroke="none"
        />
      </g>
    </svg>
  );
}

/* Basic, klasik paketi: sallanan yıldız + nefes alan halo + dolup boşalan iç + yatay flash ışığı */
export function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="tier-star-clip">
          <path d="M12 3 L14.6 9.3 L21.4 9.9 L16.2 14.4 L17.8 21 L12 17.4 L6.2 21 L7.8 14.4 L2.6 9.9 L9.4 9.3 Z" />
        </clipPath>
      </defs>
      <circle
        className="tier-star-halo"
        cx="12"
        cy="12"
        r="10"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="none"
      />
      <g className="tier-star-host">
        <path
          className="tier-star-fill"
          d="M12 3 L14.6 9.3 L21.4 9.9 L16.2 14.4 L17.8 21 L12 17.4 L6.2 21 L7.8 14.4 L2.6 9.9 L9.4 9.3 Z"
          fill="currentColor"
        />
        <path d="M12 3 L14.6 9.3 L21.4 9.9 L16.2 14.4 L17.8 21 L12 17.4 L6.2 21 L7.8 14.4 L2.6 9.9 L9.4 9.3 Z" />
        <rect
          className="tier-star-flash"
          x="-4"
          y="2"
          width="6"
          height="20"
          fill="currentColor"
          fillOpacity="0.9"
          stroke="none"
          clipPath="url(#tier-star-clip)"
        />
      </g>
    </svg>
  );
}

/* Pro, profesyonel paketi: titreyen yıldırım + glow + 3 elektrik arc + dışa fırlayan kıvılcımlar */
export function ZapIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <g className="tier-bolt-host">
        <path
          className="tier-bolt-fill"
          d="M13 2 L4 13 L10 13 L9 22 L20 9 L13 9 L14 2 Z"
          fill="currentColor"
        />
        <path d="M13 2 L4 13 L10 13 L9 22 L20 9 L13 9 L14 2 Z" />
      </g>
      <path
        className="tier-bolt-arc-1"
        d="M2 7 Q 5 8 6 5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        className="tier-bolt-arc-2"
        d="M22 17 Q 19 16 18 19"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        className="tier-bolt-arc-3"
        d="M2 18 Q 4 16 6 18"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle
        className="tier-bolt-spark tier-bolt-spark-1"
        cx="3"
        cy="3"
        r="0.8"
        fill="currentColor"
        stroke="none"
      />
      <circle
        className="tier-bolt-spark tier-bolt-spark-2"
        cx="21"
        cy="3"
        r="0.8"
        fill="currentColor"
        stroke="none"
      />
      <circle
        className="tier-bolt-spark tier-bolt-spark-3"
        cx="3"
        cy="21"
        r="0.7"
        fill="currentColor"
        stroke="none"
      />
      <circle
        className="tier-bolt-spark tier-bolt-spark-4"
        cx="21"
        cy="21"
        r="0.9"
        fill="currentColor"
        stroke="none"
      />
      <circle
        className="tier-bolt-spark tier-bolt-spark-5"
        cx="12"
        cy="1"
        r="0.7"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

/* Premium: süzülen taç + dönen ışın halkası + 3 mücevher pulse + 4 köşe pırıltısı + altın shimmer */
export function CrownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="tier-crown-clip">
          <path d="M3 8 L7 13 L12 5 L17 13 L21 8 L19 18 L5 18 Z" />
        </clipPath>
      </defs>
      {/* Arka plan ışın halkası, dönerek genişler */}
      <g className="tier-crown-rays">
        <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
        <line x1="2" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
        <line x1="22" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
        <line x1="5" y1="5" x2="7" y2="7" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
        <line x1="19" y1="5" x2="17" y2="7" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
      </g>
      <g className="tier-crown-host">
        <path
          d="M3 8 L7 13 L12 5 L17 13 L21 8 L19 18 L5 18 Z"
          fill="currentColor"
          fillOpacity="0.22"
        />
        <path d="M3 8 L7 13 L12 5 L17 13 L21 8 L19 18 L5 18 Z" />
        <path d="M5 21 L19 21" />
        {/* Altın shimmer çizgi, sağa-sola süzülür */}
        <rect
          className="tier-crown-shimmer"
          x="-5"
          y="6"
          width="6"
          height="14"
          fill="currentColor"
          fillOpacity="0.9"
          stroke="none"
          clipPath="url(#tier-crown-clip)"
        />
        {/* 3 mücevher staggered pulse */}
        <circle
          className="tier-crown-gem-1"
          cx="12"
          cy="11"
          r="1.4"
          fill="currentColor"
          stroke="none"
        />
        <circle
          className="tier-crown-gem-2"
          cx="6.5"
          cy="13"
          r="1.0"
          fill="currentColor"
          stroke="none"
        />
        <circle
          className="tier-crown-gem-3"
          cx="17.5"
          cy="13"
          r="1.0"
          fill="currentColor"
          stroke="none"
        />
      </g>
      {/* 4 köşe pırıltısı, küçük yıldız şeklinde */}
      <path
        className="tier-crown-sparkle-1"
        d="M2 4 L2.4 5 L3.4 5.4 L2.4 5.8 L2 6.8 L1.6 5.8 L0.6 5.4 L1.6 5 Z"
        fill="currentColor"
        stroke="none"
      />
      <path
        className="tier-crown-sparkle-2"
        d="M22 4 L22.3 4.8 L23.1 5.1 L22.3 5.4 L22 6.2 L21.7 5.4 L20.9 5.1 L21.7 4.8 Z"
        fill="currentColor"
        stroke="none"
      />
      <path
        className="tier-crown-sparkle-3"
        d="M21 22 L21.3 22.6 L22 22.9 L21.3 23.2 L21 23.8 L20.7 23.2 L20 22.9 L20.7 22.6 Z"
        fill="currentColor"
        stroke="none"
      />
      <path
        className="tier-crown-sparkle-4"
        d="M3 22 L3.3 22.6 L4 22.9 L3.3 23.2 L3 23.8 L2.7 23.2 L2 22.9 L2.7 22.6 Z"
        fill="currentColor"
        stroke="none"
      />
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
