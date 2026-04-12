import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Uygun Davet - Dijital Düğün Davetiyesi Platformu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #252224 0%, #1c1a1b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 80%, rgba(213, 209, 173, 0.1) 0%, transparent 50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 80% 20%, rgba(213, 209, 173, 0.08) 0%, transparent 40%)",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "60px",
          }}
        >
          {/* Brand name */}
          <div
            style={{
              color: "#d5d1ad",
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 24,
            }}
          >
            Uygun Davet
          </div>

          {/* Tagline */}
          <div
            style={{
              color: "white",
              fontSize: 36,
              fontWeight: 400,
              opacity: 0.9,
              marginBottom: 40,
            }}
          >
            Dijital Düğün Davetiyesi Platformu
          </div>

          {/* Features */}
          <div
            style={{
              display: "flex",
              gap: 32,
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: 20,
            }}
          >
            <span>LCV</span>
            <span>•</span>
            <span>Anı Defteri</span>
            <span>•</span>
            <span>QR Kod</span>
            <span>•</span>
            <span>Misafir Yönetimi</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #d5d1ad 0%, #a39d7a 100%)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
