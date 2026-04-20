// scenes.jsx — Uygun Davet davetiye yapım süreci
// Total duration ~44s, 10 beats + intro/outro.
//
//   0.0 – 2.5   INTRO — title card
//   2.5 – 7.0   01. ARAŞTIRMA — moodboard / core message
//   7.0 – 11.0  02a. KEŞİF — theme gallery (real videos)
//   11.0 – 15.5 02b. KEŞİF — deep dive (crystal hero full-bleed)
//   15.5 – 19.5 03a. STORYBOARD — frame sketches
//   19.5 – 23.0 03b. STORYBOARD — shot list annotations
//   23.0 – 27.0 04.  İNCELEME — strategist review + APPROVED
//   27.0 – 31.0 05a. UYGULAMA — timeline / keyframes
//   31.0 – 35.5 05b. UYGULAMA — render preview (grow theme)
//   35.5 – 40.0 06.  ONAY — QC checklist + sign-off
//   40.0 – 44.0 OUTRO — brand lockup

const C = {
  ivory:    '#f5f0e6',
  cream:    '#ece4d3',
  paper:    '#faf7f0',
  ink:      '#1a1612',
  charcoal: '#2a2520',
  mute:     '#8a7f6e',
  line:     '#d8cfbc',
  gold:     '#b89968',
  goldDeep: '#8a6f43',
  rose:     '#c89a93',
  sage:     '#8a9a7a',
  navy:     '#1f2340',
};

const F = {
  serif:  '"Fraunces", "Times New Roman", serif',
  script: '"Cormorant Garamond", "Fraunces", serif',
  sans:   '"Inter", system-ui, sans-serif',
  mono:   '"JetBrains Mono", ui-monospace, monospace',
};

// themes list for reuse
const THEMES = [
  { key: 'crystal', name: 'Crystal', media: 'media/crystal.png',  isImg: true },
  { key: 'grow',    name: 'Grow',    media: 'media/grow.png',     isImg: true },
  { key: 'sunset',  name: 'Sunset',  media: 'media/sunset.mp4',   isImg: false },
  { key: 'rose',    name: 'Rose',    media: 'media/rose.mp4',     isImg: false },
  { key: 'pearl',   name: 'Pearl',   media: 'media/pearl.mp4',    isImg: false },
  { key: 'ocean',   name: 'Ocean',   media: 'media/ocean.mp4',    isImg: false },
  { key: 'golden',  name: 'Golden',  media: 'media/golden.mp4',   isImg: false },
  { key: 'garden',  name: 'Garden',  media: 'media/garden.mp4',   isImg: false },
];

// ─── Shared chrome ─────────────────────────────────────────────────────────
function Chrome({ stepNum, stepLabel, role, tone = 'light' }) {
  const textCol = tone === 'dark' ? C.cream : C.ink;
  const muteCol = tone === 'dark' ? 'rgba(236,228,211,0.6)' : C.mute;
  const lineCol = tone === 'dark' ? 'rgba(236,228,211,0.25)' : C.line;
  const badgeBg = tone === 'dark' ? 'rgba(26,22,18,0.6)' : C.paper;
  return (
    <>
      <div style={{
        position: 'absolute', top: 40, left: 48, zIndex: 5,
        fontFamily: F.mono, fontSize: 12, letterSpacing: '0.18em',
        color: muteCol, textTransform: 'uppercase',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ color: C.gold }}>●</span>
        <span>AŞAMA {stepNum}</span>
        <span style={{ width: 24, height: 1, background: lineCol }}/>
        <span>{stepLabel}</span>
      </div>
      <div style={{
        position: 'absolute', top: 40, right: 48, zIndex: 5,
        fontFamily: F.mono, fontSize: 12, letterSpacing: '0.18em',
        color: textCol, textTransform: 'uppercase',
        padding: '8px 14px', background: badgeBg,
        border: `1px solid ${lineCol}`, borderRadius: 999,
        backdropFilter: 'blur(8px)',
      }}>
        {role}
      </div>
      <div style={{
        position: 'absolute', bottom: 40, left: 48, zIndex: 5,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <img src="media/brand-text.png" alt="Uygun Davet"
          style={{
            height: 36, width: 'auto', display: 'block',
            filter: tone === 'dark' ? 'brightness(1.25)' : 'none',
          }}/>
        <span style={{
          fontFamily: F.mono, fontSize: 11, color: muteCol,
          letterSpacing: '0.22em',
        }}>· DİJİTAL DÜĞÜN DAVETİYESİ</span>
      </div>
      <div style={{
        position: 'absolute', bottom: 40, right: 48, zIndex: 5,
        fontFamily: F.mono, fontSize: 11, letterSpacing: '0.18em',
        color: muteCol,
      }}>
        UYGUN DAVET · SÜREÇ · {new Date().getFullYear()}
      </div>
    </>
  );
}

function sceneOpacity(p) {
  if (p < 0.05) return p / 0.05;
  if (p > 0.95) return (1 - p) / 0.05;
  return 1;
}

// ─── INTRO ─────────────────────────────────────────────────────────────────
function Intro() {
  const t = useTime();
  const p = clamp(t / 2.5, 0, 1);

  const line1Op = interpolate([0, 0.35], [0, 1], Easing.easeOutCubic)(p);
  const line1Y  = interpolate([0, 0.4], [24, 0], Easing.easeOutCubic)(p);
  const line2Op = interpolate([0.3, 0.55], [0, 1])(p);
  const line3Op = interpolate([0.5, 0.75], [0, 1])(p);
  const ruleW   = interpolate([0.3, 0.8], [0, 560], Easing.easeOutExpo)(p);
  const outOp   = interpolate([0.88, 1], [1, 0])(p);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `linear-gradient(180deg, ${C.ivory} 0%, ${C.cream} 100%)`,
      opacity: outOp,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Logo */}
      <div style={{
        width: 120, height: 120,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 40, opacity: line1Op,
        transform: `translateY(${line1Y}px) scale(${0.9 + line1Op * 0.1})`,
      }}>
        <img src="media/logo.png" alt="Uygun Davet"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
      </div>

      <div style={{
        fontFamily: F.mono, fontSize: 12, letterSpacing: '0.4em',
        color: C.gold, textTransform: 'uppercase',
        marginBottom: 36, opacity: line1Op,
      }}>
        VAKA ÇALIŞMASI  ·  UYGUN DAVET
      </div>

      <div style={{
        fontFamily: F.script, fontSize: 132, fontWeight: 300,
        color: C.ink, letterSpacing: '-0.03em', lineHeight: 0.95,
        textAlign: 'center',
        opacity: line1Op,
        transform: `translateY(${line1Y * 0.5}px)`,
      }}>
        <span style={{ fontStyle: 'italic' }}>Bir dijital davetiyeyi</span><br/>
        <span style={{ fontStyle: 'italic', color: C.goldDeep }}>nasıl hazırlıyoruz.</span>
      </div>

      <div style={{
        marginTop: 40,
        height: 1, width: ruleW, background: C.gold,
      }}/>

      <div style={{
        marginTop: 28,
        fontFamily: F.sans, fontSize: 18,
        color: C.mute, letterSpacing: '0.08em',
        opacity: line2Op,
      }}>
        Altı rol · Altı aşama · Tek davetiye
      </div>

      <div style={{
        position: 'absolute', bottom: 56,
        fontFamily: F.mono, fontSize: 11, letterSpacing: '0.32em',
        color: C.mute, textTransform: 'uppercase',
        opacity: line3Op,
      }}>
        ↓ OYNAT
      </div>
    </div>
  );
}

// ─── 01 · ARAŞTIRMA ────────────────────────────────────────────────────────
function Scene1() {
  const s = useSprite();
  const p = s.progress;
  const op = sceneOpacity(p);

  const notes = [
    { text: '"modern, şık"',        x: 120,  y: 220, rot: -4, in: 0.08 },
    { text: 'kişiselleştirme',      x: 420,  y: 140, rot:  2, in: 0.12 },
    { text: 'QR kod → dijital',     x: 780,  y: 200, rot: -2, in: 0.16 },
    { text: 'LCV takibi',           x: 1360, y: 260, rot:  3, in: 0.20 },
    { text: 'misafir deneyimi',     x: 200,  y: 540, rot:  1, in: 0.24 },
    { text: 'anı defteri',          x: 600,  y: 640, rot: -3, in: 0.28 },
    { text: 'WhatsApp paylaşım',    x: 1050, y: 600, rot:  2, in: 0.32 },
    { text: 'hikâye odaklı',        x: 1380, y: 540, rot: -1, in: 0.36 },
    { text: 'çoklu dil · TR/EN/DE', x: 300,  y: 360, rot: -2, in: 0.40 },
    { text: 'anlık bildirim',       x: 1100, y: 400, rot:  4, in: 0.44 },
  ];

  const keyOp   = interpolate([0.60, 0.78], [0, 1], Easing.easeOutCubic)(p);
  const keyY    = interpolate([0.60, 0.78], [20, 0], Easing.easeOutCubic)(p);
  const boxW    = interpolate([0.68, 0.90], [0, 780], Easing.easeOutExpo)(p);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: C.paper, opacity: op,
    }}>
      <Chrome stepNum="01 · ARAŞTIRMA" stepLabel="MESAJ KURGUSU" role="Yaratıcı Yönetmen"/>

      {/* subtle grid */}
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.25 }}
           viewBox="0 0 1920 1080" preserveAspectRatio="none">
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={i} x1="0" x2="1920" y1={i * 80 + 40} y2={i * 80 + 40}
                stroke={C.line} strokeWidth="1"/>
        ))}
      </svg>

      {notes.map((n, i) => {
        const local = clamp((p - n.in) / 0.10, 0, 1);
        const eased = Easing.easeOutBack(local);
        if (local <= 0) return null;
        return (
          <div key={i} style={{
            position: 'absolute', left: n.x, top: n.y,
            transform: `rotate(${n.rot}deg) translateY(${(1 - eased) * 12}px)
                        scale(${0.9 + eased * 0.1})`,
            opacity: local,
            fontFamily: F.script, fontSize: 34, fontStyle: 'italic',
            color: C.ink,
            padding: '6px 0',
            borderBottom: `2px solid ${C.gold}`,
          }}>
            {n.text}
          </div>
        );
      })}

      {/* pen cursor */}
      <div style={{
        position: 'absolute',
        left: interpolate([0, 0.3, 0.55, 0.8, 1], [180, 780, 1180, 340, 1100])(p),
        top:  interpolate([0, 0.3, 0.55, 0.8, 1], [260, 160, 480, 580, 440])(p),
        width: 8, height: 8, borderRadius: 8,
        background: C.goldDeep,
        opacity: p < 0.58 ? 1 : 0,
        boxShadow: `0 0 0 3px ${C.gold}33`,
      }}/>

      {/* Core message */}
      <div style={{
        position: 'absolute', left: '50%', top: 830,
        transform: `translate(-50%, ${keyY}px)`,
        opacity: keyOp, textAlign: 'center',
      }}>
        <div style={{
          fontFamily: F.mono, fontSize: 11, letterSpacing: '0.32em',
          color: C.mute, textTransform: 'uppercase', marginBottom: 18,
        }}>
          ANA MESAJ
        </div>
        <div style={{
          fontFamily: F.script, fontSize: 58, fontWeight: 300,
          color: C.ink, letterSpacing: '-0.02em', fontStyle: 'italic',
        }}>
          <span style={{ color: C.goldDeep }}>"Hayalinizdeki düğün,</span> tek bir platformda."
        </div>
        <div style={{
          margin: '22px auto 0', height: 1, width: boxW, background: C.gold,
        }}/>
      </div>
    </div>
  );
}

// ─── 02a · KEŞİF — Theme Gallery ───────────────────────────────────────────
function Scene2a() {
  const s = useSprite();
  const p = s.progress;
  const op = sceneOpacity(p);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: C.ivory, opacity: op,
    }}>
      <Chrome stepNum="02 · KEŞİF" stepLabel="TEMA KATALOĞU" role="Yaratıcı Yönetmen"/>

      <div style={{
        position: 'absolute', top: 140, left: 96,
        fontFamily: F.script, fontSize: 56, fontWeight: 300, fontStyle: 'italic',
        color: C.ink, letterSpacing: '-0.02em', maxWidth: 1100, lineHeight: 1.05,
        opacity: interpolate([0, 0.15], [0, 1])(p),
      }}>
        Sekiz tema, <span style={{ color: C.goldDeep }}>tek platform.</span>
      </div>
      <div style={{
        position: 'absolute', top: 220, left: 96,
        fontFamily: F.sans, fontSize: 17, color: C.mute,
        maxWidth: 560, letterSpacing: '0.02em', lineHeight: 1.5,
        opacity: interpolate([0.05, 0.2], [0, 1])(p),
      }}>
        Crystal, Grow, Sunset, Rose, Pearl, Ocean, Golden, Garden —
        her çiftin hikâyesine uygun bir dil.
      </div>

      {/* 4×2 theme grid */}
      <div style={{
        position: 'absolute', top: 340, left: 96,
        display: 'grid', gridTemplateColumns: 'repeat(4, 400px)',
        gridTemplateRows: 'repeat(2, 300px)',
        gap: 24,
      }}>
        {THEMES.map((th, i) => {
          const inAt = 0.14 + i * 0.06;
          const local = clamp((p - inAt) / 0.18, 0, 1);
          const eased = Easing.easeOutCubic(local);
          if (local <= 0) return null;
          return (
            <div key={th.key} style={{
              width: 400, height: 300,
              background: C.ink,
              position: 'relative',
              overflow: 'hidden',
              opacity: local,
              transform: `translateY(${(1 - eased) * 30}px) scale(${0.96 + eased * 0.04})`,
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            }}>
              {th.isImg ? (
                <img src={th.media} alt={th.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              ) : (
                <ThemeVideo src={th.media}/>
              )}
              {/* overlay + label */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)',
              }}/>
              <div style={{
                position: 'absolute', bottom: 16, left: 18,
                fontFamily: F.script, fontSize: 28, fontStyle: 'italic',
                color: C.ivory, letterSpacing: '-0.01em',
              }}>{th.name}</div>
              <div style={{
                position: 'absolute', top: 14, right: 16,
                fontFamily: F.mono, fontSize: 9, letterSpacing: '0.24em',
                color: 'rgba(245,240,230,0.75)',
                padding: '3px 8px',
                border: '1px solid rgba(245,240,230,0.35)',
                borderRadius: 999,
              }}>
                {String(i + 1).padStart(2, '0')} / 08
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 02b · KEŞİF — Deep Dive (Crystal hero) ────────────────────────────────
function Scene2b() {
  const s = useSprite();
  const p = s.progress;
  const op = sceneOpacity(p);

  // Use crystal.png as the hero background (real site screenshot)
  const imgScale = 1 + p * 0.05;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#c7c9c8', opacity: op, overflow: 'hidden',
    }}>
      {/* Full-bleed crystal hero */}
      <img src="media/crystal.png" alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${imgScale})`,
          transformOrigin: 'center',
          opacity: interpolate([0, 0.1], [0, 1])(p),
        }}/>

      {/* Soft vignette overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(245,240,230,0) 40%, rgba(26,22,18,0.35) 100%)',
      }}/>

      <Chrome stepNum="02 · KEŞİF" stepLabel="DERİNLEMESİNE" role="Yaratıcı Yönetmen"/>

      {/* Annotation callouts */}
      {[
        { x: 180,  y: 240, text: 'marka · altın oran',     in: 0.18 },
        { x: 1380, y: 220, text: 'nav · sade, iki seviye', in: 0.26 },
        { x: 150,  y: 780, text: 'tipografi · el yazısı',  in: 0.34 },
        { x: 1320, y: 780, text: 'CTA · tek birincil',     in: 0.42 },
      ].map((a, i) => {
        const local = clamp((p - a.in) / 0.12, 0, 1);
        if (local <= 0) return null;
        return (
          <div key={i} style={{
            position: 'absolute', left: a.x, top: a.y,
            opacity: local,
            transform: `translateY(${(1 - local) * 8}px)`,
          }}>
            <div style={{
              fontFamily: F.mono, fontSize: 11, letterSpacing: '0.24em',
              color: C.goldDeep, textTransform: 'uppercase',
              background: 'rgba(245,240,230,0.85)',
              padding: '8px 14px', borderLeft: `2px solid ${C.gold}`,
              backdropFilter: 'blur(4px)',
            }}>
              {a.text}
            </div>
          </div>
        );
      })}

      {/* Metrics row */}
      <div style={{
        position: 'absolute', bottom: 140, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: 14,
        opacity: interpolate([0.55, 0.72], [0, 1])(p),
      }}>
        {[
          ['TEMA', 'Crystal'],
          ['HİS', 'Zarif · Minimal'],
          ['TEMPO', 'Yavaş · Nefes alan'],
          ['HERO', 'Yüzük + İsim'],
        ].map(([k, v], i) => (
          <div key={i} style={{
            padding: '12px 18px',
            background: 'rgba(250,247,240,0.92)',
            border: `1px solid ${C.line}`,
          }}>
            <div style={{
              fontFamily: F.mono, fontSize: 9, letterSpacing: '0.28em',
              color: C.mute, textTransform: 'uppercase',
            }}>{k}</div>
            <div style={{
              fontFamily: F.script, fontSize: 20, fontStyle: 'italic',
              color: C.ink, marginTop: 4,
            }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 03a · STORYBOARD — Frame sketches ─────────────────────────────────────
function Scene3a() {
  const s = useSprite();
  const p = s.progress;
  const op = sceneOpacity(p);

  const frames = [
    { label: '01 · KAPAK',        sketch: 'envelope' },
    { label: '02 · HERO · İSİM',  sketch: 'names'    },
    { label: '03 · GERİ SAYIM',   sketch: 'countdown'},
    { label: '04 · YÜZÜK',        sketch: 'ring'     },
    { label: '05 · HİKAYEMİZ',    sketch: 'story'    },
    { label: '06 · LCV',          sketch: 'rsvp'     },
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: C.cream, opacity: op,
    }}>
      <Chrome stepNum="03 · STORYBOARD" stepLabel="KARELERİ ÇİZ" role="Storyboard Tasarımcısı"/>

      <div style={{
        position: 'absolute', top: 120, left: 96,
        fontFamily: F.script, fontSize: 60, fontWeight: 300, fontStyle: 'italic',
        color: C.ink, letterSpacing: '-0.02em',
      }}>
        Her kare, <span style={{ color: C.goldDeep }}>elle çiziliyor.</span>
      </div>

      <div style={{
        position: 'absolute', top: 240, left: 96,
        display: 'grid', gridTemplateColumns: 'repeat(3, 520px)',
        gridTemplateRows: 'repeat(2, 290px)',
        gap: 40,
      }}>
        {frames.map((f, i) => {
          const inAt = 0.10 + i * 0.10;
          const local = clamp((p - inAt) / 0.18, 0, 1);
          const draw  = clamp((p - inAt - 0.05) / 0.30, 0, 1);
          if (local <= 0) return null;
          const eased = Easing.easeOutCubic(local);
          return (
            <div key={i} style={{
              opacity: local,
              transform: `translateY(${(1 - eased) * 20}px)`,
            }}>
              <div style={{
                width: 520, height: 260,
                background: C.paper,
                border: `1px solid ${C.line}`,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 8, left: 8,
                  fontFamily: F.mono, fontSize: 9, letterSpacing: '0.2em',
                  color: C.mute,
                }}>16:9</div>
                <StoryboardSketch kind={f.sketch} progress={draw}/>
              </div>
              <div style={{
                marginTop: 10,
                fontFamily: F.mono, fontSize: 11, letterSpacing: '0.18em',
                color: C.ink, textTransform: 'uppercase',
              }}>
                {f.label}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        position: 'absolute', bottom: 110, right: 140,
        fontFamily: F.script, fontSize: 26, fontStyle: 'italic',
        color: C.goldDeep, transform: 'rotate(-4deg)',
        opacity: interpolate([0.7, 0.88], [0, 1])(p),
      }}>
        — 6 sahne, tek tek kurgulandı.
      </div>
    </div>
  );
}

function ThemeVideo({ src }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    const tryPlay = () => { v.play().catch(() => {}); };
    v.addEventListener('loadeddata', tryPlay);
    v.addEventListener('canplay', tryPlay);
    tryPlay();
    return () => {
      v.removeEventListener('loadeddata', tryPlay);
      v.removeEventListener('canplay', tryPlay);
    };
  }, []);
  return (
    <video ref={ref} src={src} autoPlay muted loop playsInline preload="auto"
      style={{ width: '100%', height: '100%', objectFit: 'cover',
               background: '#1a1612' }}/>
  );
}

function StoryboardSketch({ kind, progress }) {
  const stroke = C.ink;
  const sw = 1.5;
  const common = {
    stroke, strokeWidth: sw, fill: 'none',
    strokeLinecap: 'round', strokeLinejoin: 'round',
    style: {
      strokeDasharray: 1400,
      strokeDashoffset: 1400 * (1 - progress),
    },
  };
  return (
    <svg viewBox="0 0 520 260"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {kind === 'envelope' && (
        <>
          <rect x="160" y="80" width="200" height="130" {...common}/>
          <path d="M160 80 L260 150 L360 80" {...common}/>
          <circle cx="400" cy="220" r="8" stroke={C.gold} strokeWidth={sw} fill="none" style={common.style}/>
        </>
      )}
      {kind === 'names' && (
        <>
          <path d="M130 110 L130 180 M130 110 L180 180 L180 110" {...common}/>
          <path d="M220 150 Q240 120 260 150 T300 150" stroke={C.gold} strokeWidth={sw} fill="none" style={common.style}/>
          <path d="M340 110 L340 180 M340 180 L390 110 L390 180" {...common}/>
          <path d="M130 220 L390 220" {...common}/>
        </>
      )}
      {kind === 'countdown' && (
        <>
          <rect x="90" y="100" width="80" height="70" {...common}/>
          <rect x="190" y="100" width="80" height="70" {...common}/>
          <rect x="290" y="100" width="80" height="70" {...common}/>
          <rect x="390" y="100" width="80" height="70" {...common}/>
          <path d="M110 135 L150 135 M210 135 L250 135 M310 135 L350 135 M410 135 L450 135"
                stroke={C.gold} strokeWidth={sw} fill="none" style={common.style}/>
          <path d="M90 210 L470 210" {...common}/>
        </>
      )}
      {kind === 'ring' && (
        <>
          <circle cx="220" cy="150" r="55" {...common}/>
          <circle cx="300" cy="150" r="55" {...common}/>
          <path d="M260 85 L268 75 L272 80" stroke={C.gold} strokeWidth={sw} fill="none" style={common.style}/>
        </>
      )}
      {kind === 'story' && (
        <>
          <circle cx="160" cy="140" r="40" {...common}/>
          <circle cx="260" cy="140" r="40" {...common}/>
          <path d="M330 120 L440 120 M330 145 L440 145 M330 170 L400 170" {...common}/>
          <path d="M60 220 L460 220" stroke={C.gold} strokeWidth={sw} fill="none" style={common.style}/>
        </>
      )}
      {kind === 'rsvp' && (
        <>
          <rect x="150" y="90" width="220" height="120" {...common}/>
          <path d="M170 130 L350 130" {...common}/>
          <path d="M170 155 L310 155" {...common}/>
          <rect x="170" y="175" width="40" height="20" {...common}/>
          <path d="M178 185 L185 191 L202 180"
                stroke={C.gold} strokeWidth={sw} fill="none" style={common.style}/>
        </>
      )}
    </svg>
  );
}

// ─── 03b · STORYBOARD — Shot list ──────────────────────────────────────────
function Scene3b() {
  const s = useSprite();
  const p = s.progress;
  const op = sceneOpacity(p);

  const shots = [
    { n: 'S1', len: '0:00 – 0:04', cam: 'Yavaş itme',     action: 'Kapak açılır · altın vurgu' },
    { n: 'S2', len: '0:04 – 0:08', cam: 'Sabit',          action: 'Tuana & Ateş isimleri belirir' },
    { n: 'S3', len: '0:08 – 0:12', cam: 'Dikey kayma',    action: 'Geri sayım · 87 gün' },
    { n: 'S4', len: '0:12 – 0:16', cam: 'Macro detay',    action: 'Yüzük döner · üst ışık' },
    { n: 'S5', len: '0:16 – 0:20', cam: 'Yumuşak geçiş',  action: 'Hikayemiz · fotoğraf karusel' },
    { n: 'S6', len: '0:20 – 0:24', cam: 'Sabit',          action: 'LCV formu · dokunuş, onay' },
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: C.paper, opacity: op,
    }}>
      <Chrome stepNum="03 · STORYBOARD" stepLabel="ÇEKİM LİSTESİ" role="Storyboard Tasarımcısı"/>

      <div style={{
        position: 'absolute', top: 130, left: 96,
        fontFamily: F.script, fontSize: 58, fontWeight: 300, fontStyle: 'italic',
        color: C.ink, letterSpacing: '-0.02em',
      }}>
        Her sahnenin <span style={{ color: C.goldDeep }}>kendi notası.</span>
      </div>

      <div style={{
        position: 'absolute', top: 260, left: 96, right: 96,
      }}>
        {/* header row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '80px 220px 260px 1fr',
          padding: '10px 0', borderBottom: `1px solid ${C.ink}`,
          fontFamily: F.mono, fontSize: 11, letterSpacing: '0.22em',
          color: C.mute, textTransform: 'uppercase',
          opacity: interpolate([0, 0.1], [0, 1])(p),
        }}>
          <span>#</span><span>SÜRE</span><span>KAMERA</span><span>AKSİYON</span>
        </div>

        {shots.map((sh, i) => {
          const inAt = 0.08 + i * 0.08;
          const local = clamp((p - inAt) / 0.12, 0, 1);
          if (local <= 0) return null;
          return (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '80px 220px 260px 1fr',
              alignItems: 'center',
              padding: '18px 0',
              borderBottom: `1px solid ${C.line}`,
              opacity: local,
              transform: `translateX(${(1 - local) * 20}px)`,
            }}>
              <span style={{
                fontFamily: F.mono, fontSize: 14, letterSpacing: '0.12em',
                color: C.goldDeep,
              }}>{sh.n}</span>
              <span style={{
                fontFamily: F.mono, fontSize: 13, letterSpacing: '0.08em',
                color: C.ink,
              }}>{sh.len}</span>
              <span style={{
                fontFamily: F.sans, fontSize: 15, color: C.charcoal,
              }}>{sh.cam}</span>
              <span style={{
                fontFamily: F.script, fontSize: 22, fontStyle: 'italic',
                color: C.ink,
              }}>{sh.action}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 04 · İNCELEME ─────────────────────────────────────────────────────────
function Scene4() {
  const s = useSprite();
  const p = s.progress;
  const op = sceneOpacity(p);

  const annotations = [
    { x: 160,  y: 270, text: 'daha sıcak olsun',    in: 0.12 },
    { x: 700,  y: 230, text: '1.5sn beklet →',      in: 0.20 },
    { x: 1240, y: 290, text: 'marka altınını tut',  in: 0.28 },
    { x: 420,  y: 630, text: 'tempo tamam',         in: 0.36 },
    { x: 1000, y: 610, text: 'LCV anı ekle',        in: 0.44 },
  ];

  const approveOp    = interpolate([0.70, 0.84], [0, 1], Easing.easeOutBack)(p);
  const approveScale = interpolate([0.70, 0.84, 0.92], [0.5, 1.15, 1], Easing.easeOutCubic)(p);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: C.paper, opacity: op,
    }}>
      <Chrome stepNum="04 · İNCELEME" stepLabel="NOT VE ONAY" role="Baş Strateji Lideri"/>

      <div style={{
        position: 'absolute', top: 180, left: 96,
        display: 'grid', gridTemplateColumns: 'repeat(3, 480px)',
        gap: 56, rowGap: 120,
      }}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{
            width: 480, height: 270,
            background: C.ivory,
            border: `1px solid ${C.line}`,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: 6, left: 8,
              fontFamily: F.mono, fontSize: 10, letterSpacing: '0.18em',
              color: C.mute,
            }}>SC 0{i+1}</div>
            <StoryboardSketch
              kind={['envelope','names','countdown','ring','story','rsvp'][i]}
              progress={1}/>
          </div>
        ))}
      </div>

      {annotations.map((a, i) => {
        const local = clamp((p - a.in) / 0.08, 0, 1);
        if (local <= 0) return null;
        return (
          <div key={i} style={{
            position: 'absolute', left: a.x, top: a.y,
            opacity: local,
            transform: `rotate(-2deg) scale(${0.9 + local * 0.1})`,
            fontFamily: F.script, fontSize: 28, fontStyle: 'italic',
            color: '#c4413a',
            padding: '4px 10px',
            background: 'rgba(245,240,230,0.85)',
            borderLeft: `2px solid #c4413a`,
          }}>
            {a.text}
          </div>
        );
      })}

      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
           viewBox="0 0 1920 1080">
        {[
          { d: 'M 280 380 Q 320 420 260 440', in: 0.16 },
          { d: 'M 860 360 Q 920 330 900 300', in: 0.24 },
          { cx: 1380, cy: 420, r: 60, in: 0.32 },
        ].map((a, i) => {
          const local = clamp((p - a.in) / 0.08, 0, 1);
          if (a.d) {
            return <path key={i} d={a.d} stroke="#c4413a" strokeWidth="2.5" fill="none"
              strokeLinecap="round"
              style={{ strokeDasharray: 300, strokeDashoffset: 300 * (1 - local) }}/>;
          } else {
            const circ = 2 * Math.PI * a.r;
            return <circle key={i} cx={a.cx} cy={a.cy} r={a.r}
              stroke="#c4413a" strokeWidth="2.5" fill="none"
              style={{ strokeDasharray: circ, strokeDashoffset: circ * (1 - local) }}/>;
          }
        })}
      </svg>

      <div style={{
        position: 'absolute', right: 120, top: 640,
        transform: `rotate(-8deg) scale(${approveScale})`,
        opacity: approveOp,
        border: `4px solid ${C.sage}`,
        padding: '16px 40px',
        fontFamily: F.serif, fontSize: 48, fontWeight: 700,
        color: C.sage, letterSpacing: '0.08em',
      }}>
        ONAYLANDI
        <div style={{
          fontFamily: F.mono, fontSize: 12, letterSpacing: '0.2em',
          fontWeight: 400, marginTop: 4,
        }}>
          19.04.26 · LİDER
        </div>
      </div>
    </div>
  );
}

// ─── 05a · UYGULAMA — Timeline ─────────────────────────────────────────────
function Scene5a() {
  const s = useSprite();
  const p = s.progress;
  const op = sceneOpacity(p);

  const tracks = [
    { name: 'İSMİYLE ÇİFT',      color: C.gold,     keys: [0.15, 0.35, 0.55, 0.72] },
    { name: 'GERİ SAYIM',          color: C.rose,     keys: [0.20, 0.48, 0.80] },
    { name: 'HİKÂYEMİZ',           color: C.sage,     keys: [0.30, 0.55, 0.70, 0.88] },
    { name: 'MEKÂN · HARİTA',      color: C.goldDeep, keys: [0.10, 0.55] },
    { name: 'FOTOĞRAF · GALERİ',   color: C.rose,     keys: [0.25, 0.45, 0.65] },
    { name: 'LCV · FORM',           color: C.mute,     keys: [0.05, 0.40, 0.75] },
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: C.charcoal, opacity: op,
      color: C.cream,
    }}>
      <Chrome stepNum="05 · UYGULAMA" stepLabel="BÖLÜM AKIŞI" role="Ürün Tasarımcısı" tone="dark"/>

      <div style={{
        position: 'absolute', top: 150, left: 72,
        fontFamily: F.script, fontSize: 54, fontWeight: 300, fontStyle: 'italic',
        color: C.cream, letterSpacing: '-0.02em',
      }}>
        Temayı <span style={{ color: C.gold }}>çiftin hikâyesine bürüyüyoruz.</span>
      </div>

      {/* Timeline panel */}
      <div style={{
        position: 'absolute', top: 280, left: 72, right: 72,
        background: C.ink,
        border: `1px solid #0f0c09`,
        padding: 28,
      }}>
        <div style={{
          fontFamily: F.mono, fontSize: 10, letterSpacing: '0.24em',
          color: C.mute, marginBottom: 20, textTransform: 'uppercase',
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span>▾ tuana-ates.uygundavet.com · Crystal · 7 bölüm</span>
          <span>{Math.floor(p * 40 + 60)}% hazır</span>
        </div>

        {tracks.map((t, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center',
            marginBottom: 18,
            opacity: interpolate([0.05 + i * 0.05, 0.15 + i * 0.05], [0, 1])(p),
          }}>
            <div style={{
              width: 180, fontFamily: F.mono, fontSize: 12,
              color: C.cream, letterSpacing: '0.08em',
            }}>{t.name}</div>
            <div style={{
              flex: 1, height: 28, background: '#0f0c09',
              position: 'relative',
              border: `1px solid #2a2520`,
            }}>
              <div style={{
                position: 'absolute', left: 8, right: 8, top: 11, height: 6,
                background: t.color, opacity: 0.3,
              }}/>
              {t.keys.map((k, j) => (
                <div key={j} style={{
                  position: 'absolute', left: `${k * 100}%`, top: '50%',
                  width: 12, height: 12, marginLeft: -6, marginTop: -6,
                  background: t.color, transform: 'rotate(45deg)',
                  boxShadow: p > k ? `0 0 8px ${t.color}` : 'none',
                }}/>
              ))}
            </div>
          </div>
        ))}

        {/* Playhead */}
        <div style={{
          position: 'absolute',
          left: 180 + 28 + (p * (1920 - 72*2 - 28*2 - 180)),
          top: 60, bottom: 28,
          width: 1, background: C.gold,
          pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute', top: -10, left: -6,
            width: 12, height: 10, background: C.gold,
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          }}/>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 120, left: 72, right: 72,
        display: 'flex', gap: 28,
        fontFamily: F.mono, fontSize: 11, letterSpacing: '0.2em',
        color: C.mute,
        opacity: interpolate([0.35, 0.55], [0, 1])(p),
      }}>
        <span>■ ÖNİZLEME · CANLI</span>
        <span style={{ color: C.gold }}>▲ TR · EN · DE</span>
        <span>■ BÖLÜM · 7</span>
        <span>■ BİLEŞEN · 38</span>
      </div>
    </div>
  );
}

// ─── 05b · UYGULAMA — Canlı Önizleme (Grow theme) ─────────────────────────────
function Scene5b() {
  const s = useSprite();
  const p = s.progress;
  const op = sceneOpacity(p);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#0a0806', opacity: op, overflow: 'hidden',
    }}>
      {/* Full-bleed Grow backdrop — real screenshot */}
      <img src="media/grow.png" alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${1 + p * 0.04})`,
          transformOrigin: 'center',
          opacity: interpolate([0, 0.08], [0, 0.9])(p),
        }}/>

      <Chrome stepNum="05 · UYGULAMA" stepLabel="CANLI ÖNİZLEME" role="Ürün Tasarımcısı" tone="dark"/>

      {/* LIVE overlay */}
      <div style={{
        position: 'absolute', top: 120, left: 48,
        display: 'flex', gap: 10, alignItems: 'center',
        opacity: interpolate([0.05, 0.15], [0, 1])(p),
      }}>
        <span style={{
          width: 10, height: 10, borderRadius: 10,
          background: '#7fb069',
          opacity: Math.sin(p * 40) > 0 ? 1 : 0.3,
        }}/>
        <span style={{
          fontFamily: F.mono, fontSize: 11, letterSpacing: '0.3em',
          color: C.cream,
        }}>CANLI · MOBİL · MASAÜSTÜ</span>
      </div>

      {/* Crosshair guides */}
      {[
        ['top', 80], ['bottom', 80], ['left', 80], ['right', 80],
      ].map(([side, inset], i) => {
        const style = { position: 'absolute', background: C.gold, opacity: 0.5 };
        if (side === 'top' || side === 'bottom') {
          Object.assign(style, { left: '50%', width: 1, height: 40,
            [side]: inset, marginLeft: -0.5 });
        } else {
          Object.assign(style, { top: '50%', height: 1, width: 40,
            [side]: inset, marginTop: -0.5 });
        }
        return <div key={i} style={style}/>;
      })}

      {/* Progress bar — render progress */}
      <div style={{
        position: 'absolute', bottom: 140, left: '50%',
        transform: 'translateX(-50%)', width: 600,
        opacity: interpolate([0.3, 0.5], [0, 1])(p),
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: F.mono, fontSize: 10, letterSpacing: '0.26em',
          color: C.cream, marginBottom: 8,
        }}>
          <span>YAYIN HAZIRLIĞI</span>
          <span>{Math.floor(Math.min((p - 0.3) * 160, 100))}%</span>
        </div>
        <div style={{
          height: 2, width: '100%', background: 'rgba(245,240,230,0.2)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${Math.min(Math.max((p - 0.3) * 160, 0), 100)}%`,
            background: C.gold,
          }}/>
        </div>
      </div>

      {/* current frame indicator */}
      <div style={{
        position: 'absolute', bottom: 140, right: 48,
        fontFamily: F.mono, fontSize: 11, letterSpacing: '0.22em',
        color: C.cream, opacity: interpolate([0.25, 0.45], [0, 1])(p),
      }}>
        BÖLÜM · {String(Math.floor(p * 7) + 1).padStart(2, '0')} / 07
      </div>
    </div>
  );
}

// ─── 06 · ONAY ─────────────────────────────────────────────────────────────
function Scene6() {
  const s = useSprite();
  const p = s.progress;
  const op = sceneOpacity(p);

  const checks = [
    { label: 'Renk · marka altını uyumu',        meta: 'ΔE < 2.0',    in: 0.10 },
    { label: 'Tipografi · kerning ve hiyerarşi', meta: 'TAMAM',       in: 0.18 },
    { label: 'Erişim · mobil · masaüstü · QR',   meta: '3 / 3',       in: 0.26 },
    { label: 'Performans · ilk yükleme',          meta: '< 1.2sn',     in: 0.34 },
    { label: 'LCV · form ve bildirim',           meta: 'TAMAM',       in: 0.42 },
    { label: 'Çoklu dil · TR · EN · DE',          meta: '3 / 3',       in: 0.50 },
    { label: 'SSL · alan adı · paylaşım',         meta: 'YAYINDA',     in: 0.58 },
  ];

  const finalOp    = interpolate([0.76, 0.90], [0, 1], Easing.easeOutCubic)(p);
  const finalScale = interpolate([0.76, 0.88], [0.9, 1], Easing.easeOutBack)(p);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: C.ivory, opacity: op,
    }}>
      <Chrome stepNum="06 · ONAY" stepLabel="YAYIN KONTROLÜ" role="Baş Ürün Tasarımcısı"/>

      <div style={{
        position: 'absolute', top: 140, left: 96,
        fontFamily: F.script, fontSize: 72, fontWeight: 300, fontStyle: 'italic',
        color: C.ink, letterSpacing: '-0.02em',
      }}>
        Son <span style={{ color: C.goldDeep }}>kalite kontrolü.</span>
      </div>
      <div style={{
        position: 'absolute', top: 252, left: 96,
        fontFamily: F.sans, fontSize: 18,
        color: C.mute, letterSpacing: '0.02em',
      }}>
        Bu yedi onay olmadan hiçbir şey teslim edilmez.
      </div>

      <div style={{
        position: 'absolute', top: 340, left: 96, right: 96,
      }}>
        {checks.map((c, i) => {
          const local = clamp((p - c.in) / 0.06, 0, 1);
          if (local <= 0) return null;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center',
              padding: '16px 4px',
              borderBottom: `1px solid ${C.line}`,
              opacity: local,
              transform: `translateX(${(1 - local) * 16}px)`,
            }}>
              <div style={{
                width: 30, height: 30,
                borderRadius: 4, background: C.sage,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginRight: 22,
              }}>
                <svg width="18" height="18" viewBox="0 0 16 16">
                  <path d="M3 8 L7 12 L13 4" stroke={C.ivory} strokeWidth="2.5"
                    fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{
                fontFamily: F.sans, fontSize: 22, fontWeight: 500,
                color: C.ink, flex: 1,
              }}>
                {c.label}
              </div>
              <div style={{
                fontFamily: F.mono, fontSize: 12, letterSpacing: '0.18em',
                color: C.mute, textTransform: 'uppercase',
              }}>
                {c.meta}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        position: 'absolute', right: 120, bottom: 120,
        opacity: finalOp,
        transform: `scale(${finalScale})`,
        textAlign: 'right',
      }}>
        <div style={{
          fontFamily: F.mono, fontSize: 11, letterSpacing: '0.24em',
          color: C.mute, marginBottom: 8,
        }}>
          YAYINDA · tuana-ates.uygundavet.com
        </div>
        <div style={{
          fontFamily: F.script, fontSize: 52, fontWeight: 300,
          color: C.goldDeep, fontStyle: 'italic',
        }}>
          Paylaşıma hazır.
        </div>
      </div>
    </div>
  );
}

// ─── OUTRO ─────────────────────────────────────────────────────────────────
function Outro() {
  const t = useTime();
  const start = 40.0;
  const local = clamp((t - start) / 4, 0, 1);
  if (t < start) return null;

  const logoOp    = interpolate([0, 0.3], [0, 1], Easing.easeOutCubic)(local);
  const logoScale = interpolate([0, 0.5], [0.88, 1], Easing.easeOutCubic)(local);
  const taglineOp = interpolate([0.22, 0.5], [0, 1])(local);
  const urlOp     = interpolate([0.4, 0.7], [0, 1])(local);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: C.ink, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {/* faint gold ring bg */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, ${C.goldDeep}22 0%, ${C.ink} 70%)`,
        opacity: logoOp,
      }}/>

      {/* Logo */}
      <div style={{
        width: 160, height: 160,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 40, opacity: logoOp,
        transform: `scale(${logoScale})`,
      }}>
        <img src="media/logo.png" alt="Uygun Davet"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
      </div>

      <img src="media/brand-text.png" alt="Uygun Davet"
        style={{
          height: 120, width: 'auto', display: 'block',
          filter: 'brightness(1.15)',
          opacity: logoOp,
          transform: `scale(${logoScale})`,
        }}/>
      <div style={{
        marginTop: 24,
        fontFamily: F.sans, fontSize: 18,
        color: C.cream, letterSpacing: '0.14em',
        opacity: taglineOp,
      }}>
        Dijital davet · Hayalinizdeki düğün
      </div>
      <div style={{
        marginTop: 80,
        fontFamily: F.mono, fontSize: 12, letterSpacing: '0.42em',
        color: C.mute, textTransform: 'uppercase',
        opacity: urlOp,
      }}>
        uygundavet.com
      </div>
    </div>
  );
}

// ─── Root scene tree ───────────────────────────────────────────────────────
function SceneTree() {
  return (
    <>
      <Sprite start={0}    end={2.5}>  <Intro/>  </Sprite>
      <Sprite start={2.5}  end={7.0}>  <Scene1/> </Sprite>
      <Sprite start={7.0}  end={11.0}> <Scene2a/></Sprite>
      <Sprite start={11.0} end={15.5}> <Scene2b/></Sprite>
      <Sprite start={15.5} end={19.5}> <Scene3a/></Sprite>
      <Sprite start={19.5} end={23.0}> <Scene3b/></Sprite>
      <Sprite start={23.0} end={27.0}> <Scene4/> </Sprite>
      <Sprite start={27.0} end={31.0}> <Scene5a/></Sprite>
      <Sprite start={31.0} end={35.5}> <Scene5b/></Sprite>
      <Sprite start={35.5} end={40.0}> <Scene6/> </Sprite>
      <Sprite start={40.0} end={44.0}> <Outro/>  </Sprite>
    </>
  );
}

window.SceneTree = SceneTree;
