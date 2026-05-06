import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { C } from "../style/colors";
import { F } from "../style/fonts";
import { HERO_VIDEOS, MUSIC, STILL_IMAGES } from "../style/themes";
import { tween, useSeconds, EASE } from "../style/ease";
import { MediaBackdrop } from "../components/MediaBackdrop";
import { KineticHeadline } from "../components/KineticHeadline";
import { BrandLockup } from "../components/BrandLockup";
import { Frame } from "../components/Frame";

// 14s 9:16 — "Her Ekranda, Aynı Zarafet"
//   0.0 – 3.0   AÇILIŞ
//   3.0 – 11.0  CİHAZLAR     telefon → tablet → laptop, üçü beraber
//  11.0 – 13.0  ÇERÇEVE
//  13.0 – 14.0  KAPANIŞ      "Her tarayıcıda yaşayan bir davet."
export const CokCihazReelComposition: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#0a0a0a", overflow: "hidden" }}>
      <Audio src={staticFile(MUSIC.cinematic)} volume={0.55} />

      <Sequence from={0} durationInFrames={Math.round(3 * fps)}>
        <Hook />
      </Sequence>
      <Sequence
        from={Math.round(3 * fps)}
        durationInFrames={Math.round(8 * fps)}
      >
        <DeviceShow />
      </Sequence>
      <Sequence
        from={Math.round(11 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <FrameLine />
      </Sequence>
      <Sequence
        from={Math.round(13 * fps)}
        durationInFrames={Math.round(1 * fps)}
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
        zoom={{ from: 1.04, to: 1.14 }}
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
        <KineticHeadline
          start={0.2}
          stagger={0.07}
          align="left"
          lines={[
            {
              text: "Her ekranda,",
              font: "serif",
              size: 124,
              color: C.cream,
              weight: 300,
            },
            {
              text: "aynı zarafet.",
              font: "serifSoft",
              italic: true,
              size: 124,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
      <Frame tone="dark" stage="REELS · 01" role="ÇOK CİHAZ" showTimecode={false} />
    </AbsoluteFill>
  );
};

const InvitationContent: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: "#1a1612",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <OffthreadVideo
      src={staticFile(HERO_VIDEOS.kadinerkek)}
      muted
      loop
      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.7))",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 30 * scale,
        right: 30 * scale,
        bottom: 30 * scale,
      }}
    >
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 11 * scale,
          letterSpacing: "0.32em",
          color: "rgba(245,240,230,0.78)",
          textTransform: "uppercase",
          marginBottom: 6 * scale,
        }}
      >
        DAVETİYEMİZ
      </div>
      <div
        style={{
          fontFamily: F.serif,
          fontWeight: 300,
          fontSize: 64 * scale,
          color: "#fff",
          letterSpacing: "-0.03em",
          lineHeight: 0.95,
        }}
      >
        Tuana
        <span
          style={{
            fontFamily: F.serifSoft,
            fontStyle: "italic",
            fontSize: 38 * scale,
            color: C.goldHi,
            margin: `0 ${10 * scale}px`,
          }}
        >
          &amp;
        </span>
        Ateş
      </div>
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 12 * scale,
          letterSpacing: "0.26em",
          color: "rgba(245,240,230,0.85)",
          marginTop: 10 * scale,
          textTransform: "uppercase",
        }}
      >
        26 EYLÜL 2026
      </div>
    </div>
  </div>
);

const PhoneFrame: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      width: 280,
      height: 580,
      background: "#0a0807",
      border: "8px solid #2a2520",
      borderRadius: 38,
      overflow: "hidden",
      boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
      position: "relative",
      ...style,
    }}
  >
    {/* notch */}
    <div
      style={{
        position: "absolute",
        top: 4,
        left: "50%",
        transform: "translateX(-50%)",
        width: 90,
        height: 22,
        background: "#000",
        borderRadius: 12,
        zIndex: 5,
      }}
    />
    <div style={{ width: "100%", height: "100%", borderRadius: 30, overflow: "hidden" }}>
      {children}
    </div>
  </div>
);

const TabletFrame: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      width: 460,
      height: 620,
      background: "#0a0807",
      border: "10px solid #2a2520",
      borderRadius: 28,
      overflow: "hidden",
      boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
      position: "relative",
      ...style,
    }}
  >
    <div style={{ width: "100%", height: "100%", borderRadius: 18, overflow: "hidden" }}>
      {children}
    </div>
  </div>
);

const LaptopFrame: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      width: 700,
      ...style,
    }}
  >
    <div
      style={{
        background: "#2a2520",
        borderRadius: "18px 18px 0 0",
        padding: 14,
        boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: 420,
          background: "#0a0807",
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
    <div
      style={{
        background: "#2a2520",
        height: 14,
        borderRadius: "0 0 14px 14px",
        margin: "0 -16px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          transform: "translateX(-50%)",
          width: 100,
          height: 6,
          background: "#0a0807",
          borderRadius: "0 0 6px 6px",
        }}
      />
    </div>
  </div>
);

const DeviceShow: React.FC = () => {
  const t = useSeconds();
  const phoneIn = tween({ t, start: 0.2, end: 1.2, from: 60, to: 0, ease: EASE.outBack });
  const phoneOp = tween({ t, start: 0.2, end: 1.0, from: 0, to: 1 });
  const tabletIn = tween({ t, start: 1.0, end: 2.0, from: 80, to: 0, ease: EASE.outBack });
  const tabletOp = tween({ t, start: 1.0, end: 1.8, from: 0, to: 1 });
  const laptopIn = tween({ t, start: 2.0, end: 3.2, from: 100, to: 0, ease: EASE.outBack });
  const laptopOp = tween({ t, start: 2.0, end: 3.0, from: 0, to: 1 });
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalBox}
        duration={8}
        zoom={{ from: 1.0, to: 1.06 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.75}
        tint="#000"
        tintOpacity={0.7}
        fadeIn={0.3}
        fadeOut={0.4}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 36,
        }}
      >
        {/* Laptop in back */}
        <div
          style={{
            opacity: laptopOp,
            transform: `translateY(${laptopIn}px)`,
          }}
        >
          <LaptopFrame>
            <InvitationContent scale={1.4} />
          </LaptopFrame>
        </div>

        {/* Phone + Tablet in front, side by side */}
        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "flex-end",
            marginTop: -260,
          }}
        >
          <div
            style={{
              opacity: phoneOp,
              transform: `translateY(${phoneIn}px)`,
            }}
          >
            <PhoneFrame>
              <InvitationContent scale={0.7} />
            </PhoneFrame>
          </div>
          <div
            style={{
              opacity: tabletOp,
              transform: `translateY(${tabletIn}px)`,
            }}
          >
            <TabletFrame>
              <InvitationContent scale={1.0} />
            </TabletFrame>
          </div>
        </div>
      </AbsoluteFill>

      {/* Top label */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "8%",
          right: "8%",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 16,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: C.goldHi,
          }}
        >
          ✦ TELEFON · TABLET · BİLGİSAYAR
        </div>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 12,
            letterSpacing: "0.28em",
            color: "rgba(245,240,230,0.55)",
            textTransform: "uppercase",
          }}
        >
          TEK URL
        </div>
      </div>
      <Frame tone="dark" stage="REELS · 02" role="CİHAZLAR" showTimecode={false} />
    </AbsoluteFill>
  );
};

const FrameLine: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <MediaBackdrop
        src={HERO_VIDEOS.kelebek}
        duration={2}
        zoom={{ from: 1.04, to: 1.1 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.65}
        fadeIn={0.3}
        fadeOut={0.3}
      />
      <AbsoluteFill
        style={{
          padding: "0 8%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <KineticHeadline
          start={0.0}
          stagger={0.06}
          align="center"
          lines={[
            {
              text: "Tek bağlantı,",
              font: "serif",
              size: 88,
              color: C.cream,
              weight: 300,
            },
            {
              text: "her tarayıcıda canlı.",
              font: "serifSoft",
              italic: true,
              size: 64,
              color: C.goldHi,
              weight: 400,
            },
          ]}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.bgDark }}>
      <MediaBackdrop
        src={HERO_VIDEOS.crystalBox}
        duration={1}
        zoom={{ from: 1.0, to: 1.04 }}
        pan={{ x: [0, 0], y: [0, 0] }}
        vignette={0.7}
        tint="#000"
        tintOpacity={0.7}
        fadeIn={0.2}
        fadeOut={0.2}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 14,
          textAlign: "center",
        }}
      >
        <BrandLockup
          start={0.0}
          size={260}
          tone="dark"
          cta="UYGUNDAVET.COM"
          url="instagram · uygundavetcom"
        />
        <div
          style={{
            fontFamily: F.script,
            fontStyle: "italic",
            fontSize: 24,
            color: C.goldHi,
            letterSpacing: "0.03em",
          }}
        >
          her tarayıcıda yaşayan bir davet.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
