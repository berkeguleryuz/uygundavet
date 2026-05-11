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
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";

// 18s 9:16 — "Üç Paket, Tek Davet"
// Projedeki gerçek paketler (lib/packages.ts + messages/tr.json) ile.
//   0.0 – 3.0   AÇILIŞ
//   3.0 – 7.5   BAŞLANGIÇ      7499₺
//   7.5 – 12.0  PRO            12999₺ "Önerilen"
//  12.0 – 16.0  ELİT           14999₺
//  16.0 – 18.0  KAPANIŞ
export const PaketlerReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bgDark, overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.cinematic)} volume={0.55} />

      <Sequence from={0} durationInFrames={Math.round(3 * fps)}>
        <Hook />
      </Sequence>
      <Sequence
        from={Math.round(3 * fps)}
        durationInFrames={Math.round(4.5 * fps)}
      >
        <PackageCard
          name="Başlangıç"
          price="7.499"
          desc="Dijital davetiye ve düğün web sitesiyle başlayın."
          features={[
            "Düğün Web Sitesi",
            "Dijital Davetiye",
            "Online LCV Formu",
            "Konum & Yol Tarifi",
            "Geri Sayım Sayacı",
            "WhatsApp ile Paylaşım",
          ]}
          stage="REELS · 02"
        />
      </Sequence>
      <Sequence
        from={Math.round(7.5 * fps)}
        durationInFrames={Math.round(4.5 * fps)}
      >
        <PackageCard
          name="Pro"
          price="12.999"
          desc="Fotoğraflar, anılar ve kişiselleştirme ile eksiksiz deneyim."
          badge="ÖNERİLEN"
          highlighted
          features={[
            "Fotoğraf Yükleme & Galeri",
            "Anı Defteri (Misafir Mesajları)",
            "Arka Plan Müziği",
            "Hikâyeniz Bölümü",
            "Çoklu Dil (TR · EN · DE)",
            "Hatırlatma Bildirimleri",
            "Başlangıç paketindeki her şey",
          ]}
          stage="REELS · 03"
        />
      </Sequence>
      <Sequence
        from={Math.round(12 * fps)}
        durationInFrames={Math.round(4 * fps)}
      >
        <PackageCard
          name="Elit"
          price="14.999"
          desc="Dijital + fiziksel; masalara QR sticker dahil gerçek davetiye."
          features={[
            "Basılı Gerçek Davetiye (100 adet)",
            "QR Kod Sticker (25 adet)",
            "Özel Tasarım Desteği",
            "Öncelikli Destek",
            "Özel Domain",
            "Pro paketindeki her şey",
          ]}
          stage="REELS · 04"
        />
      </Sequence>
      <Sequence
        from={Math.round(16 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <End />
      </Sequence>
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalBox}
        duration={3}
        zoom={{ from: 1.06, to: 1.16 }}
        pan={{ x: [0.2, -0.2], y: [-0.1, 0.1] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.55}
        fadeOut={0.4}
      />
      <AbsoluteFill
        style={{
          padding: "14% 8%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 18,
            letterSpacing: "0.42em",
            color: C.goldHi,
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          ✦ FİYATLANDIRMA
        </div>
        <KineticHeadline
          start={0.2}
          stagger={0.07}
          align="left"
          lines={[
            {
              text: "Size uygun",
              font: "serif",
              size: 130,
              color: C.cream,
              weight: 300,
            },
            {
              text: "paketi seçin.",
              font: "serifSoft",
              italic: true,
              size: 130,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
        <div
          style={{
            fontFamily: F.body,
            fontSize: 22,
            color: "rgba(245,240,230,0.78)",
            marginTop: 22,
            lineHeight: 1.4,
            letterSpacing: "0.02em",
          }}
        >
          Üç paket, %50 kapora ile başlama imkânı.
        </div>
      </AbsoluteFill>
      <Frame tone="dark" stage="REELS · 01" role="PAKETLER" showTimecode={false} />
    </AbsoluteFill>
  );
};

type CardProps = {
  name: string;
  price: string;
  desc: string;
  features: string[];
  badge?: string;
  highlighted?: boolean;
  stage: string;
};

const PackageCard: React.FC<CardProps> = ({
  name,
  price,
  desc,
  features,
  badge,
  highlighted,
  stage,
}) => {
  const t = useSeconds();
  const cardOp = tween({ t, start: 0.0, end: 0.5, from: 0, to: 1, ease: EASE.outQuart });
  const cardTy = tween({ t, start: 0.0, end: 0.6, from: 28, to: 0, ease: EASE.outBack });

  return (
    <AbsoluteFill style={{ background: C.bgDark }}>
      <MediaBackdrop
        src={HERO_VIDEOS.kelebek}
        duration={4.5}
        zoom={{ from: 1.04, to: 1.1 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.75}
        tint="#000"
        tintOpacity={0.7}
        fadeIn={0.25}
        fadeOut={0.3}
      />

      <AbsoluteFill
        style={{
          padding: "10% 6%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            opacity: cardOp,
            transform: `translateY(${cardTy}px)`,
            background: highlighted
              ? "rgba(245,240,230,0.10)"
              : "rgba(245,240,230,0.05)",
            border: highlighted
              ? `1.5px solid ${C.goldHi}`
              : "1px solid rgba(245,240,230,0.22)",
            borderRadius: 26,
            padding: "44px 44px 38px",
            backdropFilter: "blur(14px)",
            position: "relative",
          }}
        >
          {badge ? (
            <div
              style={{
                position: "absolute",
                top: -16,
                left: "50%",
                transform: "translateX(-50%)",
                background: "#fff",
                color: "#252224",
                fontFamily: F.mono,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.32em",
                padding: "8px 18px",
                borderRadius: 999,
                textTransform: "uppercase",
              }}
            >
              {badge}
            </div>
          ) : null}

          <div
            style={{
              fontFamily: F.mono,
              fontSize: 14,
              letterSpacing: "0.42em",
              color: C.goldHi,
              textTransform: "uppercase",
            }}
          >
            {name.toUpperCase()}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              marginTop: 14,
            }}
          >
            <span
              style={{
                fontFamily: F.serif,
                fontWeight: 300,
                fontSize: 144,
                color: C.cream,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
              }}
            >
              {price}
            </span>
            <span
              style={{
                fontFamily: F.serifSoft,
                fontStyle: "italic",
                fontSize: 56,
                color: C.gold,
              }}
            >
              ₺
            </span>
            <span
              style={{
                fontFamily: F.mono,
                fontSize: 14,
                letterSpacing: "0.22em",
                color: "rgba(245,240,230,0.55)",
                textTransform: "uppercase",
                marginLeft: 12,
              }}
            >
              · TEK SEFERLİK
            </span>
          </div>

          <div
            style={{
              fontFamily: F.serifSoft,
              fontStyle: "italic",
              fontSize: 24,
              color: "rgba(245,240,230,0.85)",
              marginTop: 6,
              letterSpacing: "0.02em",
              lineHeight: 1.35,
            }}
          >
            {desc}
          </div>

          <div
            style={{
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(213,209,173,0.4), transparent)",
              margin: "26px 0",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {features.map((f, i) => {
              const start = 0.4 + i * 0.12;
              const op = tween({
                t,
                start,
                end: start + 0.4,
                from: 0,
                to: 1,
                ease: EASE.outQuart,
              });
              const tx = tween({
                t,
                start,
                end: start + 0.5,
                from: 16,
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
                    alignItems: "flex-start",
                    gap: 12,
                    fontFamily: F.body,
                    fontSize: 19,
                    color: C.cream,
                    lineHeight: 1.4,
                  }}
                >
                  <span
                    style={{
                      color: C.goldHi,
                      fontFamily: F.mono,
                      fontSize: 14,
                      marginTop: 3,
                    }}
                  >
                    ✓
                  </span>
                  <span>{f}</span>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 30,
              padding: "20px 24px",
              background: highlighted ? C.gold : "transparent",
              border: highlighted ? "none" : `1.5px solid ${C.goldHi}`,
              color: highlighted ? "#1a1612" : C.goldHi,
              borderRadius: 16,
              textAlign: "center",
              fontFamily: F.display,
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
            }}
          >
            PAKETİ SEÇ
          </div>
        </div>
      </AbsoluteFill>

      <Frame tone="dark" stage={stage} role={name.toUpperCase()} showTimecode={false} />
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  const t = useSeconds();
  return (
    <AbsoluteFill style={{ background: C.bgDark }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalBox}
        duration={2}
        zoom={{ from: 1.0, to: 1.06 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.7}
        fadeIn={0.3}
        fadeOut={0.3}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 14,
          textAlign: "center",
          padding: "0 8%",
        }}
      >
        <BrandLockup
          start={0.0}
          size={280}
          tone="dark"
          cta="UYGUNDAVET.COM"
          url="instagram · uygundavetcom"
        />
        <div
          style={{
            opacity: tween({ t, start: 1.0, end: 1.7, from: 0, to: 1 }),
            fontFamily: F.script,
            fontStyle: "italic",
            fontSize: 28,
            color: C.goldHi,
            letterSpacing: "0.03em",
          }}
        >
          %50 kapora ile başlayın, kalanı teslimde.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
