#!/usr/bin/env node
// UygunDavet Reels Series — bulk generator.
// Concepts.json -> 26 hyperframes proje klasörü (05-30).
// Her klasör: package.json, hyperframes.json, meta.json, NARRATION.md, index.html, fonts/, assets/{logo,audio}.

import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SERIES_ROOT = resolve(__dirname, "..");
const REFERENCE_REEL = resolve(SERIES_ROOT, "01-stresli-vs-mutlu");
const CONCEPTS = JSON.parse(readFileSync(resolve(__dirname, "concepts.json"), "utf8"));

const PALETTE = {
  bgLight: "#f5f6f3",
  bgDark: "#252224",
  gold: "#c5a96a",
  goldSoft: "#d5c894",
  champagne: "#faf8f1",
  ink: "#252224",
  cream: "#d5d1ad",
  navy: "#555670",
};

function escapeHtml(s = "") {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function sceneInner(scene) {
  const t = escapeHtml(scene.title || "");
  const sub = escapeHtml(scene.sub || "");
  switch (scene.kind) {
    case "hero":
      return `
        <div class="scene-content scene-hero">
          <div class="hero-title">${t}</div>
          ${sub ? `<div class="hero-sub">${sub}</div>` : ""}
          <div class="hero-divider"></div>
        </div>`;
    case "theme":
      return `
        <div class="scene-content scene-theme theme-${scene.theme}">
          <img src="assets/envelopes/${scene.theme}.webp" alt="${scene.theme} zarf" class="theme-envelope" />
          <div class="theme-label">${escapeHtml(scene.label)}</div>
          <div class="theme-tone">${escapeHtml(scene.tone)}</div>
        </div>`;
    case "seal":
      return `
        <div class="scene-content scene-seal">
          <div class="seal-disc"><span>M&amp;O</span></div>
          <div class="seal-title">${t}</div>
          <div class="seal-sub">${sub}</div>
        </div>`;
    case "big-text":
      return `
        <div class="scene-content scene-big">
          <div class="big-title">${t}</div>
          ${sub ? `<div class="big-sub">${sub}</div>` : ""}
        </div>`;
    case "reveal":
      return `
        <div class="scene-content scene-reveal">
          <div class="reveal-line">${t}</div>
        </div>`;
    case "countdown":
    case "counter":
      return `
        <div class="scene-content scene-counter">
          <div class="counter-big">${escapeHtml(scene.big)}</div>
          ${scene.label ? `<div class="counter-label">${escapeHtml(scene.label)}</div>` : ""}
          ${scene.extra ? `<div class="counter-extra">${escapeHtml(scene.extra)}</div>` : ""}
        </div>`;
    case "phone":
      return `
        <div class="scene-content scene-phone">
          <div class="phone-frame">
            <div class="phone-screen">
              <div class="phone-title">${t}</div>
              <div class="phone-sub">${sub}</div>
            </div>
          </div>
        </div>`;
    case "map":
      return `
        <div class="scene-content scene-map">
          <div class="map-bg"><div class="map-pin"></div></div>
          <div class="map-title">${t}</div>
          <div class="map-sub">${sub}</div>
        </div>`;
    case "gallery":
      return `
        <div class="scene-content scene-gallery">
          <div class="gallery-grid">
            ${[1,2,3,4,5,6].map((i) => `<div class="gallery-cell g${i}"></div>`).join("")}
          </div>
          <div class="gallery-title">${t}</div>
          <div class="gallery-sub">${sub}</div>
        </div>`;
    case "timeline":
      return `
        <div class="scene-content scene-tl">
          <div class="tl-track"><div class="tl-dot"></div></div>
          <div class="tl-year">${escapeHtml(scene.sub || "")}</div>
          <div class="tl-event">${t}</div>
        </div>`;
    case "lang":
      return `
        <div class="scene-content scene-lang">
          <div class="lang-flag">${escapeHtml(scene.sub || "")}</div>
          <div class="lang-word">${t}</div>
        </div>`;
    case "qr":
      return `
        <div class="scene-content scene-qr">
          <div class="qr-block">
            ${Array.from({ length: 144 }).map((_, i) => `<span class="qr-px qr-px-${i % 7}"></span>`).join("")}
          </div>
          <div class="qr-title">${t}</div>
          <div class="qr-sub">${sub}</div>
        </div>`;
    case "step":
      return `
        <div class="scene-content scene-step">
          <div class="step-num">${escapeHtml(scene.step)}</div>
          <div class="step-title">${t}</div>
          <div class="step-sub">${sub}</div>
        </div>`;
    case "checklist":
      return `
        <div class="scene-content scene-check">
          <div class="check-title">Hepsi Dahil</div>
          <ul class="check-list">
            ${(scene.items || []).map((it) => `<li>✓ ${escapeHtml(it)}</li>`).join("")}
          </ul>
        </div>`;
    case "palette":
      return `
        <div class="scene-content scene-palette">
          <div class="palette-title">${t}</div>
          <div class="palette-row">
            ${(scene.colors || []).map((c) => `<div class="palette-swatch" style="background:${c}"></div>`).join("")}
          </div>
        </div>`;
    case "note":
      return `
        <div class="scene-content scene-note">
          <div class="note-card">
            <div class="note-from">${t}</div>
            <div class="note-quote">"${escapeHtml(scene.quote || "")}"</div>
          </div>
        </div>`;
    case "theme-detail":
      return `
        <div class="scene-content scene-theme-detail theme-${scene.theme}">
          <img src="assets/envelopes/${scene.theme}.webp" alt="${scene.theme}" class="td-envelope" />
          <div class="td-title">${t}</div>
          <div class="td-sub">${sub}</div>
        </div>`;
    case "envelope-open":
      return `
        <div class="scene-content scene-eopen theme-${scene.theme || "golden"}">
          <div class="eopen-stage">
            <img src="assets/envelopes/${scene.theme || "golden"}.webp" alt="${scene.theme || ""} zarf" class="eopen-envelope" />
            <div class="eopen-seal"><span>M&amp;O</span></div>
            <div class="eopen-tap">↑ dokun</div>
          </div>
          <div class="eopen-title">${t}</div>
          <div class="eopen-sub">${sub}</div>
        </div>`;
    case "seal-showcase":
      return `
        <div class="scene-content scene-sealshow">
          <div class="sealshow-grid">
            ${(scene.seals || ["crystal","garden","golden","grow","ocean","pearl","rose","sunset"]).map((th, idx) => `
              <div class="sealshow-cell sealshow-${th}">
                <div class="sealshow-disc"><span>M&amp;O</span></div>
                <div class="sealshow-name">${th.toUpperCase()}</div>
              </div>`).join("")}
          </div>
          <div class="sealshow-title">${t}</div>
        </div>`;
    case "site-scroll":
      return `
        <div class="scene-content scene-sitescroll">
          <div class="sitescroll-frame">
            <div class="sitescroll-phone">
              <div class="sitescroll-content sitescroll-${scene.theme || "golden"}">
                <div class="sitescroll-hero">
                  <div class="sitescroll-names">Melis &amp; Orhan</div>
                  <div class="sitescroll-tag">14 Haziran 2026</div>
                </div>
                <div class="sitescroll-section">${escapeHtml(scene.section || "Geri Sayım")}</div>
              </div>
            </div>
          </div>
          <div class="sitescroll-title">${t}</div>
          <div class="sitescroll-sub">${sub}</div>
        </div>`;
    case "month":
      return `
        <div class="scene-content scene-month">
          <div class="month-name">${t}</div>
          <div class="month-meta">${sub}</div>
        </div>`;
    case "closer":
      return `
        <div class="scene-content scene-closer">
          <div class="closer-title">${t}</div>
          <div class="closer-sub">${sub}</div>
        </div>`;
    default:
      return `<div class="scene-content"><div class="hero-title">${t}</div></div>`;
  }
}

function totalSceneDuration(scenes) {
  return scenes.reduce((acc, s) => acc + s.dur, 0);
}

function buildIndexHtml(concept) {
  const introDur = 1.5;
  const outroDur = 3.5;
  const scenesStart = introDur;
  let cursor = scenesStart;
  const scenes = concept.scenes.map((s) => {
    const start = cursor;
    cursor += s.dur;
    return { ...s, start };
  });
  const outroStart = cursor;
  const totalDur = outroStart + outroDur;
  const voDur = +(totalDur - introDur - 0.5).toFixed(2); // intro sonrası, outro CTA'sından önce
  const themeBgFor = (kind, bg) => bg || (kind === "hero" || kind === "big-text" ? PALETTE.bgLight : PALETTE.bgLight);

  return `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>${escapeHtml(concept.title)}</title>
    <link rel="stylesheet" href="fonts/fonts.css" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body {
        width: 1080px; height: 1920px; overflow: hidden;
        background: ${PALETTE.bgLight};
        font-family: "Space Grotesk", system-ui, sans-serif;
        color: ${PALETTE.ink};
      }
      #root { position: absolute; inset: 0; }
      .clip { position: absolute; inset: 0; opacity: 0; }
      .scene-content {
        position: absolute; inset: 0;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        padding: 160px 120px; gap: 32px;
        text-align: center;
      }
      /* Intro — frame 0 IS the Instagram thumbnail. opacity:1 overrides .clip's default opacity:0 so the very first frame is fully painted (no blank fade-in).
         Logo is always visible. Envelope (when introTheme set) sits alongside as accent — never replaces the logo. Wordmark uses the brand PNG ("UygunDavet.com" script), not text. */
      .intro { background: ${PALETTE.bgLight}; opacity: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px; padding: 0 80px; }
      .intro-marks { display: flex; align-items: center; justify-content: center; gap: 40px; }
      .intro-logo { width: 200px; height: 200px; object-fit: contain; filter: drop-shadow(0 14px 36px rgba(217, 138, 90, 0.28)); }
      .intro-envelope { width: 170px; height: auto; object-fit: contain; filter: drop-shadow(0 14px 40px rgba(197, 169, 106, 0.34)); }
      .intro-eyebrow { font-family: "Space Grotesk", sans-serif; font-weight: 600; font-size: 22px; letter-spacing: 0.32em; text-transform: uppercase; color: ${PALETTE.gold}; }
      .intro-wordmark-img { width: 460px; height: auto; object-fit: contain; }
      .intro-headline { font-family: "Merienda", "Times New Roman", serif; font-weight: 700; font-size: 60px; line-height: 1.14; color: ${PALETTE.ink}; max-width: 880px; text-align: center; margin-top: 4px; }
      /* Outro */
      .outro { background: ${PALETTE.bgLight}; display: flex; align-items: center; justify-content: center; }
      .outro-frame { position: relative; width: 940px; height: 1720px; background: ${PALETTE.champagne};
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 28px; padding: 120px 80px; border: 3px solid ${PALETTE.gold}; text-align: center; }
      .outro-frame::before { content: ""; position: absolute; inset: 18px; border: 1.5px solid ${PALETTE.goldSoft}; pointer-events: none; }
      .frame-corner { position: absolute; font-family: "Merienda", serif; color: ${PALETTE.gold}; font-size: 64px; line-height: 1; z-index: 2; }
      .frame-corner.tl { top: 38px; left: 50px; }
      .frame-corner.tr { top: 38px; right: 50px; transform: scaleX(-1); }
      .frame-corner.bl { bottom: 38px; left: 50px; transform: scaleY(-1); }
      .frame-corner.br { bottom: 38px; right: 50px; transform: scale(-1, -1); }
      .frame-divider { font-family: "Merienda", serif; font-size: 38px; color: ${PALETTE.gold}; letter-spacing: 0.6em; line-height: 1; opacity: 0.85; }
      .outro-logo { width: 240px; height: 240px; object-fit: contain; filter: drop-shadow(0 18px 48px rgba(217, 138, 90, 0.28)); }
      .outro-wordmark { width: 620px; object-fit: contain; }
      .outro-tag { font-family: "Merienda", cursive; font-weight: 500; font-size: 52px; line-height: 1.3; color: ${PALETTE.navy}; max-width: 760px; }
      .outro-cta { font-family: "Orbitron", sans-serif; font-weight: 700; font-size: 46px; letter-spacing: 0.28em; text-transform: uppercase; color: ${PALETTE.ink}; background: ${PALETTE.goldSoft}; padding: 22px 56px; border-radius: 999px; box-shadow: 0 6px 20px -8px rgba(197, 169, 106, 0.5); }
      /* Hero */
      .scene-hero { background: var(--bg, ${PALETTE.bgDark}); color: var(--fg, ${PALETTE.cream}); }
      .hero-title { font-family: "Orbitron", sans-serif; font-weight: 800; font-size: 180px; letter-spacing: 0.04em; line-height: 0.95; }
      .hero-sub { font-family: "Merienda", cursive; font-weight: 500; font-size: 64px; line-height: 1.2; opacity: 0.85; }
      .hero-divider { width: 220px; height: 3px; background: ${PALETTE.gold}; opacity: 0.7; }
      /* Big text */
      .scene-big { background: var(--bg, ${PALETTE.bgDark}); color: var(--fg, ${PALETTE.cream}); }
      .big-title { font-family: "Orbitron", sans-serif; font-weight: 800; font-size: 200px; letter-spacing: 0.05em; line-height: 0.95; }
      .big-sub { font-family: "Merienda", cursive; font-weight: 500; font-size: 56px; }
      /* Reveal */
      .scene-reveal { background: ${PALETTE.champagne}; color: ${PALETTE.ink}; padding: 200px 120px; }
      .reveal-line { font-family: "Merienda", cursive; font-weight: 500; font-size: 96px; line-height: 1.25; max-width: 880px; color: ${PALETTE.navy}; }
      /* Theme */
      .scene-theme { color: ${PALETTE.cream}; }
      .theme-crystal { background: radial-gradient(ellipse at 50% 30%, #1e2540, #060814); }
      .theme-garden  { background: radial-gradient(ellipse at 50% 30%, #2a4232, #0e1a14); }
      .theme-golden  { background: radial-gradient(ellipse at 50% 30%, #3a2c14, #14100a); }
      .theme-grow    { background: radial-gradient(ellipse at 50% 30%, #2b3022, #11140e); }
      .theme-ocean   { background: radial-gradient(ellipse at 50% 30%, #14323e, #060f18); }
      .theme-pearl   { background: radial-gradient(ellipse at 50% 30%, #ddd6c8, #998c79); color:${PALETTE.ink}; }
      .theme-rose    { background: radial-gradient(ellipse at 50% 30%, #a04638, #3a1810); }
      .theme-sunset  { background: radial-gradient(ellipse at 50% 30%, #c45f3a, #2c0e08); }
      .theme-envelope { width: 600px; height: auto; max-height: 900px; object-fit: contain; filter: drop-shadow(0 40px 80px rgba(0,0,0,0.45)); border-radius: 12px; }
      .theme-label { font-family: "Orbitron", sans-serif; font-weight: 700; font-size: 110px; letter-spacing: 0.2em; }
      .theme-tone { font-family: "Merienda", cursive; font-size: 48px; opacity: 0.85; }
      /* Theme detail (D hat) */
      .scene-theme-detail { color: ${PALETTE.cream}; }
      .td-envelope { width: 540px; height: auto; max-height: 820px; object-fit: contain; filter: drop-shadow(0 40px 80px rgba(0,0,0,0.45)); border-radius: 10px; }
      .td-title { font-family: "Orbitron", sans-serif; font-weight: 700; font-size: 96px; letter-spacing: 0.06em; }
      .td-sub { font-family: "Merienda", cursive; font-size: 52px; opacity: 0.85; }
      /* Envelope open (signature) */
      .scene-eopen { color: ${PALETTE.goldSoft}; }
      .scene-eopen.theme-crystal { background: radial-gradient(ellipse at center, #1e2540, #060814); }
      .scene-eopen.theme-garden  { background: radial-gradient(ellipse at center, #2a4232, #0e1a14); }
      .scene-eopen.theme-golden  { background: radial-gradient(ellipse at center, #3a2c14, #14100a); }
      .scene-eopen.theme-grow    { background: radial-gradient(ellipse at center, #2b3022, #11140e); }
      .scene-eopen.theme-ocean   { background: radial-gradient(ellipse at center, #14323e, #060f18); }
      .scene-eopen.theme-pearl   { background: radial-gradient(ellipse at center, #ddd6c8, #998c79); color: ${PALETTE.ink}; }
      .scene-eopen.theme-rose    { background: radial-gradient(ellipse at center, #a04638, #3a1810); }
      .scene-eopen.theme-sunset  { background: radial-gradient(ellipse at center, #c45f3a, #2c0e08); }
      .eopen-stage { position: relative; width: 700px; height: 990px; display: flex; align-items: center; justify-content: center; }
      .eopen-envelope { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 60px 100px rgba(0,0,0,0.55)); border-radius: 12px; }
      .eopen-seal { position: absolute; top: 50%; left: 50%; width: 180px; height: 180px; border-radius: 50%; background: radial-gradient(circle at 38% 32%, #ffdf8a, #f4a900 65%, #8a5e08); transform: translate(-50%,-50%); display: flex; align-items: center; justify-content: center; box-shadow: 0 12px 30px rgba(0,0,0,0.55), inset 0 3px 8px rgba(255,255,255,0.5); }
      .eopen-seal span { font-family: "Merienda", serif; font-style: italic; font-size: 56px; color: rgba(45,38,32,0.95); }
      .eopen-tap { font-family: "Space Grotesk", sans-serif; font-size: 28px; letter-spacing: 0.3em; text-transform: uppercase; opacity: 0.7; }
      .eopen-title { font-family: "Orbitron", sans-serif; font-weight: 700; font-size: 80px; letter-spacing: 0.06em; }
      .eopen-sub { font-family: "Merienda", cursive; font-size: 42px; opacity: 0.85; }
      /* Seal showcase grid */
      .scene-sealshow { background: ${PALETTE.bgDark}; color: ${PALETTE.goldSoft}; padding: 120px 80px; }
      .sealshow-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; width: 100%; max-width: 920px; }
      .sealshow-cell { display: flex; flex-direction: column; align-items: center; gap: 16px; }
      .sealshow-disc { width: 180px; height: 180px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 14px 30px rgba(0,0,0,0.55), inset 0 3px 8px rgba(255,255,255,0.35); }
      .sealshow-disc span { font-family: "Merienda", serif; font-style: italic; font-size: 58px; }
      .sealshow-crystal .sealshow-disc { background: radial-gradient(circle at 38% 32%, #e0e8ff, #6a86c8 65%, #2a3a6a); }
      .sealshow-crystal .sealshow-disc span { color: rgba(10,16,32,0.9); }
      .sealshow-garden .sealshow-disc  { background: radial-gradient(circle at 38% 32%, #d6f0c0, #6fa848 65%, #2c5828); }
      .sealshow-garden .sealshow-disc span { color: rgba(12,30,16,0.9); }
      .sealshow-golden .sealshow-disc  { background: radial-gradient(circle at 38% 32%, #ffdf8a, #f4a900 65%, #8a5e08); }
      .sealshow-golden .sealshow-disc span { color: rgba(45,38,32,0.95); }
      .sealshow-grow .sealshow-disc    { background: radial-gradient(circle at 38% 32%, #f5efd6, #d5d1ad 65%, #9a9577); }
      .sealshow-grow .sealshow-disc span { color: rgba(40,48,32,0.85); }
      .sealshow-ocean .sealshow-disc   { background: radial-gradient(circle at 38% 32%, #e0f4f3, #a8dadc 60%, #4a8c8e); }
      .sealshow-ocean .sealshow-disc span { color: rgba(13,22,32,0.9); }
      .sealshow-pearl .sealshow-disc   { background: radial-gradient(circle at 38% 32%, #ffffff, #ece6da 60%, #998c79); }
      .sealshow-pearl .sealshow-disc span { color: rgba(60,52,40,0.95); }
      .sealshow-rose .sealshow-disc    { background: radial-gradient(circle at 38% 32%, #f5d4c8, #d97c68 60%, #6a2820); }
      .sealshow-rose .sealshow-disc span { color: rgba(60,20,16,0.95); }
      .sealshow-sunset .sealshow-disc  { background: radial-gradient(circle at 38% 32%, #fadda6, #e08840 60%, #6a2c10); }
      .sealshow-sunset .sealshow-disc span { color: rgba(60,20,8,0.95); }
      .sealshow-name { font-family: "Orbitron", sans-serif; font-weight: 700; font-size: 24px; letter-spacing: 0.24em; opacity: 0.85; }
      .sealshow-title { font-family: "Orbitron", sans-serif; font-weight: 700; font-size: 72px; letter-spacing: 0.08em; color: ${PALETTE.cream}; margin-top: 40px; }
      /* Site scroll (mobil cihazda davet sayfası) */
      .scene-sitescroll { background: ${PALETTE.bgLight}; }
      .sitescroll-frame { width: 520px; height: 1100px; border-radius: 64px; background: ${PALETTE.bgDark}; padding: 18px; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.4); }
      .sitescroll-phone { width: 100%; height: 100%; border-radius: 48px; overflow: hidden; position: relative; }
      .sitescroll-content { position: absolute; inset: 0; display: flex; flex-direction: column; }
      .sitescroll-golden { background: linear-gradient(180deg, #3a2c14 0%, #1a1612 100%); color: ${PALETTE.goldSoft}; }
      .sitescroll-rose   { background: linear-gradient(180deg, #a04638 0%, #3a1810 100%); color: #fae6d3; }
      .sitescroll-ocean  { background: linear-gradient(180deg, #14323e 0%, #060f18 100%); color: #a8dadc; }
      .sitescroll-garden { background: linear-gradient(180deg, #2a4232 0%, #0e1a14 100%); color: #d6f0c0; }
      .sitescroll-crystal{ background: linear-gradient(180deg, #1e2540 0%, #060814 100%); color: #e0e8ff; }
      .sitescroll-sunset { background: linear-gradient(180deg, #c45f3a 0%, #2c0e08 100%); color: #fadda6; }
      .sitescroll-pearl  { background: linear-gradient(180deg, #ddd6c8 0%, #b8ad99 100%); color: ${PALETTE.ink}; }
      .sitescroll-grow   { background: linear-gradient(180deg, #2b3022 0%, #11140e 100%); color: ${PALETTE.cream}; }
      .sitescroll-hero { padding: 120px 40px 40px; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; }
      .sitescroll-names { font-family: "Merienda", cursive; font-size: 56px; line-height: 1.1; text-align: center; }
      .sitescroll-tag { font-family: "Orbitron", sans-serif; font-size: 18px; letter-spacing: 0.36em; opacity: 0.8; }
      .sitescroll-section { padding: 32px 40px; font-family: "Orbitron", sans-serif; font-size: 20px; letter-spacing: 0.3em; text-transform: uppercase; text-align: center; border-top: 1px solid currentColor; opacity: 0.75; }
      .sitescroll-title { font-family: "Orbitron", sans-serif; font-weight: 700; font-size: 64px; letter-spacing: 0.06em; color: ${PALETTE.ink}; }
      .sitescroll-sub { font-family: "Merienda", cursive; font-size: 40px; color: ${PALETTE.navy}; }
      /* Seal */
      .scene-seal { background: radial-gradient(ellipse at center, #1f1a14, #0a0806); color: ${PALETTE.goldSoft}; }
      .seal-disc { width: 380px; height: 380px; border-radius: 50%; background: radial-gradient(circle at 38% 32%, #ffdf8a, #f4a900 65%, #8a5e08); display: flex; align-items: center; justify-content: center; box-shadow: 0 20px 60px rgba(244,169,0,0.4), inset 0 4px 12px rgba(255,255,255,0.4); }
      .seal-disc span { font-family: "Merienda", serif; font-style: italic; font-size: 96px; color: rgba(45,38,32,0.95); }
      .seal-title { font-family: "Orbitron", sans-serif; font-weight: 700; font-size: 84px; letter-spacing: 0.08em; }
      .seal-sub { font-family: "Merienda", cursive; font-size: 44px; opacity: 0.8; }
      /* Counter */
      .scene-counter { background: ${PALETTE.bgDark}; color: ${PALETTE.cream}; }
      .counter-big { font-family: "Orbitron", sans-serif; font-weight: 800; font-size: 360px; line-height: 0.9; font-variant-numeric: tabular-nums; color: ${PALETTE.goldSoft}; }
      .counter-label { font-family: "Orbitron", sans-serif; font-weight: 700; font-size: 72px; letter-spacing: 0.32em; }
      .counter-extra { font-family: "Space Grotesk", sans-serif; font-size: 38px; opacity: 0.7; letter-spacing: 0.16em; text-transform: uppercase; }
      /* Phone */
      .scene-phone { background: ${PALETTE.bgLight}; }
      .phone-frame { width: 520px; height: 1100px; border-radius: 64px; background: ${PALETTE.bgDark}; padding: 18px; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.4); }
      .phone-screen { width: 100%; height: 100%; border-radius: 48px; background: ${PALETTE.champagne}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; padding: 80px 40px; }
      .phone-title { font-family: "Orbitron", sans-serif; font-weight: 700; font-size: 64px; letter-spacing: 0.06em; color: ${PALETTE.ink}; }
      .phone-sub { font-family: "Merienda", cursive; font-size: 38px; color: ${PALETTE.navy}; }
      /* Map */
      .scene-map { background: ${PALETTE.bgLight}; }
      .map-bg { width: 760px; height: 800px; border-radius: 32px; background: linear-gradient(135deg, #e6ebe2 0%, #dde4d6 100%); position: relative; box-shadow: 0 30px 80px -20px rgba(0,0,0,0.18); border: 2px solid rgba(85,86,112,0.1); }
      .map-pin { width: 80px; height: 80px; border-radius: 50% 50% 50% 0; background: ${PALETTE.gold}; position: absolute; top: 40%; left: 50%; transform: translate(-50%, -100%) rotate(-45deg); box-shadow: 0 14px 30px rgba(197,169,106,0.5); }
      .map-pin::after { content: ""; position: absolute; inset: 22px; border-radius: 50%; background: ${PALETTE.bgLight}; }
      .map-title { font-family: "Orbitron", sans-serif; font-weight: 700; font-size: 72px; letter-spacing: 0.06em; color: ${PALETTE.ink}; }
      .map-sub { font-family: "Merienda", cursive; font-size: 44px; color: ${PALETTE.navy}; }
      /* Gallery */
      .scene-gallery { background: ${PALETTE.bgLight}; }
      .gallery-grid { width: 800px; height: 1000px; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); gap: 16px; }
      .gallery-cell { border-radius: 18px; background: linear-gradient(135deg, #e5d2c0, #c5a96a); box-shadow: 0 14px 30px -10px rgba(0,0,0,0.25); }
      .gallery-cell.g1 { grid-row: span 2; }
      .gallery-cell.g4 { grid-column: span 2; }
      .gallery-title { font-family: "Orbitron", sans-serif; font-weight: 700; font-size: 64px; letter-spacing: 0.06em; }
      .gallery-sub { font-family: "Merienda", cursive; font-size: 40px; color: ${PALETTE.navy}; }
      /* Timeline */
      .scene-tl { background: ${PALETTE.bgLight}; color: ${PALETTE.ink}; }
      .tl-track { width: 800px; height: 4px; background: ${PALETTE.goldSoft}; position: relative; }
      .tl-dot { width: 36px; height: 36px; border-radius: 50%; background: ${PALETTE.gold}; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); box-shadow: 0 0 0 12px rgba(197,169,106,0.18); }
      .tl-year { font-family: "Space Grotesk", sans-serif; font-weight: 700; font-size: 48px; letter-spacing: 0.24em; color: ${PALETTE.navy}; }
      .tl-event { font-family: "Merienda", cursive; font-size: 88px; color: ${PALETTE.ink}; }
      /* Lang */
      .scene-lang { background: ${PALETTE.bgDark}; color: ${PALETTE.cream}; }
      .lang-flag { font-family: "Orbitron", sans-serif; font-weight: 700; font-size: 60px; letter-spacing: 0.4em; color: ${PALETTE.goldSoft}; }
      .lang-word { font-family: "Merienda", cursive; font-size: 200px; line-height: 1; }
      /* QR */
      .scene-qr { background: ${PALETTE.bgLight}; }
      .qr-block { width: 600px; height: 600px; display: grid; grid-template-columns: repeat(12, 1fr); grid-template-rows: repeat(12, 1fr); gap: 4px; background: ${PALETTE.bgDark}; padding: 24px; border-radius: 24px; }
      .qr-px { background: ${PALETTE.bgLight}; }
      .qr-px-1, .qr-px-3, .qr-px-5 { background: ${PALETTE.bgDark}; }
      .qr-title { font-family: "Orbitron", sans-serif; font-weight: 700; font-size: 72px; letter-spacing: 0.08em; color: ${PALETTE.ink}; }
      .qr-sub { font-family: "Merienda", cursive; font-size: 42px; color: ${PALETTE.navy}; }
      /* Step */
      .scene-step { background: ${PALETTE.bgLight}; }
      .step-num { width: 200px; height: 200px; border-radius: 50%; background: ${PALETTE.bgDark}; color: ${PALETTE.goldSoft}; font-family: "Orbitron", sans-serif; font-weight: 800; font-size: 120px; display: flex; align-items: center; justify-content: center; box-shadow: 0 20px 50px -10px rgba(0,0,0,0.3); }
      .step-title { font-family: "Orbitron", sans-serif; font-weight: 700; font-size: 96px; letter-spacing: 0.04em; color: ${PALETTE.ink}; }
      .step-sub { font-family: "Merienda", cursive; font-size: 48px; color: ${PALETTE.navy}; }
      /* Checklist */
      .scene-check { background: ${PALETTE.bgLight}; align-items: flex-start; }
      .check-title { font-family: "Orbitron", sans-serif; font-weight: 700; font-size: 72px; letter-spacing: 0.08em; color: ${PALETTE.ink}; width: 100%; text-align: center; }
      .check-list { list-style: none; padding: 0; font-family: "Space Grotesk", sans-serif; font-size: 64px; color: ${PALETTE.ink}; width: 100%; max-width: 780px; }
      .check-list li { padding: 22px 0; border-bottom: 1px solid rgba(85,86,112,0.18); }
      /* Palette */
      .scene-palette { background: ${PALETTE.bgLight}; }
      .palette-title { font-family: "Orbitron", sans-serif; font-weight: 700; font-size: 72px; letter-spacing: 0.06em; color: ${PALETTE.ink}; }
      .palette-row { display: flex; gap: 24px; }
      .palette-swatch { width: 140px; height: 280px; border-radius: 18px; box-shadow: 0 14px 40px -10px rgba(0,0,0,0.18); }
      /* Note */
      .scene-note { background: ${PALETTE.bgLight}; }
      .note-card { width: 800px; padding: 80px 60px; background: ${PALETTE.champagne}; border-radius: 32px; box-shadow: 0 30px 80px -20px rgba(0,0,0,0.2); border: 1px solid rgba(197,169,106,0.3); display: flex; flex-direction: column; gap: 32px; }
      .note-from { font-family: "Orbitron", sans-serif; font-weight: 700; font-size: 44px; letter-spacing: 0.18em; color: ${PALETTE.gold}; }
      .note-quote { font-family: "Merienda", cursive; font-size: 64px; line-height: 1.3; color: ${PALETTE.ink}; }
      /* Month */
      .scene-month { background: linear-gradient(180deg, #f5d4c8 0%, #f5b58a 100%); color: ${PALETTE.ink}; }
      .month-name { font-family: "Orbitron", sans-serif; font-weight: 800; font-size: 200px; letter-spacing: 0.08em; }
      .month-meta { font-family: "Merienda", cursive; font-size: 56px; opacity: 0.8; }
      /* Closer */
      .scene-closer { background: ${PALETTE.bgDark}; color: ${PALETTE.cream}; }
      .closer-title { font-family: "Orbitron", sans-serif; font-weight: 700; font-size: 100px; letter-spacing: 0.08em; }
      .closer-sub { font-family: "Merienda", cursive; font-size: 52px; color: ${PALETTE.goldSoft}; }
      /* Grain */
      .grain {
        position: absolute; inset: 0; pointer-events: none; opacity: 0.06;
        mix-blend-mode: overlay; z-index: 50;
        background:
          radial-gradient(ellipse at 12% 18%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 40%),
          radial-gradient(ellipse at 85% 78%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 45%);
      }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${totalDur}" data-width="1080" data-height="1920">

      <!-- Intro: Instagram thumbnail kare. Logo her zaman görünür; opsiyonel zarf yanında accent. Wordmark PNG (script). -->
      <div id="intro" class="clip intro" data-start="0" data-duration="${introDur}" data-track-index="0">
        <div class="intro-marks">
          <img src="assets/logo/logo.png" alt="Uygun Davet logo" class="intro-logo" />
          ${concept.introTheme ? `<img src="assets/envelopes/${concept.introTheme}.webp" alt="" class="intro-envelope" />` : ``}
        </div>
        <div class="intro-eyebrow">Dijital Web Davetiyesi</div>
        <img src="assets/logo/uygundavet-wordmark.png" alt="UygunDavet.com" class="intro-wordmark-img" />
        <div class="intro-headline">${escapeHtml(concept.title)}</div>
      </div>

${scenes.map((s, i) => {
  const styleVars = [];
  if (s.bg) styleVars.push(`--bg:${s.bg}`);
  if (s.fg) styleVars.push(`--fg:${s.fg}`);
  const styleAttr = styleVars.length ? ` style="${styleVars.join(";")}"` : "";
  return `      <div id="${s.id}" class="clip" data-start="${s.start}" data-duration="${s.dur}" data-track-index="1"${styleAttr}>${sceneInner(s)}</div>`;
}).join("\n")}

      <!-- Outro -->
      <div id="outro" class="clip outro" data-start="${outroStart}" data-duration="${outroDur}" data-track-index="0">
        <div class="outro-frame">
          <span class="frame-corner tl">❦</span>
          <span class="frame-corner tr">❦</span>
          <span class="frame-corner bl">❦</span>
          <span class="frame-corner br">❦</span>
          <div class="frame-divider">✦ ⚜ ✦</div>
          <img src="assets/logo/logo.png" alt="logo" class="outro-logo" />
          <img src="assets/logo/uygundavet-wordmark.png" alt="Uygun Davet" class="outro-wordmark" />
          <div class="outro-tag">Düğününün davetiyesi<br/>5 dakikada hazır.</div>
          <div class="outro-cta">Hemen Dene</div>
          <div class="frame-divider">✦ ⚜ ✦</div>
        </div>
      </div>

      <!-- Music bed (jazz, CC-BY) -->
      <audio id="music" class="clip" src="assets/audio/jazz_bed.mp3" data-start="0" data-duration="${totalDur}" data-track-index="3" data-volume="0.45" preload="auto"></audio>

      <div class="grain"></div>
    </div>

    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });

      // Intro — frame 0 fully painted. No opacity fades anywhere (CSS opacity:1).
      // Children only have motion (Y/scale) entrances; all stay visible at t=0.
      gsap.set("#intro", { opacity: 1 });
      tl.from("#intro .intro-logo, #intro .intro-envelope", { scale: 0.92, duration: 0.5, ease: "back.out(1.6)", stagger: 0.06 }, 0.08);
      tl.from("#intro .intro-eyebrow", { y: 10, duration: 0.35, ease: "power3.out" }, 0.22);
      tl.from("#intro .intro-wordmark-img", { y: 14, duration: 0.4, ease: "power3.out" }, 0.3);
      tl.from("#intro .intro-headline", { y: 18, duration: 0.45, ease: "power3.out" }, 0.42);

      // Scenes
${scenes.map((s, i) => {
  const fadeIn = `tl.fromTo("#${s.id}", { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" }, ${s.start});`;
  const isLast = i === scenes.length - 1;
  const entrances = generateEntrances(s);
  return `      ${fadeIn}\n${entrances.map((e) => `      ${e}`).join("\n")}`;
}).join("\n\n")}

      // Hide previous scenes precisely at next scene start (no exit anim — transition is the fade in)
${scenes.map((s, i) => {
  const nextStart = (i < scenes.length - 1) ? scenes[i + 1].start : outroStart;
  return `      tl.set("#${s.id}", { opacity: 0 }, ${nextStart});`;
}).join("\n")}

      // Outro
      tl.fromTo("#outro", { opacity: 0 }, { opacity: 1, duration: 0.4 }, ${outroStart});
      tl.from("#outro .outro-frame",    { scale: 0.92, opacity: 0, duration: 0.55, ease: "power2.out" }, ${outroStart + 0.05});
      tl.from("#outro .frame-corner",   { scale: 0, opacity: 0, duration: 0.4, ease: "back.out(2)", stagger: 0.05 }, ${outroStart + 0.35});
      tl.from("#outro .frame-divider",  { scaleX: 0, opacity: 0, duration: 0.4, ease: "power2.out", stagger: 0.05 }, ${outroStart + 0.45});
      tl.from("#outro .outro-logo",     { scale: 0.85, opacity: 0, duration: 0.5, ease: "back.out(1.6)" }, ${outroStart + 0.55});
      tl.from("#outro .outro-wordmark", { y: 20, opacity: 0, duration: 0.45, ease: "power2.out" }, ${outroStart + 0.75});
      tl.from("#outro .outro-tag",      { y: 20, opacity: 0, duration: 0.45, ease: "power2.out" }, ${outroStart + 0.95});
      tl.from("#outro .outro-cta",      { y: 20, opacity: 0, duration: 0.45, ease: "back.out(1.4)" }, ${outroStart + 1.15});

      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;
}

function generateEntrances(s) {
  const t = s.start;
  // Stagger: pick targets per kind; use varied eases.
  const tw = (sel, fromVars, dur, ease, offset) =>
    `tl.from("#${s.id} ${sel}", { ${Object.entries(fromVars).map(([k, v]) => `${k}: ${typeof v === "string" ? `"${v}"` : v}`).join(", ")}, duration: ${dur}, ease: "${ease}" }, ${(t + offset).toFixed(3)});`;
  switch (s.kind) {
    case "hero":
      return [
        tw(".hero-title", { y: 60, opacity: 0 }, 0.7, "power3.out", 0.15),
        tw(".hero-sub", { y: 40, opacity: 0 }, 0.55, "expo.out", 0.35),
        tw(".hero-divider", { scaleX: 0, opacity: 0 }, 0.5, "power2.inOut", 0.55),
      ];
    case "big-text":
      return [
        tw(".big-title", { scale: 0.92, opacity: 0 }, 0.6, "back.out(1.6)", 0.15),
        tw(".big-sub", { y: 30, opacity: 0 }, 0.5, "power3.out", 0.4),
      ];
    case "reveal":
      return [
        tw(".reveal-line", { y: 50, opacity: 0 }, 0.85, "power3.out", 0.2),
      ];
    case "theme":
      return [
        tw(".theme-envelope", { scale: 0.85, opacity: 0, y: 40 }, 0.75, "back.out(1.4)", 0.15),
        tw(".theme-label", { y: 30, opacity: 0 }, 0.5, "power3.out", 0.45),
        tw(".theme-tone", { y: 20, opacity: 0 }, 0.45, "expo.out", 0.65),
      ];
    case "theme-detail":
      return [
        tw(".td-envelope", { scale: 0.88, opacity: 0, rotation: -3 }, 0.75, "back.out(1.4)", 0.15),
        tw(".td-title", { y: 40, opacity: 0 }, 0.55, "power3.out", 0.5),
        tw(".td-sub", { y: 25, opacity: 0 }, 0.45, "expo.out", 0.7),
      ];
    case "envelope-open":
      return [
        tw(".eopen-envelope", { scale: 0.85, opacity: 0, y: 50 }, 0.8, "back.out(1.4)", 0.15),
        tw(".eopen-seal", { scale: 0.5, opacity: 0, rotation: -25 }, 0.7, "back.out(1.8)", 0.55),
        tw(".eopen-tap", { y: 20, opacity: 0 }, 0.45, "expo.out", 1.0),
        tw(".eopen-title", { y: 40, opacity: 0 }, 0.6, "power3.out", 1.2),
        tw(".eopen-sub", { y: 25, opacity: 0 }, 0.5, "expo.out", 1.45),
      ];
    case "seal-showcase":
      return [
        tw(".sealshow-cell", { scale: 0.5, opacity: 0, rotation: -10, stagger: 0.08 }, 0.55, "back.out(1.6)", 0.15),
        tw(".sealshow-title", { y: 30, opacity: 0 }, 0.5, "power3.out", 1.0),
      ];
    case "site-scroll":
      return [
        tw(".sitescroll-frame", { y: 80, opacity: 0, scale: 0.94 }, 0.75, "power3.out", 0.15),
        tw(".sitescroll-names", { y: 20, opacity: 0 }, 0.5, "expo.out", 0.55),
        tw(".sitescroll-tag", { y: 15, opacity: 0 }, 0.45, "power2.out", 0.7),
        tw(".sitescroll-section", { y: 15, opacity: 0 }, 0.45, "power2.out", 0.85),
        tw(".sitescroll-title", { y: 30, opacity: 0 }, 0.5, "power3.out", 1.05),
        tw(".sitescroll-sub", { y: 20, opacity: 0 }, 0.4, "expo.out", 1.25),
      ];
    case "seal":
      return [
        tw(".seal-disc", { scale: 0.6, opacity: 0, rotation: -30 }, 0.85, "back.out(1.5)", 0.2),
        tw(".seal-title", { y: 30, opacity: 0 }, 0.5, "power3.out", 0.8),
        tw(".seal-sub", { y: 20, opacity: 0 }, 0.45, "expo.out", 1.0),
      ];
    case "counter":
    case "countdown":
      return [
        tw(".counter-big", { scale: 0.85, opacity: 0 }, 0.6, "back.out(1.6)", 0.15),
        tw(".counter-label", { y: 30, opacity: 0 }, 0.5, "power3.out", 0.45),
        tw(".counter-extra", { y: 20, opacity: 0 }, 0.4, "expo.out", 0.65),
      ];
    case "phone":
      return [
        tw(".phone-frame", { y: 80, opacity: 0, scale: 0.92 }, 0.7, "power3.out", 0.15),
        tw(".phone-title", { y: 20, opacity: 0 }, 0.5, "expo.out", 0.5),
        tw(".phone-sub", { y: 15, opacity: 0 }, 0.45, "power2.out", 0.7),
      ];
    case "map":
      return [
        tw(".map-bg", { scale: 0.92, opacity: 0 }, 0.6, "power3.out", 0.15),
        tw(".map-pin", { y: -100, opacity: 0 }, 0.5, "back.out(1.8)", 0.45),
        tw(".map-title", { y: 30, opacity: 0 }, 0.45, "power3.out", 0.7),
        tw(".map-sub", { y: 20, opacity: 0 }, 0.4, "expo.out", 0.85),
      ];
    case "gallery":
      return [
        tw(".gallery-cell", { scale: 0.6, opacity: 0, stagger: 0.06 }, 0.55, "back.out(1.6)", 0.15),
        tw(".gallery-title", { y: 30, opacity: 0 }, 0.5, "power3.out", 0.6),
        tw(".gallery-sub", { y: 20, opacity: 0 }, 0.4, "expo.out", 0.8),
      ];
    case "timeline":
      return [
        tw(".tl-track", { scaleX: 0, opacity: 0 }, 0.6, "power2.inOut", 0.15),
        tw(".tl-dot", { scale: 0, opacity: 0 }, 0.5, "back.out(2)", 0.4),
        tw(".tl-year", { y: 30, opacity: 0 }, 0.45, "power3.out", 0.55),
        tw(".tl-event", { y: 40, opacity: 0 }, 0.5, "expo.out", 0.7),
      ];
    case "lang":
      return [
        tw(".lang-flag", { y: -30, opacity: 0 }, 0.5, "power3.out", 0.15),
        tw(".lang-word", { scale: 0.85, opacity: 0 }, 0.6, "back.out(1.5)", 0.35),
      ];
    case "qr":
      return [
        tw(".qr-block", { scale: 0.85, opacity: 0 }, 0.6, "back.out(1.6)", 0.15),
        tw(".qr-title", { y: 30, opacity: 0 }, 0.5, "power3.out", 0.5),
        tw(".qr-sub", { y: 20, opacity: 0 }, 0.4, "expo.out", 0.7),
      ];
    case "step":
      return [
        tw(".step-num", { scale: 0.6, opacity: 0, rotation: -15 }, 0.65, "back.out(1.7)", 0.15),
        tw(".step-title", { y: 40, opacity: 0 }, 0.55, "power3.out", 0.45),
        tw(".step-sub", { y: 25, opacity: 0 }, 0.45, "expo.out", 0.65),
      ];
    case "checklist":
      return [
        tw(".check-title", { y: 30, opacity: 0 }, 0.5, "power3.out", 0.15),
        tw(".check-list li", { x: -40, opacity: 0, stagger: 0.12 }, 0.45, "expo.out", 0.45),
      ];
    case "palette":
      return [
        tw(".palette-title", { y: 30, opacity: 0 }, 0.5, "power3.out", 0.15),
        tw(".palette-swatch", { y: 60, opacity: 0, stagger: 0.08 }, 0.55, "back.out(1.6)", 0.4),
      ];
    case "note":
      return [
        tw(".note-card", { y: 50, opacity: 0, scale: 0.94 }, 0.7, "power3.out", 0.15),
        tw(".note-from", { y: 20, opacity: 0 }, 0.45, "expo.out", 0.5),
        tw(".note-quote", { y: 25, opacity: 0 }, 0.5, "power2.out", 0.7),
      ];
    case "month":
      return [
        tw(".month-name", { scale: 0.85, opacity: 0 }, 0.6, "back.out(1.6)", 0.15),
        tw(".month-meta", { y: 30, opacity: 0 }, 0.45, "expo.out", 0.45),
      ];
    case "closer":
      return [
        tw(".closer-title", { y: 40, opacity: 0 }, 0.6, "power3.out", 0.15),
        tw(".closer-sub", { y: 25, opacity: 0 }, 0.5, "expo.out", 0.4),
      ];
    default:
      return [];
  }
}

function buildPackageJson(id) {
  return JSON.stringify({
    name: id,
    private: true,
    type: "module",
    scripts: {
      dev: "npx --yes hyperframes@0.6.25 preview",
      check: "npx --yes hyperframes@0.6.25 lint && npx --yes hyperframes@0.6.25 validate && npx --yes hyperframes@0.6.25 inspect",
      render: "npx --yes hyperframes@0.6.25 render",
      publish: "npx --yes hyperframes@0.6.25 publish",
    },
  }, null, 2) + "\n";
}

function buildHyperframesJson() {
  return JSON.stringify({
    $schema: "https://hyperframes.heygen.com/schema/hyperframes.json",
    registry: "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
    paths: {
      blocks: "compositions",
      components: "compositions/components",
      assets: "assets",
    },
  }, null, 2) + "\n";
}

function buildMetaJson(id) {
  return JSON.stringify({
    id,
    name: id,
    createdAt: new Date().toISOString(),
  }, null, 2) + "\n";
}

function buildNarration(c) {
  const introDur = 1.5;
  return `# ${c.id} — Narration\n\n**Başlık:** ${c.title}\n\n## TR Narration (TTS için)\n\n> ${c.narration}\n\n## Sahne Akışı\n\n${c.scenes.map((s, i) => `${i + 1}. **${s.kind}** (${s.dur}sn) — ${s.title || s.big || s.label || ""}${s.sub ? ` · ${s.sub}` : ""}`).join("\n")}\n\n## TTS Üretimi\n\n1. Voiceover'ı üret (hyperframes CLI veya başka TTS):\n\n   \`\`\`bash\n   npx hyperframes tts "${c.narration.replace(/"/g, '\\"')}" --voice tr_female_warm --out assets/audio/voiceover.mp3\n   \`\`\`\n\n2. \`index.html\`'de \`</div class="grain">\` satırının hemen üstüne ekle (intro'dan sonra başlasın diye \`data-start="${introDur}"\`):\n\n   \`\`\`html\n   <audio id="vo" class="clip" src="assets/audio/voiceover.mp3" data-start="${introDur}" data-track-index="2" preload="auto"></audio>\n   \`\`\`\n\n3. \`npm run check\` ile doğrula, sonra \`npm run render\`.\n`;
}

// ---- main ----
function main() {
  const summary = [];
  for (const concept of CONCEPTS) {
    const dir = resolve(SERIES_ROOT, concept.id);
    const existed = existsSync(dir);
    mkdirSync(dir, { recursive: true });
    mkdirSync(resolve(dir, "assets"), { recursive: true });
    mkdirSync(resolve(dir, "assets/logo"), { recursive: true });
    mkdirSync(resolve(dir, "assets/audio"), { recursive: true });
    mkdirSync(resolve(dir, "renders"), { recursive: true });

    // Copy fonts (whole folder)
    cpSync(resolve(REFERENCE_REEL, "fonts"), resolve(dir, "fonts"), { recursive: true, force: true });

    // Copy logo files
    cpSync(resolve(REFERENCE_REEL, "assets/logo/logo.png"), resolve(dir, "assets/logo/logo.png"), { force: true });
    cpSync(resolve(REFERENCE_REEL, "assets/logo/uygundavet-wordmark.png"), resolve(dir, "assets/logo/uygundavet-wordmark.png"), { force: true });

    // Copy music bed
    cpSync(resolve(REFERENCE_REEL, "assets/audio/jazz_bed.mp3"), resolve(dir, "assets/audio/jazz_bed.mp3"), { force: true });

    // Copy envelope images (real product assets)
    mkdirSync(resolve(dir, "assets/envelopes"), { recursive: true });
    cpSync(resolve(__dirname, "envelopes"), resolve(dir, "assets/envelopes"), { recursive: true, force: true });

    // Write configs
    writeFileSync(resolve(dir, "package.json"), buildPackageJson(concept.id));
    writeFileSync(resolve(dir, "hyperframes.json"), buildHyperframesJson());
    writeFileSync(resolve(dir, "meta.json"), buildMetaJson(concept.id));
    writeFileSync(resolve(dir, "NARRATION.md"), buildNarration(concept));
    writeFileSync(resolve(dir, "index.html"), buildIndexHtml(concept));

    summary.push(`${existed ? "♻️ " : "✅"} ${concept.id}`);
  }
  console.log(summary.join("\n"));
  console.log(`\nDone. ${CONCEPTS.length} concept processed.`);
}

main();
