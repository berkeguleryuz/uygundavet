"use client";

/**
 * Davetiye paylaşım kanal ikonları, brand-accurate SVG + sürekli ince
 * animasyonlar. Her ikon kendi platformunun resmi formuna yakın
 * (telegram uçağı, mail zarfı, vs.) ve hover olmadan görünür hareket
 * eder.
 *
 * Kullanım:
 *   <ShareIconStyles />                     // sayfada bir kez
 *   <WhatsAppIcon className="size-4" />     // ...
 */

export function ShareIconStyles() {
  return (
    <style>{`
      @keyframes share-wa-pulse {
        0%, 100% { transform: scale(1); }
        50%      { transform: scale(1.08); }
      }
      @keyframes share-wa-dot {
        0%, 100% { opacity: 0.4; transform: translateY(0); }
        50%      { opacity: 1;   transform: translateY(-0.6px); }
      }
      .share-wa-host {
        transform-origin: center;
        animation: share-wa-pulse 1.8s ease-in-out infinite;
      }
      .share-wa-dot-1 {
        transform-box: fill-box;
        transform-origin: center;
        animation: share-wa-dot 1.0s ease-in-out infinite;
      }
      .share-wa-dot-2 {
        transform-box: fill-box;
        transform-origin: center;
        animation: share-wa-dot 1.0s ease-in-out 0.2s infinite;
      }
      .share-wa-dot-3 {
        transform-box: fill-box;
        transform-origin: center;
        animation: share-wa-dot 1.0s ease-in-out 0.4s infinite;
      }

      @keyframes share-mail-fly {
        0%, 100% { transform: translateY(0); }
        50%      { transform: translateY(-1px); }
      }
      @keyframes share-mail-line {
        0%   { stroke-dashoffset: 8; opacity: 0; }
        50%  { opacity: 0.7; }
        100% { stroke-dashoffset: -8; opacity: 0; }
      }
      .share-mail-host {
        transform-origin: center;
        animation: share-mail-fly 1.6s ease-in-out infinite;
      }
      .share-mail-line {
        stroke-dasharray: 8;
        animation: share-mail-line 1.4s ease-in-out infinite;
      }
      .share-mail-line-2 { animation-delay: 0.35s; }
      .share-mail-line-3 { animation-delay: 0.7s; }

      @keyframes share-tg-fly {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        25%      { transform: translate(0.6px, -0.6px) rotate(2deg); }
        50%      { transform: translate(0, -1px) rotate(0deg); }
        75%      { transform: translate(-0.6px, -0.6px) rotate(-2deg); }
      }
      @keyframes share-tg-trail {
        0%   { stroke-dashoffset: 14; opacity: 0; }
        40%  { opacity: 0.8; }
        100% { stroke-dashoffset: -14; opacity: 0; }
      }
      .share-tg-host {
        transform-origin: center;
        animation: share-tg-fly 2.2s ease-in-out infinite;
      }
      .share-tg-trail {
        stroke-dasharray: 14;
        animation: share-tg-trail 1.6s ease-out infinite;
      }
      .share-tg-trail-2 { animation-delay: 0.4s; }

      @keyframes share-x-glitch {
        0%, 100% { transform: translate(0, 0); }
        20%      { transform: translate(0.4px, -0.3px); }
        40%      { transform: translate(-0.4px, 0.3px); }
        60%      { transform: translate(0.3px, 0.4px); }
        80%      { transform: translate(-0.3px, -0.4px); }
      }
      .share-x-host {
        transform-origin: center;
        animation: share-x-glitch 1.4s steps(5, end) infinite;
      }

      @keyframes share-sms-bubble {
        0%, 100% { transform: translateY(0); }
        50%      { transform: translateY(-1px); }
      }
      @keyframes share-sms-typing {
        0%   { opacity: 0.3; transform: scale(0.7); }
        40%  { opacity: 1;   transform: scale(1.1); }
        80%  { opacity: 0.3; transform: scale(0.7); }
      }
      .share-sms-host {
        transform-origin: center;
        animation: share-sms-bubble 2.0s ease-in-out infinite;
      }
      .share-sms-dot {
        transform-box: fill-box;
        transform-origin: center;
        animation: share-sms-typing 1.2s ease-in-out infinite;
      }
      .share-sms-dot-2 { animation-delay: 0.2s; }
      .share-sms-dot-3 { animation-delay: 0.4s; }

      @keyframes share-native-arrow {
        0%, 100% { transform: translateY(0); opacity: 1; }
        50%      { transform: translateY(-1.5px); opacity: 0.9; }
      }
      @keyframes share-native-ring {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50%      { opacity: 0.8; transform: scale(1.15); }
      }
      .share-native-arrow {
        transform-origin: center;
        animation: share-native-arrow 1.4s ease-in-out infinite;
      }
      .share-native-ring-1 {
        transform-box: fill-box;
        transform-origin: center;
        animation: share-native-ring 1.6s ease-in-out infinite;
      }
      .share-native-ring-2 {
        transform-box: fill-box;
        transform-origin: center;
        animation: share-native-ring 1.6s ease-in-out 0.3s infinite;
      }
      .share-native-ring-3 {
        transform-box: fill-box;
        transform-origin: center;
        animation: share-native-ring 1.6s ease-in-out 0.6s infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .share-wa-host, .share-wa-dot-1, .share-wa-dot-2, .share-wa-dot-3,
        .share-mail-host, .share-mail-line,
        .share-tg-host, .share-tg-trail,
        .share-x-host,
        .share-sms-host, .share-sms-dot,
        .share-native-arrow, .share-native-ring-1, .share-native-ring-2, .share-native-ring-3 {
          animation: none !important;
        }
      }
    `}</style>
  );
}

/* WhatsApp, resmi logo (chat balonu + telefon ahizesi). Animasyon
   olarak balonun hafif scale pulse'u var; phone ahizesi içinde değil
   çünkü orijinal logoda hareketli element yok. Brand-recognisable
   formu korumak öncelikli. */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g className="share-wa-host">
        <path
          fill="currentColor"
          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.83 9.83 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413"
        />
      </g>
    </svg>
  );
}

/* E-posta, zarf + uçan çizgiler (gönderim hissi) */
export function EmailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <g className="share-mail-host">
        <rect
          x="3"
          y="6"
          width="18"
          height="13"
          rx="2"
          fill="currentColor"
          fillOpacity="0.15"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M3.5 7 L12 13 L20.5 7"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="none"
          strokeLinejoin="round"
        />
      </g>
      <line
        className="share-mail-line"
        x1="0"
        y1="9"
        x2="3"
        y2="9"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <line
        className="share-mail-line share-mail-line-2"
        x1="0"
        y1="13"
        x2="3"
        y2="13"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <line
        className="share-mail-line share-mail-line-3"
        x1="0"
        y1="17"
        x2="3"
        y2="17"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

/* Telegram, mavi kağıt uçağı + hareket izi */
export function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        className="share-tg-trail"
        d="M2 16 L7 14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        className="share-tg-trail share-tg-trail-2"
        d="M2 19 L6 17.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <g className="share-tg-host">
        <path
          d="M21.5 3.5 L2.5 11.2 L8.5 13.6 L10.5 19.8 L13.5 16 L18.5 19.5 L21.5 3.5 Z"
          fill="currentColor"
          fillOpacity="0.92"
        />
        <path
          d="M8.5 13.6 L18.5 5.5 L11 14"
          stroke="white"
          strokeWidth="0.8"
          fill="none"
          strokeLinejoin="round"
          opacity="0.6"
        />
      </g>
    </svg>
  );
}

/* X / Twitter, glitch titreşimli */
export function XBrandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g className="share-x-host">
        <path
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

/* SMS, chat balonu + yazıyor 3 nokta */
export function SmsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <g className="share-sms-host">
        <path
          d="M3 6 a3 3 0 0 1 3-3 h12 a3 3 0 0 1 3 3 v8 a3 3 0 0 1-3 3 H10 l-4 4 v-4 H6 a3 3 0 0 1-3-3 Z"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle className="share-sms-dot" cx="8" cy="10" r="1" fill="currentColor" />
        <circle className="share-sms-dot share-sms-dot-2" cx="12" cy="10" r="1" fill="currentColor" />
        <circle className="share-sms-dot share-sms-dot-3" cx="16" cy="10" r="1" fill="currentColor" />
      </g>
    </svg>
  );
}

/* Native share, ok yukarı + 3 dalgalanan halka (cihaz paylaşım hissi) */
export function NativeShareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <circle
        className="share-native-ring-1"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.3"
      />
      <circle
        className="share-native-ring-2"
        cx="12"
        cy="12"
        r="7"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.3"
      />
      <circle
        className="share-native-ring-3"
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.3"
      />
      <g className="share-native-arrow">
        <path
          d="M12 4 L12 15 M12 4 L8 8 M12 4 L16 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 14 L5 18 a2 2 0 0 0 2 2 h10 a2 2 0 0 0 2-2 v-4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
