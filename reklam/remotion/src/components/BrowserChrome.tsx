import React from "react";
import { F } from "../style/fonts";
import { C } from "../style/colors";

type Props = {
  url: string;
  width?: number | string;
  height?: number | string;
  children: React.ReactNode;
  variant?: "light" | "dark";
  showTabs?: boolean;
  tabTitle?: string;
};

// A tasteful browser window — Safari-ish chrome, no logos, just a URL bar.
// Wraps any inner content so scenes can show "this is a real website".
export const BrowserChrome: React.FC<Props> = ({
  url,
  width = "92%",
  height = "78%",
  children,
  variant = "light",
  showTabs = true,
  tabTitle = "Tuana & Ateş · Davetiyemiz",
}) => {
  const dark = variant === "dark";
  const bg = dark ? "#1a1612" : "#fff";
  const chromeBg = dark ? "#0e0c0a" : "#f3eee2";
  const ink = dark ? C.cream : C.ink;
  const mute = dark ? "rgba(245,240,230,0.6)" : C.mute;
  const line = dark ? "rgba(245,240,230,0.18)" : C.line;
  const tabBg = dark ? "#1a1612" : "#fff";

  return (
    <div
      style={{
        width,
        height,
        background: bg,
        border: `1px solid ${line}`,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow:
          "0 40px 100px rgba(0,0,0,0.45), 0 6px 20px rgba(0,0,0,0.18)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar with traffic lights */}
      <div
        style={{
          background: chromeBg,
          padding: "14px 18px 8px",
          borderBottom: `1px solid ${line}`,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div
              key={c}
              style={{
                width: 13,
                height: 13,
                borderRadius: "50%",
                background: c,
                opacity: 0.9,
              }}
            />
          ))}
          {showTabs ? (
            <div
              style={{
                marginLeft: 18,
                background: tabBg,
                border: `1px solid ${line}`,
                borderBottom: "none",
                borderRadius: "8px 8px 0 0",
                padding: "8px 16px",
                fontFamily: F.mono,
                fontSize: 13,
                color: ink,
                letterSpacing: "0.04em",
                maxWidth: 360,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {tabTitle}
            </div>
          ) : null}
        </div>
        {/* URL bar */}
        <div
          style={{
            background: dark ? "rgba(245,240,230,0.06)" : "#fff",
            border: `1px solid ${line}`,
            borderRadius: 10,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: F.mono,
            fontSize: 16,
            color: ink,
          }}
        >
          <span style={{ color: C.gold, fontSize: 14 }}>🔒</span>
          <span style={{ color: mute }}>https://</span>
          <span style={{ color: ink, fontWeight: 500 }}>{url}</span>
          <span style={{ flex: 1 }} />
          <span style={{ color: mute, fontSize: 13 }}>↻ ⌘ ⊕</span>
        </div>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {children}
      </div>
    </div>
  );
};
