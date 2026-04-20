// reels-scenes.jsx — Uygun Davet Reels (9:16, 1080×1920, ~30s)
// Email tasarımının animasyonlu Reels versiyonu.
//
//   0.0 – 3.5   INTRO       — logo lockup
//   3.5 – 8.0   HERO        — golden video + hero headline
//   8.0 – 13.0  TEMALAR     — 8 tema grid
//  13.0 – 18.0  ÖZELLİKLER  — 6 numaralı özellik
//  18.0 – 23.0  TELEFON     — sinematik invite (Zeynep & Can)
//  23.0 – 27.0  PAKETLER    — 3 fiyatlandırma kartı
//  27.0 – 30.0  TESTIMONIAL — Ayşe & Emre alıntısı
//  30.0 – 34.0  CTA OUTRO   — logo + davetiyenizi hazırlayın

const UD = {
  bg:      '#252224',
  fg:      '#f5f6f3',
  accent:  '#d5d1ad',
  muted:   'rgba(245,246,243,0.55)',
  border:  'rgba(245,246,243,0.10)',
  card:    '#2d2a2c',
  card2:   '#1c1a1c',
  black:   '#000',
};

const UF = {
  chakra:   '"Chakra Petch", ui-sans-serif, system-ui, sans-serif',
  merienda: '"Merienda", ui-serif, serif',
  sans:     '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
  mono:     '"JetBrains Mono", ui-monospace, monospace',
};

const THEMES = [
  { key: 'grow',    name: 'Grow',    src: 'media/grow.png',    isImg: true  },
  { key: 'pearl',   name: 'Pearl',   src: 'media/pearl.mp4',   isImg: false },
  { key: 'rose',    name: 'Rose',    src: 'media/rose.mp4',    isImg: false },
  { key: 'sunset',  name: 'Sunset',  src: 'media/sunset.mp4',  isImg: false },
  { key: 'crystal', name: 'Crystal', src: 'media/crystal.png', isImg: true  },
  { key: 'garden',  name: 'Garden',  src: 'media/garden.mp4',  isImg: false },
  { key: 'ocean',   name: 'Ocean',   src: 'media/ocean.mp4',   isImg: false },
  { key: 'golden',  name: 'Golden',  src: 'media/golden.mp4',  isImg: false },
];

// ── Low-level building blocks ─────────────────────────────────────────────

// Video element — plays inline, loops, muted (required for autoplay in modern browsers)
function Video({ src, style }) {
  return React.createElement('video', {
    src,
    autoPlay: true,
    loop: true,
    muted: true,
    playsInline: true,
    style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style },
  });
}

// Fade + slide helper, returns { opacity, translateY } for entry/exit windows
function useFade({ entryDur = 0.5, exitDur = 0.4, slide = 24 } = {}) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - exitDur);
  let opacity = 1;
  let ty = 0;
  if (localTime < entryDur) {
    const t = Easing.easeOutCubic(clamp(localTime / entryDur, 0, 1));
    opacity = t;
    ty = (1 - t) * slide;
  } else if (localTime > exitStart) {
    const t = Easing.easeInCubic(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t;
    ty = -t * (slide * 0.6);
  }
  return { opacity, ty };
}

// Grain overlay
function Grain({ opacity = 0.5 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
      backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
      backgroundSize: '3px 3px',
      opacity,
    }}/>
  );
}

// Bottom-left brand lockup (small — used on most scenes)
function BrandCorner({ show = true }) {
  if (!show) return null;
  return (
    <div style={{
      position: 'absolute', left: 48, bottom: 56, zIndex: 10,
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <img src="media/logo.png" alt="" style={{ width: 44, height: 44, objectFit: 'contain',
        filter: 'drop-shadow(0 0 10px rgba(213,209,173,0.5))' }}/>
      <div style={{
        fontFamily: UF.chakra, fontWeight: 600,
        fontSize: 16, letterSpacing: '0.22em', textTransform: 'uppercase',
        color: UD.fg,
      }}>UYGUN DAVET</div>
    </div>
  );
}

// Top-right scene-counter badge
function SceneBadge({ num, total = 8, label }) {
  return (
    <div style={{
      position: 'absolute', top: 60, right: 48, zIndex: 10,
      display: 'flex', alignItems: 'center', gap: 10,
      fontFamily: UF.mono, fontSize: 13, letterSpacing: '0.2em',
      color: UD.muted, textTransform: 'uppercase',
      padding: '10px 16px',
      border: `1px solid ${UD.border}`,
      borderRadius: 999,
      background: 'rgba(28,26,28,0.55)',
      backdropFilter: 'blur(8px)',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: UD.accent }}/>
      <span>{String(num).padStart(2,'0')} / {String(total).padStart(2,'0')}</span>
      <span style={{ width: 16, height: 1, background: UD.border }}/>
      <span style={{ color: UD.fg }}>{label}</span>
    </div>
  );
}

// Section kicker — small accent label with horizontal rule
function Kicker({ children, style }) {
  return (
    <div style={{
      fontFamily: UF.chakra,
      fontSize: 15, letterSpacing: '0.34em', textTransform: 'uppercase',
      color: UD.accent,
      display: 'inline-flex', alignItems: 'center', gap: 14,
      ...style,
    }}>
      <span style={{ width: 36, height: 1, background: UD.accent }}/>
      <span>{children}</span>
    </div>
  );
}

// ── Scene 1 — INTRO / logo lockup ─────────────────────────────────────────
function SceneIntro() {
  const { localTime, duration } = useSprite();
  const progress = clamp(localTime / duration, 0, 1);
  // logo pulse scale
  const logoScale = 0.82 + Easing.easeOutBack(clamp(localTime / 0.9, 0, 1)) * 0.18;
  const logoOp    = clamp(localTime / 0.6, 0, 1);

  const textOp = clamp((localTime - 0.9) / 0.6, 0, 1);
  const textTy = (1 - textOp) * 22;

  const kickerOp = clamp((localTime - 1.6) / 0.5, 0, 1);

  // fade out last 0.5
  const fadeOut = localTime > duration - 0.5
    ? 1 - clamp((localTime - (duration - 0.5)) / 0.5, 0, 1) : 1;

  return (
    <div style={{ position: 'absolute', inset: 0, background: UD.bg, overflow: 'hidden',
      opacity: fadeOut }}>
      {/* subtle radial glow */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at 50% 40%, rgba(213,209,173,0.18), transparent 55%)',
      }}/>
      <Grain opacity={0.6}/>

      {/* center column */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 32,
      }}>
        <img src="media/logo.png" alt="Uygun Davet"
          style={{
            width: 360, height: 360, objectFit: 'contain',
            opacity: logoOp,
            transform: `scale(${logoScale})`,
            filter: 'drop-shadow(0 0 48px rgba(213,209,173,0.55))',
          }}/>
        <img src="media/brand-text.png" alt="Uygun Davet"
          style={{
            width: 520, height: 'auto', display: 'block',
            opacity: textOp,
            transform: `translateY(${textTy}px)`,
            filter: 'drop-shadow(0 0 12px rgba(213,209,173,0.35))',
          }}/>
        <div style={{
          marginTop: 12,
          fontFamily: UF.chakra, fontSize: 22,
          letterSpacing: '0.38em', textTransform: 'uppercase',
          color: UD.muted, opacity: kickerOp,
        }}>
          2026 Sezon Koleksiyonu
        </div>
        <div style={{
          marginTop: 6,
          fontFamily: UF.merienda, fontStyle: 'italic',
          fontSize: 28, color: UD.accent, opacity: kickerOp,
        }}>
          dijital düğün davetiyesi
        </div>
      </div>

      {/* corner marks */}
      <div style={{
        position: 'absolute', top: 56, left: 48,
        fontFamily: UF.mono, fontSize: 14, letterSpacing: '0.28em',
        color: UD.muted, textTransform: 'uppercase',
        opacity: kickerOp,
      }}>UD / 2026</div>
      <div style={{
        position: 'absolute', top: 56, right: 48,
        fontFamily: UF.mono, fontSize: 14, letterSpacing: '0.28em',
        color: UD.muted, textTransform: 'uppercase',
        opacity: kickerOp,
      }}>REEL · 00</div>
      <div style={{
        position: 'absolute', bottom: 56, left: 0, right: 0,
        textAlign: 'center',
        fontFamily: UF.mono, fontSize: 14, letterSpacing: '0.28em',
        color: UD.muted, textTransform: 'uppercase',
        opacity: kickerOp,
      }}>uygundavet.com</div>
    </div>
  );
}

// ── Scene 2 — HERO / golden video + headline ──────────────────────────────
function SceneHero() {
  const { localTime, duration } = useSprite();

  // Ken-burns on bg
  const kb = 1.02 + (localTime / duration) * 0.06;

  // Kicker, headline, ring, subhead staggered entries
  const kickerOp = clamp((localTime - 0.2) / 0.45, 0, 1);

  const h1Op = clamp((localTime - 0.55) / 0.6, 0, 1);
  const h1Ty = (1 - Easing.easeOutCubic(h1Op)) * 34;

  const h2Op = clamp((localTime - 1.0) / 0.6, 0, 1);
  const h2Ty = (1 - Easing.easeOutCubic(h2Op)) * 30;

  const subOp = clamp((localTime - 1.6) / 0.6, 0, 1);

  const ringOp = clamp((localTime - 0.35) / 0.6, 0, 1);
  const ringPulse = 1 + 0.06 * Math.sin(localTime * 2.4);

  const fadeOut = localTime > duration - 0.55
    ? 1 - clamp((localTime - (duration - 0.55)) / 0.55, 0, 1) : 1;

  return (
    <div style={{ position: 'absolute', inset: 0, background: UD.black, overflow: 'hidden',
      opacity: fadeOut }}>
      {/* video bg, ken burns */}
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${kb})`, transformOrigin: 'center' }}>
        <Video src="media/golden.mp4"/>
      </div>
      {/* radial warm glow */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at 72% 28%, rgba(213,209,173,0.32), transparent 55%)',
        mixBlendMode: 'screen',
      }}/>
      {/* top-down gradient for text legibility */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(180deg, rgba(37,34,36,0.15) 0%, rgba(37,34,36,0.25) 45%, rgba(37,34,36,0.95) 100%)',
      }}/>
      <Grain/>

      {/* ring logo top-right */}
      <img src="media/logo.png" alt=""
        style={{
          position: 'absolute', top: 120, right: 64,
          width: 200, height: 200, objectFit: 'contain', zIndex: 4,
          opacity: ringOp,
          transform: `scale(${ringPulse})`,
          filter: 'drop-shadow(0 0 40px rgba(213,209,173,0.75))',
        }}/>

      {/* corner labels */}
      <div style={{
        position: 'absolute', top: 64, left: 56, zIndex: 4,
        fontFamily: UF.mono, fontSize: 15, letterSpacing: '0.24em',
        color: UD.muted, textTransform: 'uppercase',
        opacity: kickerOp,
      }}>UD / 2026 · Golden Sezon</div>

      <div style={{
        position: 'absolute', top: 340, right: 64, zIndex: 4,
        fontFamily: UF.mono, fontSize: 14, letterSpacing: '0.24em',
        color: UD.muted, textTransform: 'uppercase',
        opacity: ringOp, textAlign: 'right',
      }}>
        Ref <b style={{ color: UD.accent, fontWeight: 400 }}>UD—26—GLD</b>
      </div>

      {/* bottom headline block */}
      <div style={{
        position: 'absolute', left: 56, right: 56, bottom: 180, zIndex: 4,
      }}>
        <div style={{ opacity: kickerOp, marginBottom: 34 }}>
          <Kicker>2026 Sezon Koleksiyonu</Kicker>
        </div>

        <div style={{ opacity: h1Op, transform: `translateY(${h1Ty}px)` }}>
          <div style={{
            fontFamily: UF.chakra, fontWeight: 500,
            fontSize: 128, lineHeight: 0.92,
            letterSpacing: '-0.03em', textTransform: 'uppercase',
            color: UD.fg, margin: 0,
          }}>Bir hayat</div>
        </div>
        <div style={{ opacity: h1Op, transform: `translateY(${h1Ty}px)` }}>
          <div style={{
            fontFamily: UF.chakra, fontWeight: 500,
            fontSize: 128, lineHeight: 0.92,
            letterSpacing: '-0.03em', textTransform: 'uppercase',
            color: UD.fg, margin: 0,
          }}>boyu sürecek</div>
        </div>
        <div style={{ opacity: h2Op, transform: `translateY(${h2Ty}px)`, marginTop: 6 }}>
          <div style={{
            fontFamily: UF.merienda, fontWeight: 400, fontStyle: 'italic',
            fontSize: 116, lineHeight: 0.96,
            color: UD.accent, margin: 0,
          }}>ilk izlenim.</div>
        </div>

        <div style={{
          marginTop: 36, maxWidth: 820,
          fontFamily: UF.sans, fontSize: 26, lineHeight: 1.55,
          color: 'rgba(245,246,243,0.82)',
          opacity: subOp,
        }}>
          Kağıda, zarfa, postaya gerek yok. Düğününüz kelimesi kelimesine, zamanında, herkese ulaşır.
        </div>
      </div>
      <BrandCorner show={false}/>
      <SceneBadge num={1} label="Hero"/>
    </div>
  );
}

// ── Scene 3 — TEMALAR / 8 tema grid ───────────────────────────────────────
function SceneThemes() {
  const { localTime, duration } = useSprite();

  const titleOp = clamp((localTime - 0.15) / 0.55, 0, 1);
  const titleTy = (1 - Easing.easeOutCubic(titleOp)) * 28;

  const fadeOut = localTime > duration - 0.5
    ? 1 - clamp((localTime - (duration - 0.5)) / 0.5, 0, 1) : 1;

  return (
    <div style={{ position: 'absolute', inset: 0, background: UD.bg, overflow: 'hidden',
      opacity: fadeOut }}>
      {/* title block */}
      <div style={{
        position: 'absolute', top: 170, left: 56, right: 56, zIndex: 3,
        opacity: titleOp, transform: `translateY(${titleTy}px)`,
      }}>
        <Kicker style={{ marginBottom: 28 }}>◆ Koleksiyon</Kicker>
        <div style={{
          fontFamily: UF.chakra, fontWeight: 500,
          fontSize: 104, lineHeight: 0.95,
          letterSpacing: '-0.02em', textTransform: 'uppercase',
          color: UD.fg, margin: 0,
        }}>
          Sekiz tema,
        </div>
        <div style={{
          fontFamily: UF.merienda, fontStyle: 'italic', fontWeight: 400,
          fontSize: 96, lineHeight: 1,
          color: UD.accent,
        }}>
          bir düğün.
        </div>
      </div>

      {/* grid 4×2 */}
      <div style={{
        position: 'absolute', left: 56, right: 56, top: 640, bottom: 180,
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18,
        zIndex: 2,
      }}>
        {THEMES.map((th, i) => {
          const delay = 0.5 + i * 0.12;
          const p = clamp((localTime - delay) / 0.55, 0, 1);
          const eased = Easing.easeOutCubic(p);
          return (
            <div key={th.key} style={{
              position: 'relative',
              borderRadius: 18, overflow: 'hidden',
              background: UD.black,
              border: `1px solid ${UD.border}`,
              opacity: eased,
              transform: `translateY(${(1 - eased) * 48}px) scale(${0.92 + 0.08 * eased})`,
              aspectRatio: '3 / 4',
            }}>
              {th.isImg
                ? <img src={th.src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                : <Video src={th.src}/>
              }
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.85) 100%)',
              }}/>
              <div style={{
                position: 'absolute', left: 14, right: 14, bottom: 16,
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              }}>
                <span style={{
                  fontFamily: UF.chakra, fontWeight: 600,
                  fontSize: 22, letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: UD.fg,
                }}>{th.name}</span>
                <span style={{
                  fontFamily: UF.mono, fontSize: 14,
                  letterSpacing: '0.24em', color: UD.accent,
                }}>{String(i+1).padStart(2,'0')}</span>
              </div>
            </div>
          );
        })}
      </div>

      <Grain opacity={0.35}/>
      <BrandCorner/>
      <SceneBadge num={2} label="Temalar"/>
    </div>
  );
}

// ── Scene 4 — ÖZELLİKLER ──────────────────────────────────────────────────
const FEATURES = [
  { n: '01', title: 'LCV Sistemi',       desc: 'Katılım durumlarını anlık takip edin.',           tag: 'Canlı' },
  { n: '02', title: 'Anı Defteri',       desc: 'Misafir mesajlarını ve anılarını biriktirin.',    tag: 'Mesaj' },
  { n: '03', title: 'QR Kod',            desc: 'Fizikselden dijitale köprü kuran QR kodlar.',     tag: 'Hibrit' },
  { n: '04', title: 'Misafir Yönetimi',  desc: 'Liste, oturma planı ve detaylı raporlar.',        tag: 'Panel' },
  { n: '05', title: 'Kolay Paylaşım',    desc: 'WhatsApp, SMS ve sosyal medyadan tek tıkla.',     tag: 'Tek tık' },
  { n: '06', title: 'Çoklu Dil',         desc: 'TR, EN, DE — yurt dışı misafirler için ideal.',   tag: 'TR·EN·DE' },
];

function SceneFeatures() {
  const { localTime, duration } = useSprite();
  const titleOp = clamp((localTime - 0.15) / 0.5, 0, 1);
  const titleTy = (1 - Easing.easeOutCubic(titleOp)) * 26;
  const fadeOut = localTime > duration - 0.5
    ? 1 - clamp((localTime - (duration - 0.5)) / 0.5, 0, 1) : 1;

  return (
    <div style={{ position: 'absolute', inset: 0, background: UD.bg, overflow: 'hidden',
      opacity: fadeOut }}>
      <Grain opacity={0.3}/>
      <div style={{
        position: 'absolute', top: 170, left: 56, right: 56, zIndex: 3,
        opacity: titleOp, transform: `translateY(${titleTy}px)`,
      }}>
        <Kicker style={{ marginBottom: 28 }}>◆ Özellikler</Kicker>
        <div style={{
          fontFamily: UF.chakra, fontWeight: 500,
          fontSize: 92, lineHeight: 0.95,
          letterSpacing: '-0.02em', textTransform: 'uppercase',
          color: UD.fg,
        }}>Her detay</div>
        <div style={{
          fontFamily: UF.merienda, fontStyle: 'italic', fontWeight: 400,
          fontSize: 84, lineHeight: 1,
          color: UD.accent,
        }}>yerinde.</div>
      </div>

      <div style={{
        position: 'absolute', left: 56, right: 56, top: 600, zIndex: 3,
        display: 'flex', flexDirection: 'column',
      }}>
        {FEATURES.map((f, i) => {
          const delay = 0.55 + i * 0.18;
          const p = clamp((localTime - delay) / 0.55, 0, 1);
          const eased = Easing.easeOutCubic(p);
          const exit = localTime > duration - 0.45 ? 1 - clamp((localTime - (duration - 0.45)) / 0.45, 0, 1) : 1;
          return (
            <div key={f.n} style={{
              display: 'grid', gridTemplateColumns: '100px 1fr auto',
              gap: 28, alignItems: 'center',
              padding: '26px 6px',
              borderTop: i === 0 ? `1px solid ${UD.border}` : 'none',
              borderBottom: `1px solid ${UD.border}`,
              opacity: eased * exit,
              transform: `translateX(${(1 - eased) * -32}px)`,
            }}>
              <div style={{
                fontFamily: UF.chakra, fontWeight: 500,
                fontSize: 54, letterSpacing: '-0.02em', color: UD.accent,
                lineHeight: 1,
              }}>{f.n}</div>
              <div>
                <div style={{
                  fontFamily: UF.chakra, fontWeight: 600,
                  fontSize: 30, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: UD.fg, marginBottom: 6,
                }}>{f.title}</div>
                <div style={{
                  fontFamily: UF.sans, fontSize: 22, lineHeight: 1.45,
                  color: 'rgba(245,246,243,0.7)',
                }}>{f.desc}</div>
              </div>
              <div style={{
                fontFamily: UF.mono, fontSize: 14,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: UD.accent,
                padding: '10px 16px',
                border: `1px solid rgba(213,209,173,0.30)`,
                borderRadius: 999,
              }}>{f.tag}</div>
            </div>
          );
        })}
      </div>

      <BrandCorner/>
      <SceneBadge num={3} label="Özellikler"/>
    </div>
  );
}

// ── Scene 5 — TELEFON / invite preview ───────────────────────────────────
function ScenePhone() {
  const { localTime, duration } = useSprite();

  const bgOp = clamp(localTime / 0.5, 0, 1);
  const phoneOp = clamp((localTime - 0.35) / 0.55, 0, 1);
  const phoneScale = 0.86 + Easing.easeOutBack(clamp((localTime - 0.35) / 0.7, 0, 1)) * 0.14;

  const copyOp = clamp((localTime - 0.85) / 0.5, 0, 1);
  const copyTy = (1 - Easing.easeOutCubic(copyOp)) * 26;

  const fadeOut = localTime > duration - 0.5
    ? 1 - clamp((localTime - (duration - 0.5)) / 0.5, 0, 1) : 1;

  return (
    <div style={{ position: 'absolute', inset: 0, background: UD.black, overflow: 'hidden',
      opacity: fadeOut }}>
      {/* soft blurred bg */}
      <div style={{ position: 'absolute', inset: 0, opacity: bgOp,
        filter: 'blur(24px) brightness(0.55) saturate(1.1)',
        transform: 'scale(1.15)',
      }}>
        <Video src="media/rose.mp4"/>
      </div>
      <div style={{ position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(37,34,36,0.45), rgba(37,34,36,0.85))',
        zIndex: 1,
      }}/>
      <Grain opacity={0.4}/>

      {/* top copy */}
      <div style={{
        position: 'absolute', left: 56, right: 56, top: 170, zIndex: 3,
        opacity: copyOp, transform: `translateY(${copyTy}px)`,
      }}>
        <Kicker style={{ marginBottom: 26 }}>◆ Telefonda canlı</Kicker>
        <div style={{
          fontFamily: UF.chakra, fontWeight: 500,
          fontSize: 82, lineHeight: 0.96,
          letterSpacing: '-0.02em', textTransform: 'uppercase',
          color: UD.fg,
        }}>Misafirin avucunda,</div>
        <div style={{
          fontFamily: UF.merienda, fontStyle: 'italic', fontWeight: 400,
          fontSize: 76, lineHeight: 1,
          color: UD.accent,
        }}>sinema salonu gibi.</div>
      </div>

      {/* phone — centered */}
      <div style={{
        position: 'absolute', left: '50%', top: 700, zIndex: 3,
        width: 520, height: 1060,
        transform: `translateX(-50%) scale(${phoneScale})`,
        transformOrigin: 'center top',
        opacity: phoneOp,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: '#0a0809',
          borderRadius: 72,
          padding: 20,
          border: '1px solid #2a2628',
          boxShadow: '0 60px 140px -30px rgba(0,0,0,0.9), 0 0 0 2px rgba(213,209,173,0.10)',
        }}>
          {/* notch */}
          <div style={{
            position: 'absolute', top: 36, left: '50%', transform: 'translateX(-50%)',
            width: 180, height: 46, borderRadius: 999, background: '#0a0809',
            zIndex: 5,
          }}/>
          {/* screen */}
          <div style={{
            position: 'relative', width: '100%', height: '100%',
            borderRadius: 56, overflow: 'hidden', background: UD.black,
          }}>
            <Video src="media/garden.mp4"/>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 22%, transparent 55%, rgba(0,0,0,0.94) 100%)',
            }}/>
            {/* UI overlay */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 3,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '100px 30px 56px',
              color: UD.fg,
            }}>
              <div style={{
                textAlign: 'center', fontFamily: UF.chakra,
                fontSize: 18, letterSpacing: '0.32em', textTransform: 'uppercase',
                color: 'rgba(245,246,243,0.75)',
              }}>2026 · Davetiyeniz</div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: UF.chakra, fontSize: 16,
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                  color: UD.accent, marginBottom: 16,
                }}>Sevgiyle davetlisiniz</div>
                <div style={{
                  fontFamily: UF.merienda, fontStyle: 'italic', fontWeight: 400,
                  fontSize: 68, lineHeight: 1.05, color: UD.fg,
                }}>
                  Zeynep
                  <span style={{ color: UD.accent, fontSize: 52, display: 'block', margin: '2px 0' }}>&amp;</span>
                  Can
                </div>
                <div style={{
                  marginTop: 24,
                  fontFamily: UF.chakra, fontSize: 18,
                  letterSpacing: '0.3em', color: 'rgba(245,246,243,0.78)',
                }}>14 HAZİRAN 2026 · 19:00</div>
              </div>

              <div style={{
                textAlign: 'center',
                fontFamily: UF.chakra, fontSize: 18, fontWeight: 600,
                letterSpacing: '0.26em', textTransform: 'uppercase',
                padding: '22px 0',
                background: 'rgba(245,246,243,0.92)', color: '#000',
                borderRadius: 999,
              }}>Cevabınızı bırakın</div>
            </div>
          </div>
        </div>
      </div>

      {/* side chip list */}
      <div style={{
        position: 'absolute', bottom: 210, left: 0, right: 0, zIndex: 3,
        display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap',
        padding: '0 56px',
        opacity: copyOp,
      }}>
        {['iOS','Android','WhatsApp','Mail','QR'].map((chip) => (
          <span key={chip} style={{
            fontFamily: UF.mono, fontSize: 16,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: UD.fg,
            padding: '10px 18px',
            border: `1px solid ${UD.border}`, borderRadius: 999,
            background: 'rgba(28,26,28,0.55)', backdropFilter: 'blur(4px)',
          }}>{chip}</span>
        ))}
      </div>

      <BrandCorner/>
      <SceneBadge num={4} label="Telefon"/>
    </div>
  );
}

// ── Scene 6 — PAKETLER ────────────────────────────────────────────────────
const PACKAGES = [
  { name: 'Başlangıç', sub: 'sade ve yeterli', price: '7.499', feats: ['Düğün web sitesi','Online LCV formu','Dijital davetiye','Konum ve yol tarifi'] },
  { name: 'Pro',       sub: 'eksiksiz deneyim', price: '12.999', featured: true, feats: ['Anı defteri','Fotoğraf galerisi','Çoklu dil: TR·EN·DE','Başlangıç paketi dahil'] },
  { name: 'Elit',      sub: 'dijital ve fiziksel', price: '14.999', feats: ['100 basılı davetiye','25 QR sticker','Özel domain','Pro paketi dahil'] },
];

function ScenePackages() {
  const { localTime, duration } = useSprite();
  const titleOp = clamp((localTime - 0.15) / 0.5, 0, 1);
  const titleTy = (1 - Easing.easeOutCubic(titleOp)) * 26;
  const fadeOut = localTime > duration - 0.5
    ? 1 - clamp((localTime - (duration - 0.5)) / 0.5, 0, 1) : 1;

  return (
    <div style={{ position: 'absolute', inset: 0, background: UD.bg, overflow: 'hidden',
      opacity: fadeOut }}>
      <Grain opacity={0.3}/>
      <div style={{
        position: 'absolute', top: 170, left: 56, right: 56, zIndex: 3,
        opacity: titleOp, transform: `translateY(${titleTy}px)`,
      }}>
        <Kicker style={{ marginBottom: 28 }}>◆ Fiyatlandırma</Kicker>
        <div style={{
          fontFamily: UF.chakra, fontWeight: 500,
          fontSize: 96, lineHeight: 0.94,
          letterSpacing: '-0.02em', textTransform: 'uppercase',
          color: UD.fg,
        }}>Üç paket,</div>
        <div style={{
          fontFamily: UF.merienda, fontStyle: 'italic', fontWeight: 400,
          fontSize: 86, lineHeight: 1,
          color: UD.accent,
        }}>size uygun.</div>
      </div>

      <div style={{
        position: 'absolute', left: 48, right: 48, top: 620, bottom: 200,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, zIndex: 3,
      }}>
        {PACKAGES.map((pkg, i) => {
          const delay = 0.55 + i * 0.18;
          const p = clamp((localTime - delay) / 0.55, 0, 1);
          const eased = Easing.easeOutCubic(p);
          return (
            <div key={pkg.name} style={{
              position: 'relative',
              border: pkg.featured ? '1px solid rgba(213,209,173,0.5)' : `1px solid ${UD.border}`,
              borderRadius: 20,
              padding: '36px 24px 28px',
              background: pkg.featured
                ? 'linear-gradient(180deg, rgba(213,209,173,0.10), rgba(213,209,173,0.01))'
                : 'linear-gradient(180deg, rgba(213,209,173,0.02), transparent)',
              boxShadow: pkg.featured ? 'inset 0 0 50px rgba(213,209,173,0.06)' : 'none',
              opacity: eased,
              transform: `translateY(${(1 - eased) * 40}px) scale(${0.95 + 0.05 * eased})`,
              display: 'flex', flexDirection: 'column',
            }}>
              {pkg.featured && (
                <div style={{
                  position: 'absolute', top: -1, right: 24,
                  fontFamily: UF.chakra, fontSize: 13,
                  letterSpacing: '0.24em', textTransform: 'uppercase',
                  color: '#000', background: UD.accent,
                  padding: '8px 14px',
                  borderRadius: '0 0 8px 8px', fontWeight: 600,
                }}>Önerilen</div>
              )}
              <div style={{
                fontFamily: UF.chakra, fontWeight: 600,
                fontSize: 22, letterSpacing: '0.22em', textTransform: 'uppercase',
                color: UD.fg,
              }}>{pkg.name}</div>
              <div style={{
                fontFamily: UF.merienda, fontStyle: 'italic', fontSize: 22,
                color: UD.accent, marginBottom: 22,
              }}>{pkg.sub}</div>

              <div style={{
                display: 'flex', alignItems: 'baseline', gap: 6,
                paddingBottom: 18, marginBottom: 18,
                borderBottom: `1px dashed ${UD.border}`,
              }}>
                <span style={{
                  fontFamily: UF.chakra, fontWeight: 500,
                  fontSize: 62, letterSpacing: '-0.02em',
                  color: UD.fg, lineHeight: 1,
                }}>{pkg.price}</span>
                <span style={{
                  fontFamily: UF.chakra, fontSize: 30, color: UD.accent,
                }}>₺</span>
              </div>

              <ul style={{
                listStyle: 'none', padding: 0, margin: 0,
                fontFamily: UF.sans, fontSize: 18, lineHeight: 1.55,
                color: 'rgba(245,246,243,0.75)',
              }}>
                {pkg.feats.map((ft) => (
                  <li key={ft} style={{ padding: '6px 0', display: 'flex', gap: 10 }}>
                    <span style={{ color: UD.accent, fontFamily: UF.chakra, fontWeight: 600 }}>+</span>
                    {ft}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <BrandCorner/>
      <SceneBadge num={5} label="Paketler"/>
    </div>
  );
}

// ── Scene 7 — TESTIMONIAL ────────────────────────────────────────────────
function SceneQuote() {
  const { localTime, duration } = useSprite();
  const bgOp = clamp(localTime / 0.55, 0, 1);
  const mOp = clamp((localTime - 0.35) / 0.4, 0, 1);
  const qOp = clamp((localTime - 0.7) / 0.55, 0, 1);
  const byOp = clamp((localTime - 1.5) / 0.5, 0, 1);
  const statsOp = clamp((localTime - 1.9) / 0.5, 0, 1);
  const fadeOut = localTime > duration - 0.5
    ? 1 - clamp((localTime - (duration - 0.5)) / 0.5, 0, 1) : 1;

  return (
    <div style={{ position: 'absolute', inset: 0, background: UD.bg, overflow: 'hidden',
      opacity: fadeOut }}>
      {/* decorative blurred video */}
      <div style={{ position: 'absolute', inset: 0, opacity: bgOp * 0.45,
        filter: 'blur(30px) brightness(0.5)',
      }}>
        <Video src="media/pearl.mp4"/>
      </div>
      <div style={{ position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(37,34,36,0.7), rgba(37,34,36,0.95))', zIndex: 1 }}/>
      <Grain opacity={0.35}/>

      {/* big quote */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '0 72px',
      }}>
        <div style={{
          fontFamily: UF.merienda, fontSize: 220, lineHeight: 0,
          color: UD.accent, marginBottom: 56,
          opacity: mOp, transform: `translateY(${(1-mOp)*12}px)`,
        }}>“</div>

        <p style={{
          fontFamily: UF.merienda, fontStyle: 'italic', fontWeight: 400,
          fontSize: 62, lineHeight: 1.3,
          color: UD.fg, margin: 0, textAlign: 'center', maxWidth: 900,
          opacity: qOp, transform: `translateY(${(1-qOp)*22}px)`,
        }}>
          İki gün içinde 180 misafire ulaştık. Herkes “bu şimdiye kadar gördüğüm en güzel davetiye” dedi.
        </p>

        <div style={{
          marginTop: 48,
          fontFamily: UF.chakra, fontSize: 20,
          letterSpacing: '0.32em', textTransform: 'uppercase',
          color: UD.muted, opacity: byOp,
        }}>
          Ayşe &amp; Emre · Eylül 2025
        </div>
      </div>

      {/* stats strip */}
      <div style={{
        position: 'absolute', left: 56, right: 56, bottom: 200, zIndex: 3,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        borderTop: `1px solid ${UD.border}`, borderBottom: `1px solid ${UD.border}`,
        opacity: statsOp,
      }}>
        {[
          ['7.499', '₺', 'Başlangıç paketi'],
          ['3',     'adım', 'Tema · kişisel · paylaş'],
          ['TR·EN·DE', '', 'Çoklu dil desteği'],
        ].map(([k, sup, v], i) => (
          <div key={i} style={{
            padding: '34px 12px', textAlign: 'center',
            borderRight: i < 2 ? `1px solid ${UD.border}` : 'none',
          }}>
            <div style={{
              fontFamily: UF.chakra, fontWeight: 500,
              fontSize: 52, letterSpacing: '-0.02em', color: UD.fg,
            }}>
              {k}
              {sup && <span style={{ fontSize: 22, color: UD.accent, marginLeft: 6,
                verticalAlign: 'super', fontWeight: 400 }}>{sup}</span>}
            </div>
            <div style={{
              marginTop: 8,
              fontFamily: UF.chakra, fontSize: 16,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: UD.muted,
            }}>{v}</div>
          </div>
        ))}
      </div>

      <BrandCorner/>
      <SceneBadge num={6} label="Referans"/>
    </div>
  );
}

// ── Scene 8 — CTA OUTRO ──────────────────────────────────────────────────
function SceneCTA() {
  const { localTime, duration } = useSprite();

  const bgOp = clamp(localTime / 0.55, 0, 1);
  const logoOp = clamp((localTime - 0.3) / 0.5, 0, 1);
  const logoScale = 0.88 + Easing.easeOutBack(clamp((localTime - 0.3) / 0.7, 0, 1)) * 0.12;
  const txtOp = clamp((localTime - 0.8) / 0.5, 0, 1);
  const ctaOp = clamp((localTime - 1.3) / 0.5, 0, 1);
  const ctaScale = 0.94 + Easing.easeOutBack(clamp((localTime - 1.3) / 0.7, 0, 1)) * 0.06;
  const noteOp = clamp((localTime - 1.8) / 0.4, 0, 1);

  // Pulse CTA slightly
  const pulse = 1 + 0.015 * Math.sin(localTime * 3.4);

  return (
    <div style={{ position: 'absolute', inset: 0, background: UD.bg, overflow: 'hidden' }}>
      {/* soft golden bg */}
      <div style={{ position: 'absolute', inset: 0, opacity: bgOp * 0.4,
        filter: 'blur(40px) brightness(0.6)' }}>
        <Video src="media/golden.mp4"/>
      </div>
      <div style={{ position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 45%, rgba(213,209,173,0.2), transparent 55%)',
        zIndex: 1 }}/>
      <Grain opacity={0.4}/>

      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 36, padding: '0 56px',
      }}>
        <img src="media/logo.png" alt="Uygun Davet"
          style={{
            width: 280, height: 280, objectFit: 'contain',
            opacity: logoOp,
            transform: `scale(${logoScale})`,
            filter: 'drop-shadow(0 0 60px rgba(213,209,173,0.7))',
          }}/>

        <img src="media/brand-text.png" alt="Uygun Davet"
          style={{
            width: 440, height: 'auto',
            opacity: logoOp,
            filter: 'drop-shadow(0 0 14px rgba(213,209,173,0.4))',
          }}/>

        <div style={{
          opacity: txtOp, textAlign: 'center', maxWidth: 820, marginTop: 8,
        }}>
          <div style={{
            fontFamily: UF.chakra, fontWeight: 500,
            fontSize: 76, lineHeight: 0.98,
            letterSpacing: '-0.02em', textTransform: 'uppercase',
            color: UD.fg,
          }}>Sırada</div>
          <div style={{
            fontFamily: UF.merienda, fontStyle: 'italic', fontWeight: 400,
            fontSize: 72, lineHeight: 1.0,
            color: UD.accent, marginTop: 4,
          }}>sizin hikayeniz var.</div>
        </div>

        <div style={{
          opacity: ctaOp,
          transform: `scale(${ctaScale * pulse})`,
          marginTop: 16,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 22,
            background: UD.fg, color: '#000',
            padding: '30px 58px',
            borderRadius: 999,
            fontFamily: UF.chakra, fontWeight: 600,
            fontSize: 26, letterSpacing: '0.28em', textTransform: 'uppercase',
            boxShadow: '0 20px 60px -10px rgba(213,209,173,0.35)',
          }}>
            Davetiyenizi Hazırlayın
            <span style={{ fontFamily: UF.sans, fontSize: 30, letterSpacing: 0 }}>→</span>
          </div>
        </div>

        <div style={{
          marginTop: 4,
          fontFamily: UF.mono, fontSize: 18,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: UD.muted, opacity: noteOp,
        }}>
          uygundavet.com · ilk taslak ücretsiz
        </div>
      </div>

      <SceneBadge num={7} label="Başla"/>
    </div>
  );
}

// ── Scene tree (timing) ───────────────────────────────────────────────────
function ReelsSceneTree() {
  return (
    <>
      <Sprite start={0.0}  end={3.5}>  <SceneIntro/>    </Sprite>
      <Sprite start={3.5}  end={8.0}>  <SceneHero/>     </Sprite>
      <Sprite start={8.0}  end={13.0}> <SceneThemes/>   </Sprite>
      <Sprite start={13.0} end={18.0}> <SceneFeatures/> </Sprite>
      <Sprite start={18.0} end={23.0}> <ScenePhone/>    </Sprite>
      <Sprite start={23.0} end={27.0}> <ScenePackages/> </Sprite>
      <Sprite start={27.0} end={30.5}> <SceneQuote/>    </Sprite>
      <Sprite start={30.5} end={34.0}> <SceneCTA/>      </Sprite>
    </>
  );
}

Object.assign(window, {
  UD, UF, THEMES, FEATURES, PACKAGES,
  Video, useFade, Grain, BrandCorner, SceneBadge, Kicker,
  SceneIntro, SceneHero, SceneThemes, SceneFeatures,
  ScenePhone, ScenePackages, SceneQuote, SceneCTA,
  ReelsSceneTree,
});
