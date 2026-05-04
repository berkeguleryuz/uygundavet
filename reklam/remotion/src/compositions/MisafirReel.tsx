import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { C } from "../style/colors";
import { F } from "../style/fonts";
import { HERO_VIDEOS, MUSIC } from "../style/themes";
import { tween, useSeconds, EASE } from "../style/ease";
import { MediaBackdrop } from "../components/MediaBackdrop";
import { KineticHeadline } from "../components/KineticHeadline";
import { CounterTicker } from "../components/CounterTicker";
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";

// 18s 9:16 — "Misafiriniz Yanıtlasın"
// Bir bağlantıyla gelen onayların gerçek zamanlı akışını gösterir.
//   0.0 – 3.5   AÇILIŞ        "Bir bağlantı yeter."
//   3.5 – 12.5  AKIŞ          onay kartları yığılır + 0 → 147 sayaç
//  12.5 – 15.5  ÖZELLİKLER    katılım + takvim + hediye + anı
//  15.5 – 18.0  KAPANIŞ
export const MisafirReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bgLight, overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.warm)} volume={0.6} />

      <Sequence from={0} durationInFrames={Math.round(3.5 * fps)}>
        <Hook />
      </Sequence>
      <Sequence
        from={Math.round(3.5 * fps)}
        durationInFrames={Math.round(9 * fps)}
      >
        <RsvpFeed />
      </Sequence>
      <Sequence
        from={Math.round(12.5 * fps)}
        durationInFrames={Math.round(3 * fps)}
      >
        <FeatureList />
      </Sequence>
      <Sequence
        from={Math.round(15.5 * fps)}
        durationInFrames={Math.round(2.5 * fps)}
      >
        <End />
      </Sequence>
    </AbsoluteFill>
  );
};

const PaperWash: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at 30% 20%, #faf7f0 0%, #ece4d3 60%, #d8cfbc 100%)",
    }}
  />
);

const Hook: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: C.bgLight }}>
      <PaperWash />
      <AbsoluteFill
        style={{
          padding: "14% 8%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 18,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: 22,
            opacity: tween({ t, start: 0.0, end: 0.6, from: 0, to: 1 }),
          }}
        >
          ✦ KATILIM AKIŞI
        </div>
        <KineticHeadline
          start={0.2}
          stagger={0.07}
          align="left"
          lines={[
            {
              text: "Bir bağlantı",
              font: "serif",
              size: 134,
              color: C.charcoal,
              weight: 300,
            },
            {
              text: "yeter.",
              font: "serifSoft",
              italic: true,
              size: 134,
              color: C.goldDeep,
              weight: 400,
            },
          ]}
        />
        <div
          style={{
            opacity: tween({ t, start: 1.4, end: 2.2, from: 0, to: 1 }),
            fontFamily: F.body,
            fontSize: 30,
            color: C.charcoal,
            lineHeight: 1.4,
            marginTop: 28,
            maxWidth: "92%",
          }}
        >
          Misafirleriniz tek dokunuşla yanıtlasın; siz salonun
          değil, anın hesabını tutun.
        </div>
      </AbsoluteFill>
      <Frame tone="light" stage="REELS · 01" role="AKIŞ" showTimecode={false} />
    </AbsoluteFill>
  );
};

type Reply = { name: string; status: "katılım" | "katılım" | "ret"; party: number };

const REPLIES: Reply[] = [
  { name: "Elif & Mert", status: "katılım", party: 2 },
  { name: "Selin Yılmaz", status: "katılım", party: 1 },
  { name: "Demir ailesi", status: "katılım", party: 4 },
  { name: "Burak Kaya", status: "ret", party: 0 },
  { name: "Aslı & Cem", status: "katılım", party: 2 },
  { name: "Naz Doğan", status: "katılım", party: 1 },
  { name: "Hakan Bey", status: "katılım", party: 3 },
  { name: "Zeynep Akın", status: "katılım", party: 2 },
];

const RsvpFeed: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: C.bgLight }}>
      <PaperWash />

      {/* Big counter, top */}
      <AbsoluteFill
        style={{
          padding: "10% 8% 0",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 16,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: C.mute,
            marginBottom: 8,
          }}
        >
          BUGÜNE KADAR ONAYLANAN
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 18,
          }}
        >
          <CounterTicker
            from={0}
            to={147}
            start={0.2}
            duration={5}
            ease={EASE.outExpo}
            style={{
              fontFamily: F.serif,
              fontWeight: 300,
              fontSize: 220,
              color: C.charcoal,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
            }}
          />
          <div
            style={{
              fontFamily: F.serifSoft,
              fontStyle: "italic",
              fontSize: 56,
              color: C.gold,
              letterSpacing: "0.02em",
            }}
          >
            misafir
          </div>
        </div>
        <div
          style={{
            fontFamily: F.body,
            fontSize: 22,
            color: C.charcoal,
            marginTop: 12,
            opacity: tween({ t, start: 0.6, end: 1.4, from: 0, to: 1 }),
          }}
        >
          250 davetin <strong style={{ color: C.goldDeep }}>%59'u</strong> ilk
          haftada yanıtladı.
        </div>
      </AbsoluteFill>

      {/* Stacked reply cards, bottom 55% */}
      <div
        style={{
          position: "absolute",
          left: "6%",
          right: "6%",
          bottom: "8%",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {REPLIES.map((r, i) => {
          const start = 0.6 + i * 0.55;
          const op = tween({
            t,
            start,
            end: start + 0.4,
            from: 0,
            to: 1,
            ease: EASE.outQuart,
          });
          const ty = tween({
            t,
            start,
            end: start + 0.5,
            from: 22,
            to: 0,
            ease: EASE.outBack,
          });
          const dim = Math.max(0.4, 1 - i * 0.06);
          return (
            <div
              key={i}
              style={{
                opacity: op * dim,
                transform: `translateY(${ty}px)`,
                background: "#fff",
                border: `1px solid ${C.line}`,
                borderRadius: 14,
                padding: "16px 22px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                boxShadow: "0 12px 24px rgba(20,16,12,0.08)",
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: r.status === "katılım" ? C.sage : C.rose,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: F.serif,
                    fontSize: 26,
                    color: C.ink,
                    fontWeight: 400,
                  }}
                >
                  {r.name}
                </div>
                <div
                  style={{
                    fontFamily: F.mono,
                    fontSize: 12,
                    color: C.mute,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    marginTop: 2,
                  }}
                >
                  {r.status === "katılım"
                    ? `katıldı · ${r.party} kişi`
                    : "katılamayacak"}
                </div>
              </div>
              <div
                style={{
                  fontFamily: F.mono,
                  fontSize: 12,
                  color: C.mute,
                  letterSpacing: "0.18em",
                }}
              >
                {String(i * 7 + 3).padStart(2, "0")}:
                {String((i * 11) % 60).padStart(2, "0")}
              </div>
            </div>
          );
        })}
      </div>
      <Frame tone="light" stage="REELS · 02" role="ONAY" showTimecode={false} />
    </AbsoluteFill>
  );
};

const FeatureList: React.FC = () => {
  const t = useSeconds();
  const items: [string, string][] = [
    ["Otomatik katılım takibi", "Yanıt geldikçe size bildirir"],
    ["Takvime tek dokunuş", "Misafir gününü iCal'e ekler"],
    ["Hediye listesi", "Çift ve aile için tek liste"],
    ["Anı defteri", "Dileklerinizi ömürlük arşive alın"],
  ];
  return (
    <AbsoluteFill style={{ background: C.bgDark }}>
      <MediaBackdrop
        src={HERO_VIDEOS.kelebek}
        duration={3}
        zoom={{ from: 1.04, to: 1.14 }}
        pan={{ x: [0.2, -0.2], y: [-0.1, 0.1] }}
        vignette={0.65}
        tint="#000"
        tintOpacity={0.5}
        fadeIn={0.3}
        fadeOut={0.4}
      />
      <AbsoluteFill
        style={{
          padding: "12% 8%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: 22,
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 16,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: C.goldHi,
            opacity: tween({ t, start: 0.0, end: 0.6, from: 0, to: 1 }),
          }}
        >
          ✦ DAHİLİ
        </div>
        {items.map(([title, desc], i) => {
          const start = 0.2 + i * 0.18;
          const op = tween({
            t,
            start,
            end: start + 0.5,
            from: 0,
            to: 1,
            ease: EASE.outQuart,
          });
          const tx = tween({
            t,
            start,
            end: start + 0.6,
            from: 36,
            to: 0,
            ease: EASE.outQuart,
          });
          return (
            <div
              key={i}
              style={{
                opacity: op,
                transform: `translateX(${tx}px)`,
                display: "flex",
                gap: 18,
                alignItems: "baseline",
                borderBottom: "1px solid rgba(245,240,230,0.18)",
                paddingBottom: 14,
              }}
            >
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: 16,
                  color: C.gold,
                  letterSpacing: "0.16em",
                  width: 38,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: F.serif,
                    fontSize: 38,
                    color: C.cream,
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontFamily: F.body,
                    fontSize: 20,
                    color: "rgba(245,240,230,0.7)",
                    marginTop: 4,
                  }}
                >
                  {desc}
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <Frame tone="dark" stage="REELS · 03" role="DAHİLİ" showTimecode={false} />
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.bgDark }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalBox}
        duration={2.5}
        zoom={{ from: 1.0, to: 1.06 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.65}
        fadeIn={0.3}
        fadeOut={0.3}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 8%",
        }}
      >
        <BrandLockup
          start={0.0}
          size={300}
          tone="dark"
          cta="UYGUNDAVET.COM"
          url="instagram · uygundavetcom"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
