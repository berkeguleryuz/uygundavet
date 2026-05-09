"use client";

import { LiningPattern } from "./WeddingEnvelope";

/**
 * Editor canvas'ında zarfın AÇIK halini statik gösterir. Asıl
 * WeddingEnvelope kapalı başlıyor, kullanıcı kapak rengi / iç astar /
 * desen değiştirirken animasyonu beklemek zorunda kalmasın diye
 * burada zarfın 5 görsel öğesini de gözle görünür şekilde sunuyoruz:
 *   1. Kalkmış kapak (üstte, ters üçgen, iç astar deseni görünür)
 *   2. Kapak kağıt rengi kenarı
 *   3. Zarf gövde rengi (alt cep üçgenleri + arka plan)
 *   4. İç astar arka plan rengi (V-cep içi)
 *   5. İç astar deseni
 * Yalnızca editor'da render ediliyor.
 */
export function EnvelopeBackPreview({
  envelopeColor = "#f5eedb",
  flapColor,
  liningBg = "#1f1c17",
  liningPattern = "daisy",
  width = 360,
}: {
  envelopeColor?: string;
  flapColor?: string;
  liningBg?: string;
  liningPattern?:
    | "daisy"
    | "rose"
    | "gold"
    | "none"
    | "chevron"
    | "floral"
    | "leaves"
    | "waves"
    | "damask";
  width?: number;
}) {
  // Envelope ve "kalkmış kapak" yükseklikleri. Kapak gerçekte zarfın
  // üst yarısı kadar (h/2), açık halde tepe noktası yukarıda olacak
  // şekilde hayali olarak ters çevrilir; ama statik göstergede kapak
  // alanını zarfın hemen üstünde, yarı yüksekliğinde, ucu yukarıyı
  // gösteren üçgen şeklinde ayrı bir kutuda sunuyoruz.
  const envHeight = Math.round(width * 0.62);
  const flapHeight = Math.round(envHeight / 2) + 18;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Açık Hali Önizlemesi
      </div>
      <div
        className="relative"
        style={{ width, height: envHeight + flapHeight + 6 }}
      >
        {/* ── KALKMIŞ KAPAK (üstte, ters üçgen — apex yukarıda) ──
              Kapak açıldığında alt yüzü görünür: iç astar deseni +
              rengi. Etrafında ince bir kenar = kapak kağıdı rengi. */}
        <div
          className="absolute"
          style={{
            top: 0,
            left: 0,
            right: 0,
            height: flapHeight,
          }}
        >
          {/* Kapak kağıt kenarı (flapColor): üçgen, hafif gölgeli */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: flapColor ?? envelopeColor,
              clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
              filter: "drop-shadow(0 -2px 4px rgba(0,0,0,0.15))",
            }}
          />
          {/* İç astar (lining) — kapak kağıdından biraz içeride, daha
              küçük üçgen, böylece kenarda kapak rengi şeridi kalır */}
          <div
            className="absolute overflow-hidden"
            style={{
              top: 4,
              left: 6,
              right: 6,
              bottom: 0,
              backgroundColor: liningBg,
              clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
            }}
          >
            <LiningPattern kind={liningPattern} />
          </div>
        </div>

        {/* ── ZARF GÖVDESİ (altta) ── */}
        <div
          className="absolute overflow-hidden rounded"
          style={{
            top: flapHeight + 6,
            left: 0,
            right: 0,
            height: envHeight,
            backgroundColor: envelopeColor,
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 5px)",
            boxShadow:
              "0 8px 24px -8px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(0,0,0,0.05)",
          }}
        >
          {/* Üst V-cep: iç astar deseni görünür */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              clipPath: "polygon(50% 50%, 100% 0, 0 0)",
              backgroundColor: liningBg,
              boxShadow: "inset 0 6px 14px rgba(0,0,0,0.2)",
            }}
          >
            <LiningPattern kind={liningPattern} />
          </div>
          {/* Sol cep üçgeni */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: envelopeColor,
              clipPath: "polygon(0 0, 50% 50%, 0 100%)",
            }}
          />
          {/* Sağ cep üçgeni */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: envelopeColor,
              clipPath: "polygon(100% 0, 100% 100%, 50% 50%)",
            }}
          />
          {/* Alt cep üçgeni */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: envelopeColor,
              clipPath: "polygon(0 100%, 50% 50%, 100% 100%)",
            }}
          />
          {/* V-seam çizgileri */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path
              d="M 0 0 L 50 50 L 100 0 M 0 100 L 50 50 L 100 100"
              stroke="rgba(0,0,0,0.14)"
              strokeWidth="0.25"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground/80 text-center max-w-[320px]">
        Kapağı, kapak rengini, iç astar rengini ve desenini düzenlerken
        bu önizlemeden anlık takip edebilirsin.
      </div>
    </div>
  );
}
