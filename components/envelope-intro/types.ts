export type EnvelopeIntroTheme = {
  /** sessionStorage anahtarı, ör. "sunset-envelope-opened" */
  storageKey: string;
  /** FOUC için <html>'e eklenen sınıf, ör. "sunset-envelope-seen" */
  foucClass: string;
  /** Görsel yolu, ör. "/temalar/envelopes/sunset.webp" */
  imageSrc: string;
  /** Görsel oranı (CSS aspect-ratio değeri), ör. "654/938" */
  aspect: string;
  /** Kapak ucunun yükseklik yüzdesi (0-100), ör. 53 */
  flapTipPercent: number;
  /** Tam ekran overlay arka planı (CSS background değeri) */
  overlayBg: string;
  /** Mum mühür dolgusu (CSS background değeri) */
  sealBg: string;
  /** Mühür monogram yazı rengi (hex) */
  monogramColor: string;
  /** Mühür hover/focus halo rengi (rgba) */
  sealGlow: string;
  /** Çift adı yazı rengi (hex) */
  coupleNameColor: string;
  /** "Bu davetiye size özeldir" yazı rengi (hex/rgba) */
  taglineColor: string;
  /** Alt ipucu yazı rengi (rgba) */
  hintColor: string;
  /** Zarf iç cebi gradyanı (kapak açılınca görünür) */
  interiorBg: string;
  /** Zarf üzerinde açılış glow'u (CSS background) */
  envelopeGlow: string;
  /** Tam ekran flash gradyanı (siteye geçişte ekranı sarar) */
  screenFlash: string;
};
