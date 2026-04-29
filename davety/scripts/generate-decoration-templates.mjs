#!/usr/bin/env node
/**
 * Generates the decoration template SVG library used by the invitation
 * editor. All SVGs use `currentColor` for stroke/fill so the consumer
 * can recolor them by setting CSS `color` on a parent. Tonal depth is
 * achieved with `opacity`, which works regardless of the chosen colour.
 *
 * Categories
 *   botanical-frames   → rectangular / arched frames with botanical accents
 *   floral-corners     → flower clusters anchored to corners
 *   gold-ornaments     → filigree dividers, scrolls, art-nouveau motifs
 *   dividers           → horizontal section dividers
 *   wax-seals          → circular monogram seals
 *   badges             → ribbons, shields, medallions
 *   business-luxe      → minimal geometric / line patterns
 *   baby-shower        → soft baby-themed motifs
 *   kids-party         → balloons, hats, cake, gifts
 *   circumcision-classic → classic Turkish sünnet motifs (crescent, gold star, etc.)
 *
 * Run:  node scripts/generate-decoration-templates.mjs
 */

import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "public", "assets", "templates");
const SIZE = 900;

/* ──────────────────────── SVG helpers ────────────────────────── */

function svg(content, label) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" fill="none" role="img" aria-label="${label}">
${content}
</svg>
`;
}

/** Emit a <g> with default stroke/linecap so children stay terse. */
function g(strokeWidth, opacity, content) {
  return `  <g stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}">
${content}
  </g>`;
}

/* ─────────────────────── visual primitives ──────────────────── */

function rose(cx, cy, r) {
  // Stylised rose: nested petal arcs around a center.
  const inner = r * 0.45;
  return [
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="currentColor" opacity="0.18"/>`,
    `<circle cx="${cx}" cy="${cy}" r="${r * 0.65}" fill="currentColor" opacity="0.30"/>`,
    `<circle cx="${cx}" cy="${cy}" r="${inner}" fill="currentColor" opacity="0.55"/>`,
    `<path d="M${cx - inner * 0.35} ${cy - inner * 0.2} Q${cx} ${cy - inner * 0.7} ${cx + inner * 0.35} ${cy - inner * 0.2}"/>`,
    `<path d="M${cx} ${cy} Q${cx + inner * 0.3} ${cy + inner * 0.1} ${cx + inner * 0.1} ${cy + inner * 0.4}"/>`,
  ].join("\n      ");
}

function daisy(cx, cy, r) {
  const petals = [];
  const n = 6;
  for (let i = 0; i < n; i++) {
    const a = (i * 2 * Math.PI) / n;
    const px = cx + Math.cos(a) * r * 0.6;
    const py = cy + Math.sin(a) * r * 0.6;
    petals.push(
      `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(r * 0.35).toFixed(1)}" ry="${(r * 0.18).toFixed(1)}" transform="rotate(${((a * 180) / Math.PI).toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)})" fill="currentColor" opacity="0.35"/>`,
    );
  }
  petals.push(
    `<circle cx="${cx}" cy="${cy}" r="${r * 0.32}" fill="currentColor" opacity="0.7"/>`,
  );
  return petals.join("\n      ");
}

function tulip(cx, cy, h) {
  const w = h * 0.6;
  return [
    `<path d="M${cx} ${cy + h * 0.5} Q${cx - w * 0.5} ${cy + h * 0.3} ${cx - w * 0.5} ${cy - h * 0.2} Q${cx - w * 0.25} ${cy + h * 0.05} ${cx} ${cy - h * 0.05} Q${cx + w * 0.25} ${cy + h * 0.05} ${cx + w * 0.5} ${cy - h * 0.2} Q${cx + w * 0.5} ${cy + h * 0.3} ${cx} ${cy + h * 0.5} Z" fill="currentColor" opacity="0.32"/>`,
    `<path d="M${cx} ${cy + h * 0.5} L${cx} ${cy + h}"/>`,
    `<path d="M${cx} ${cy + h * 0.78} Q${cx + w * 0.6} ${cy + h * 0.6} ${cx + w * 0.55} ${cy + h * 0.4}"/>`,
  ].join("\n      ");
}

function leafSprig(x1, y1, x2, y2, leafSize = 18) {
  // Stem from (x1,y1) to (x2,y2) with paired leaves.
  const out = [`<path d="M${x1} ${y1} Q${(x1 + x2) / 2 + 30} ${(y1 + y2) / 2} ${x2} ${y2}"/>`];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  // Perpendicular
  const px = -uy;
  const py = ux;
  const steps = 4;
  for (let i = 1; i <= steps; i++) {
    const t = i / (steps + 1);
    const cx = x1 + dx * t + 30 * (4 * t * (1 - t));
    const cy = y1 + dy * t;
    const side = i % 2 === 0 ? 1 : -1;
    const lx = cx + px * leafSize * 1.4 * side;
    const ly = cy + py * leafSize * 1.4 * side;
    out.push(
      `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${leafSize}" ry="${leafSize * 0.45}" transform="rotate(${(Math.atan2(ly - cy, lx - cx) * 180 / Math.PI).toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})" fill="currentColor" opacity="0.28"/>`,
    );
  }
  return out.join("\n      ");
}

function leaf(cx, cy, size, angle = 0) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${size}" ry="${size * 0.4}" transform="rotate(${angle} ${cx} ${cy})" fill="currentColor" opacity="0.32"/>`;
}

function star(cx, cy, r, points = 5) {
  const inner = r * 0.4;
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const a = (i * Math.PI) / points - Math.PI / 2;
    const rad = i % 2 === 0 ? r : inner;
    pts.push(`${(cx + Math.cos(a) * rad).toFixed(1)},${(cy + Math.sin(a) * rad).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="currentColor" opacity="0.5"/>`;
}

function dot(cx, cy, r, opacity = 0.6) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="currentColor" opacity="${opacity}"/>`;
}

/* ───────────────────── botanical-frames ─────────────────────── */

function botanicalFrames() {
  const out = [];

  // 01 — rounded rectangle frame with corner sprigs
  out.push(svg(
    g(7, 0.85, [
      `<rect x="${SIZE * 0.13}" y="${SIZE * 0.13}" width="${SIZE * 0.74}" height="${SIZE * 0.74}" rx="36"/>`,
      leafSprig(170, 200, 270, 110, 22),
      leafSprig(630, 110, 730, 200, 22),
      leafSprig(170, 700, 270, 790, 22),
      leafSprig(630, 790, 730, 700, 22),
    ].join("\n    ")),
    "botanical-frames-1",
  ));

  // 02 — arch top frame with trailing leaves
  out.push(svg(
    g(7, 0.85, [
      `<path d="M150 800 L150 350 Q150 150 450 150 Q750 150 750 350 L750 800"/>`,
      `<path d="M150 800 L750 800"/>`,
      leafSprig(150, 360, 250, 250, 20),
      leafSprig(750, 360, 650, 250, 20),
      leafSprig(150, 760, 220, 700, 16),
      leafSprig(750, 760, 680, 700, 16),
    ].join("\n    ")),
    "botanical-frames-2",
  ));

  // 03 — oval frame with delicate vines
  out.push(svg(
    g(6, 0.8, [
      `<ellipse cx="450" cy="450" rx="320" ry="380"/>`,
      `<ellipse cx="450" cy="450" rx="290" ry="350" opacity="0.5"/>`,
      // Upper vine
      `<path d="M450 70 Q380 130 360 200"/>`,
      `<path d="M450 70 Q520 130 540 200"/>`,
      leaf(390, 140, 22, -40),
      leaf(510, 140, 22, 40),
      // Lower vine
      `<path d="M450 830 Q400 770 380 700"/>`,
      `<path d="M450 830 Q500 770 520 700"/>`,
      leaf(395, 760, 22, 40),
      leaf(505, 760, 22, -40),
    ].join("\n    ")),
    "botanical-frames-3",
  ));

  // 04 — square + corner leaf clusters
  out.push(svg(
    g(7, 0.85, [
      `<rect x="160" y="160" width="580" height="580"/>`,
      `<rect x="180" y="180" width="540" height="540" opacity="0.4"/>`,
      // Corner clusters
      ...[[160, 160, 0], [740, 160, 90], [740, 740, 180], [160, 740, 270]].map(
        ([x, y, rot]) =>
          `<g transform="translate(${x} ${y}) rotate(${rot})">
        ${leaf(40, 40, 28, 45)}
        ${leaf(80, 30, 22, 30)}
        ${leaf(30, 80, 22, 60)}
        <circle cx="55" cy="55" r="8" fill="currentColor" opacity="0.7"/>
      </g>`,
      ),
    ].join("\n    ")),
    "botanical-frames-4",
  ));

  // 05 — double thin border with sprigs
  out.push(svg(
    g(4, 0.9, [
      `<rect x="120" y="120" width="660" height="660"/>`,
      `<rect x="140" y="140" width="620" height="620" opacity="0.5"/>`,
      `<line x1="450" y1="120" x2="450" y2="80"/>`,
      `<line x1="450" y1="780" x2="450" y2="820"/>`,
      `<line x1="120" y1="450" x2="80" y2="450"/>`,
      `<line x1="780" y1="450" x2="820" y2="450"/>`,
      dot(450, 80, 6),
      dot(450, 820, 6),
      dot(80, 450, 6),
      dot(820, 450, 6),
      leafSprig(140, 250, 250, 140, 18),
      leafSprig(760, 140, 650, 250, 18),
      leafSprig(140, 650, 250, 760, 18),
      leafSprig(760, 760, 650, 650, 18),
    ].join("\n    ")),
    "botanical-frames-5",
  ));

  // 06 — tall portrait frame with single trailing vine
  out.push(svg(
    g(6, 0.85, [
      `<rect x="240" y="100" width="420" height="700" rx="20"/>`,
      // Trailing vine on right
      `<path d="M660 130 Q780 250 720 400 Q670 550 760 700 Q780 760 700 790"/>`,
      leaf(720, 230, 28, 30),
      leaf(750, 350, 26, -30),
      leaf(700, 480, 28, 50),
      leaf(740, 600, 26, -20),
      leaf(720, 720, 24, 40),
      dot(660, 130, 7),
    ].join("\n    ")),
    "botanical-frames-6",
  ));

  // 07 — circular wreath frame
  out.push(svg(
    g(5, 0.85, [
      `<circle cx="450" cy="450" r="320"/>`,
      // Wreath leaves around the circle
      ...Array.from({ length: 14 }, (_, i) => {
        const a = (i * 2 * Math.PI) / 14;
        const lx = 450 + Math.cos(a) * 320;
        const ly = 450 + Math.sin(a) * 320;
        return leaf(lx, ly, 30, (a * 180) / Math.PI + 90);
      }),
      // Top bow
      `<path d="M420 130 Q400 100 380 110 M480 130 Q500 100 520 110"/>`,
    ].join("\n    ")),
    "botanical-frames-7",
  ));

  // 08 — scalloped border + corner flowers
  out.push(svg(
    g(5, 0.85, [
      // Scalloped rectangle approximation
      ...Array.from({ length: 12 }, (_, i) => {
        const x = 150 + (i * 600) / 12;
        return `<path d="M${x} 120 Q${x + 25} 100 ${x + 50} 120"/>`;
      }),
      ...Array.from({ length: 12 }, (_, i) => {
        const x = 150 + (i * 600) / 12;
        return `<path d="M${x} 780 Q${x + 25} 800 ${x + 50} 780"/>`;
      }),
      ...Array.from({ length: 12 }, (_, i) => {
        const y = 150 + (i * 600) / 12;
        return `<path d="M120 ${y} Q100 ${y + 25} 120 ${y + 50}"/>`;
      }),
      ...Array.from({ length: 12 }, (_, i) => {
        const y = 150 + (i * 600) / 12;
        return `<path d="M780 ${y} Q800 ${y + 25} 780 ${y + 50}"/>`;
      }),
      daisy(170, 170, 35),
      daisy(730, 170, 35),
      daisy(170, 730, 35),
      daisy(730, 730, 35),
    ].join("\n    ")),
    "botanical-frames-8",
  ));

  // 09 — half-arch (top open), falling leaves
  out.push(svg(
    g(6, 0.85, [
      `<path d="M150 800 L150 300"/>`,
      `<path d="M750 800 L750 300"/>`,
      `<path d="M150 800 L750 800"/>`,
      `<path d="M150 300 Q450 150 750 300" stroke-dasharray="8 12"/>`,
      // Falling leaves
      leaf(220, 250, 24, -20),
      leaf(680, 250, 24, 20),
      leaf(280, 380, 22, -45),
      leaf(620, 380, 22, 45),
      leaf(200, 520, 20, -10),
      leaf(700, 520, 20, 10),
    ].join("\n    ")),
    "botanical-frames-9",
  ));

  // 10 — art-deco linear with leaves
  out.push(svg(
    g(5, 0.9, [
      `<rect x="150" y="150" width="600" height="600"/>`,
      `<line x1="150" y1="200" x2="750" y2="200"/>`,
      `<line x1="150" y1="700" x2="750" y2="700"/>`,
      `<line x1="200" y1="150" x2="200" y2="750"/>`,
      `<line x1="700" y1="150" x2="700" y2="750"/>`,
      // Geometric corner ornaments
      ...[[200, 200], [700, 200], [200, 700], [700, 700]].map(
        ([x, y]) =>
          `<circle cx="${x}" cy="${y}" r="12" fill="currentColor" opacity="0.7"/>
      <circle cx="${x}" cy="${y}" r="22" opacity="0.5"/>`,
      ),
      leaf(450, 175, 30, 0),
      leaf(450, 725, 30, 0),
      leaf(175, 450, 30, 90),
      leaf(725, 450, 30, 90),
    ].join("\n    ")),
    "botanical-frames-10",
  ));

  // 11 — hexagonal frame with sprigs
  out.push(svg(
    g(6, 0.85, [
      `<polygon points="450,120 730,290 730,610 450,780 170,610 170,290"/>`,
      `<polygon points="450,160 690,300 690,600 450,740 210,600 210,300" opacity="0.5"/>`,
      leafSprig(450, 120, 380, 60, 18),
      leafSprig(450, 120, 520, 60, 18),
      leafSprig(450, 780, 380, 840, 18),
      leafSprig(450, 780, 520, 840, 18),
    ].join("\n    ")),
    "botanical-frames-11",
  ));

  // 12 — organic trailing vine border
  out.push(svg(
    g(5, 0.85, [
      `<path d="M150 200 Q140 120 220 130 Q300 140 350 200 Q400 250 480 220 Q580 180 650 200 Q740 220 760 280"/>`,
      `<path d="M150 700 Q140 780 220 770 Q300 760 350 700 Q400 650 480 680 Q580 720 650 700 Q740 680 760 620"/>`,
      `<path d="M180 220 Q150 350 200 480 Q250 600 200 700"/>`,
      `<path d="M720 220 Q750 350 700 480 Q650 600 700 700"/>`,
      ...Array.from({ length: 8 }, (_, i) => {
        const t = (i + 1) / 9;
        return leaf(150 + t * 600, 200 - 30 * Math.sin(t * Math.PI * 2), 18, t * 180);
      }),
      ...Array.from({ length: 8 }, (_, i) => {
        const t = (i + 1) / 9;
        return leaf(150 + t * 600, 700 + 30 * Math.sin(t * Math.PI * 2), 18, -t * 180);
      }),
    ].join("\n    ")),
    "botanical-frames-12",
  ));

  return out;
}

/* ───────────────────── floral-corners ───────────────────────── */

function floralCorners() {
  const out = [];

  function corner(cx, cy, kind, rot = 0) {
    // Generic corner cluster with flower at center + supporting leaves
    const flower = kind === "rose" ? rose(0, 0, 50)
      : kind === "daisy" ? daisy(0, 0, 55)
      : tulip(0, 0, 60);
    return `<g transform="translate(${cx} ${cy}) rotate(${rot})">
      <path d="M-110 30 Q-50 -20 0 0 Q 30 50 80 90"/>
      ${leaf(-80, 20, 26, -30)}
      ${leaf(60, 70, 26, 40)}
      ${flower}
    </g>`;
  }

  // 01 — 4 rose corners
  out.push(svg(
    g(6, 0.85, [
      corner(180, 180, "rose", 0),
      corner(720, 180, "rose", 90),
      corner(720, 720, "rose", 180),
      corner(180, 720, "rose", 270),
    ].join("\n    ")),
    "floral-corners-1",
  ));

  // 02 — 4 daisy corners
  out.push(svg(
    g(6, 0.85, [
      corner(180, 180, "daisy", 0),
      corner(720, 180, "daisy", 90),
      corner(720, 720, "daisy", 180),
      corner(180, 720, "daisy", 270),
    ].join("\n    ")),
    "floral-corners-2",
  ));

  // 03 — top corners only (left + right)
  out.push(svg(
    g(6, 0.85, [
      corner(180, 180, "rose", 0),
      corner(720, 180, "rose", 90),
    ].join("\n    ")),
    "floral-corners-3",
  ));

  // 04 — bottom-corner trail (long horizontal)
  out.push(svg(
    g(6, 0.85, [
      `<path d="M120 800 Q300 700 480 760 Q650 810 800 720"/>`,
      rose(180, 770, 40),
      daisy(450, 740, 40),
      tulip(700, 730, 70),
      leaf(290, 750, 24, -10),
      leaf(580, 745, 24, 10),
    ].join("\n    ")),
    "floral-corners-4",
  ));

  // 05 — single big bottom-left bouquet
  out.push(svg(
    g(7, 0.85, [
      `<path d="M180 800 Q200 600 280 500"/>`,
      `<path d="M180 800 Q220 650 320 580"/>`,
      `<path d="M180 800 Q260 700 360 660"/>`,
      rose(290, 480, 60),
      daisy(360, 560, 50),
      tulip(420, 640, 60),
      leaf(220, 680, 28, 30),
      leaf(280, 600, 26, 50),
    ].join("\n    ")),
    "floral-corners-5",
  ));

  // 06 — diagonal corners (TL + BR) peonies
  out.push(svg(
    g(6, 0.85, [
      corner(180, 180, "rose", 0),
      corner(720, 720, "rose", 180),
    ].join("\n    ")),
    "floral-corners-6",
  ));

  // 07 — thin line corners + small flower
  out.push(svg(
    g(4, 0.9, [
      `<path d="M120 200 L120 120 L200 120"/>`,
      `<path d="M780 200 L780 120 L700 120"/>`,
      `<path d="M120 700 L120 780 L200 780"/>`,
      `<path d="M780 700 L780 780 L700 780"/>`,
      daisy(160, 160, 28),
      daisy(740, 160, 28),
      daisy(160, 740, 28),
      daisy(740, 740, 28),
    ].join("\n    ")),
    "floral-corners-7",
  ));

  // 08 — anemone clusters (3 small flowers in each corner)
  out.push(svg(
    g(5, 0.85, [
      ...[[160, 160, 0], [740, 160, 90], [740, 740, 180], [160, 740, 270]].flatMap(
        ([x, y]) => [
          daisy(x, y, 30),
          daisy(x + 50, y + 25, 22),
          daisy(x + 25, y + 60, 22),
        ],
      ),
    ].join("\n    ")),
    "floral-corners-8",
  ));

  // 09 — lavender sprigs in 4 corners
  out.push(svg(
    g(5, 0.85, [
      ...[[180, 180, 30], [720, 180, 60], [720, 720, 120], [180, 720, 150]].map(
        ([x, y, rot]) =>
          `<g transform="translate(${x} ${y}) rotate(${rot})">
        <path d="M0 0 L120 0"/>
        ${dot(20, 0, 7)}${dot(40, 0, 7)}${dot(60, 0, 7)}${dot(80, 0, 7)}${dot(100, 0, 7)}
        ${dot(20, -10, 5, 0.4)}${dot(20, 10, 5, 0.4)}
        ${dot(60, -10, 5, 0.4)}${dot(60, 10, 5, 0.4)}
        ${dot(100, -10, 5, 0.4)}${dot(100, 10, 5, 0.4)}
      </g>`,
      ),
    ].join("\n    ")),
    "floral-corners-9",
  ));

  // 10 — cherry blossom in top-left
  out.push(svg(
    g(5, 0.85, [
      `<path d="M120 350 Q200 300 280 320 Q360 340 420 280"/>`,
      `<path d="M180 220 Q260 200 320 240"/>`,
      // Blossoms (5-petal flowers)
      ...[[200, 320, 30], [320, 290, 28], [380, 270, 24], [240, 230, 26], [310, 230, 22]].map(
        ([cx, cy, r]) => {
          const petals = [];
          for (let i = 0; i < 5; i++) {
            const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const px = cx + Math.cos(a) * r * 0.55;
            const py = cy + Math.sin(a) * r * 0.55;
            petals.push(`<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(r * 0.4).toFixed(1)}" fill="currentColor" opacity="0.32"/>`);
          }
          petals.push(`<circle cx="${cx}" cy="${cy}" r="${(r * 0.18).toFixed(1)}" fill="currentColor" opacity="0.7"/>`);
          return petals.join("\n      ");
        },
      ),
    ].join("\n    ")),
    "floral-corners-10",
  ));

  // 11 — eucalyptus L-corner (TL extending down + right)
  out.push(svg(
    g(5, 0.85, [
      `<path d="M120 120 Q200 200 220 320 Q240 460 200 580"/>`,
      `<path d="M120 120 Q200 200 320 220 Q460 240 580 200"/>`,
      ...Array.from({ length: 8 }, (_, i) => {
        const t = (i + 1) / 9;
        const x = 120 + t * 100 + 100;
        const y = 200 + t * 380;
        const side = i % 2 === 0 ? 1 : -1;
        return `<ellipse cx="${(x + 24 * side).toFixed(1)}" cy="${y.toFixed(1)}" rx="20" ry="11" fill="currentColor" opacity="0.4"/>`;
      }),
      ...Array.from({ length: 8 }, (_, i) => {
        const t = (i + 1) / 9;
        const x = 200 + t * 380;
        const y = 120 + t * 100 + 100;
        const side = i % 2 === 0 ? 1 : -1;
        return `<ellipse cx="${x.toFixed(1)}" cy="${(y + 24 * side).toFixed(1)}" rx="20" ry="11" fill="currentColor" opacity="0.4"/>`;
      }),
    ].join("\n    ")),
    "floral-corners-11",
  ));

  // 12 — mixed wild flowers all 4 corners (small variety)
  out.push(svg(
    g(5, 0.85, [
      // TL — daisy + tulip
      daisy(140, 140, 26),
      tulip(220, 200, 50),
      leaf(180, 170, 20, -30),
      // TR — rose + daisy
      rose(760, 140, 35),
      daisy(680, 200, 26),
      leaf(720, 170, 20, 30),
      // BL — tulip + daisy
      tulip(140, 720, 50),
      daisy(220, 760, 26),
      leaf(180, 740, 20, 30),
      // BR — rose + tulip
      rose(760, 760, 35),
      tulip(680, 700, 50),
      leaf(720, 730, 20, -30),
    ].join("\n    ")),
    "floral-corners-12",
  ));

  return out;
}

/* ───────────────────── gold-ornaments ───────────────────────── */

function goldOrnaments() {
  const out = [];

  // 01 — central diamond + horizontal flourishes
  out.push(svg(
    g(5, 0.9, [
      `<path d="M450 350 L530 450 L450 550 L370 450 Z"/>`,
      `<path d="M370 450 L100 450"/>`,
      `<path d="M530 450 L800 450"/>`,
      `<circle cx="100" cy="450" r="12" fill="currentColor" opacity="0.7"/>`,
      `<circle cx="800" cy="450" r="12" fill="currentColor" opacity="0.7"/>`,
      `<path d="M150 420 Q170 380 220 400"/>`,
      `<path d="M150 480 Q170 520 220 500"/>`,
      `<path d="M750 420 Q730 380 680 400"/>`,
      `<path d="M750 480 Q730 520 680 500"/>`,
      dot(450, 450, 8),
    ].join("\n    ")),
    "gold-ornaments-1",
  ));

  // 02 — symmetrical filigree scrolls
  out.push(svg(
    g(5, 0.9, [
      `<path d="M450 200 Q350 250 320 350 Q300 420 350 450 L450 450"/>`,
      `<path d="M450 200 Q550 250 580 350 Q600 420 550 450 L450 450"/>`,
      `<path d="M450 700 Q350 650 320 550 Q300 480 350 450"/>`,
      `<path d="M450 700 Q550 650 580 550 Q600 480 550 450"/>`,
      `<circle cx="450" cy="450" r="40" opacity="0.5"/>`,
      `<circle cx="450" cy="450" r="20" fill="currentColor" opacity="0.7"/>`,
      dot(450, 200, 9),
      dot(450, 700, 9),
    ].join("\n    ")),
    "gold-ornaments-2",
  ));

  // 03 — laurel wreath
  out.push(svg(
    g(5, 0.9, [
      `<path d="M250 200 Q200 450 250 700"/>`,
      `<path d="M650 200 Q700 450 650 700"/>`,
      ...Array.from({ length: 8 }, (_, i) => {
        const t = (i + 1) / 9;
        const lx = 250 - 50 * Math.sin(t * Math.PI);
        const ly = 200 + t * 500;
        return leaf(lx, ly, 26, -65);
      }),
      ...Array.from({ length: 8 }, (_, i) => {
        const t = (i + 1) / 9;
        const lx = 650 + 50 * Math.sin(t * Math.PI);
        const ly = 200 + t * 500;
        return leaf(lx, ly, 26, 65);
      }),
      `<path d="M250 700 Q450 770 650 700"/>`,
    ].join("\n    ")),
    "gold-ornaments-3",
  ));

  // 04 — concentric rings ornament
  out.push(svg(
    g(4, 0.85, [
      `<circle cx="450" cy="450" r="280"/>`,
      `<circle cx="450" cy="450" r="240" opacity="0.6"/>`,
      `<circle cx="450" cy="450" r="180" opacity="0.4"/>`,
      `<circle cx="450" cy="450" r="120" opacity="0.5"/>`,
      `<circle cx="450" cy="450" r="60" fill="currentColor" opacity="0.4"/>`,
      ...Array.from({ length: 12 }, (_, i) => {
        const a = (i * 2 * Math.PI) / 12;
        return dot(450 + Math.cos(a) * 280, 450 + Math.sin(a) * 280, 8);
      }),
    ].join("\n    ")),
    "gold-ornaments-4",
  ));

  // 05 — vertical spine with floral nodes
  out.push(svg(
    g(5, 0.9, [
      `<line x1="450" y1="100" x2="450" y2="800"/>`,
      ...Array.from({ length: 5 }, (_, i) => {
        const y = 150 + i * 150;
        return [
          rose(450, y, 40),
          `<path d="M380 ${y} Q420 ${y - 30} 450 ${y}"/>`,
          `<path d="M520 ${y} Q480 ${y - 30} 450 ${y}"/>`,
        ].join("\n      ");
      }),
    ].join("\n    ")),
    "gold-ornaments-5",
  ));

  // 06 — art nouveau flowing curves
  out.push(svg(
    g(6, 0.9, [
      `<path d="M150 450 Q200 250 450 250 Q700 250 750 450 Q700 650 450 650 Q200 650 150 450 Z"/>`,
      `<path d="M250 450 Q300 350 450 350 Q600 350 650 450 Q600 550 450 550 Q300 550 250 450 Z" opacity="0.5"/>`,
      dot(450, 450, 16),
      `<path d="M450 250 Q420 200 450 150 Q480 200 450 250"/>`,
      `<path d="M450 650 Q420 700 450 750 Q480 700 450 650"/>`,
    ].join("\n    ")),
    "gold-ornaments-6",
  ));

  // 07 — fleur-de-lis style ornament
  out.push(svg(
    g(6, 0.9, [
      `<path d="M450 200 Q450 350 380 420 Q330 470 380 520 Q420 560 450 540 Q480 560 520 520 Q570 470 520 420 Q450 350 450 200"/>`,
      `<path d="M450 540 L450 700"/>`,
      `<path d="M340 580 L560 580"/>`,
      `<path d="M340 580 Q360 620 400 600"/>`,
      `<path d="M560 580 Q540 620 500 600"/>`,
      dot(450, 200, 12),
    ].join("\n    ")),
    "gold-ornaments-7",
  ));

  // 08 — diamond chain horizontal
  out.push(svg(
    g(4, 0.9, [
      `<line x1="80" y1="450" x2="820" y2="450"/>`,
      ...Array.from({ length: 7 }, (_, i) => {
        const x = 150 + i * 100;
        return `<path d="M${x} 420 L${x + 30} 450 L${x} 480 L${x - 30} 450 Z" fill="currentColor" opacity="0.4"/>`;
      }),
    ].join("\n    ")),
    "gold-ornaments-8",
  ));

  // 09 — sun rays
  out.push(svg(
    g(5, 0.9, [
      `<circle cx="450" cy="450" r="80" fill="currentColor" opacity="0.4"/>`,
      `<circle cx="450" cy="450" r="60" fill="currentColor" opacity="0.6"/>`,
      ...Array.from({ length: 16 }, (_, i) => {
        const a = (i * 2 * Math.PI) / 16;
        const x1 = 450 + Math.cos(a) * 100;
        const y1 = 450 + Math.sin(a) * 100;
        const x2 = 450 + Math.cos(a) * 250;
        const y2 = 450 + Math.sin(a) * 250;
        return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
      }),
      ...Array.from({ length: 8 }, (_, i) => {
        const a = (i * 2 * Math.PI) / 8 + Math.PI / 8;
        const x = 450 + Math.cos(a) * 280;
        const y = 450 + Math.sin(a) * 280;
        return dot(x, y, 7);
      }),
    ].join("\n    ")),
    "gold-ornaments-9",
  ));

  // 10 — heart wreath
  out.push(svg(
    g(5, 0.9, [
      `<path d="M450 720 C200 540 180 320 320 280 C400 260 440 320 450 360 C460 320 500 260 580 280 C720 320 700 540 450 720 Z" opacity="0.4"/>`,
      `<path d="M450 670 C240 520 220 340 330 310 C400 290 440 340 450 370 C460 340 500 290 570 310 C680 340 660 520 450 670 Z" opacity="0.6"/>`,
      dot(450, 470, 10),
    ].join("\n    ")),
    "gold-ornaments-10",
  ));

  // 11 — paisley teardrop ornament
  out.push(svg(
    g(5, 0.9, [
      `<path d="M450 200 Q700 250 700 500 Q700 700 450 700 Q300 700 280 600 Q260 500 320 480 Q400 460 380 380 Q360 280 450 200 Z"/>`,
      `<path d="M450 270 Q620 320 620 500 Q620 630 450 630" opacity="0.5"/>`,
      dot(450, 460, 14),
      `<path d="M450 700 L450 800"/>`,
      `<path d="M420 770 Q450 800 480 770"/>`,
    ].join("\n    ")),
    "gold-ornaments-11",
  ));

  // 12 — ornate bracket (top + bottom)
  out.push(svg(
    g(5, 0.9, [
      `<path d="M150 200 Q250 200 280 250 Q310 300 350 280 Q400 250 450 270 Q500 250 550 280 Q590 300 620 250 Q650 200 750 200"/>`,
      `<path d="M150 700 Q250 700 280 650 Q310 600 350 620 Q400 650 450 630 Q500 650 550 620 Q590 600 620 650 Q650 700 750 700"/>`,
      `<line x1="150" y1="200" x2="150" y2="700"/>`,
      `<line x1="750" y1="200" x2="750" y2="700"/>`,
      dot(450, 270, 8),
      dot(450, 630, 8),
    ].join("\n    ")),
    "gold-ornaments-12",
  ));

  return out;
}

/* ───────────────────── dividers ─────────────────────────────── */

function dividers() {
  const out = [];
  const cy = 450;

  // 01 — simple line + center diamond
  out.push(svg(
    g(4, 0.9, [
      `<line x1="100" y1="${cy}" x2="400" y2="${cy}"/>`,
      `<line x1="500" y1="${cy}" x2="800" y2="${cy}"/>`,
      `<path d="M450 ${cy - 20} L470 ${cy} L450 ${cy + 20} L430 ${cy} Z" fill="currentColor" opacity="0.6"/>`,
    ].join("\n    ")),
    "dividers-1",
  ));

  // 02 — dotted
  out.push(svg(
    g(4, 0.9,
      Array.from({ length: 25 }, (_, i) => dot(100 + i * 28, cy, 4)).join("\n    "),
    ),
    "dividers-2",
  ));

  // 03 — double line + center daisy
  out.push(svg(
    g(3, 0.9, [
      `<line x1="100" y1="${cy - 6}" x2="400" y2="${cy - 6}"/>`,
      `<line x1="100" y1="${cy + 6}" x2="400" y2="${cy + 6}"/>`,
      `<line x1="500" y1="${cy - 6}" x2="800" y2="${cy - 6}"/>`,
      `<line x1="500" y1="${cy + 6}" x2="800" y2="${cy + 6}"/>`,
      daisy(450, cy, 36),
    ].join("\n    ")),
    "dividers-3",
  ));

  // 04 — ornate scrolls
  out.push(svg(
    g(4, 0.9, [
      `<path d="M150 ${cy} Q200 ${cy - 30} 280 ${cy} Q360 ${cy + 30} 420 ${cy}"/>`,
      `<path d="M750 ${cy} Q700 ${cy - 30} 620 ${cy} Q540 ${cy + 30} 480 ${cy}"/>`,
      dot(150, cy, 7),
      dot(750, cy, 7),
      rose(450, cy, 35),
    ].join("\n    ")),
    "dividers-4",
  ));

  // 05 — diamond chain
  out.push(svg(
    g(3, 0.9, [
      `<line x1="100" y1="${cy}" x2="800" y2="${cy}" opacity="0.5"/>`,
      ...Array.from({ length: 8 }, (_, i) => {
        const x = 130 + i * 90;
        return `<path d="M${x} ${cy - 16} L${x + 16} ${cy} L${x} ${cy + 16} L${x - 16} ${cy} Z" fill="currentColor" opacity="0.4"/>`;
      }),
    ].join("\n    ")),
    "dividers-5",
  ));

  // 06 — leaf cluster center
  out.push(svg(
    g(4, 0.9, [
      `<line x1="80" y1="${cy}" x2="350" y2="${cy}"/>`,
      `<line x1="550" y1="${cy}" x2="820" y2="${cy}"/>`,
      leaf(380, cy, 32, -45),
      leaf(450, cy, 36, 0),
      leaf(520, cy, 32, 45),
      dot(450, cy + 30, 6),
    ].join("\n    ")),
    "dividers-6",
  ));

  // 07 — wave / sine curve
  out.push(svg(
    g(4, 0.9, [
      `<path d="M100 ${cy} Q200 ${cy - 40} 300 ${cy} T500 ${cy} T700 ${cy} T800 ${cy}"/>`,
    ].join("\n    ")),
    "dividers-7",
  ));

  // 08 — ampersand center
  out.push(svg(
    g(4, 0.9, [
      `<line x1="100" y1="${cy}" x2="380" y2="${cy}"/>`,
      `<line x1="520" y1="${cy}" x2="800" y2="${cy}"/>`,
      `<text x="450" y="${cy + 18}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="56" fill="currentColor" opacity="0.7">&amp;</text>`,
    ].join("\n    ")),
    "dividers-8",
  ));

  // 09 — chevron meander
  out.push(svg(
    g(3, 0.9, [
      ...Array.from({ length: 10 }, (_, i) => {
        const x = 100 + i * 70;
        return `<path d="M${x} ${cy + 12} L${x + 35} ${cy - 12} L${x + 70} ${cy + 12}"/>`;
      }),
    ].join("\n    ")),
    "dividers-9",
  ));

  // 10 — vine with leaves
  out.push(svg(
    g(4, 0.9, [
      `<path d="M100 ${cy} Q300 ${cy - 25} 450 ${cy} Q600 ${cy + 25} 800 ${cy}"/>`,
      ...Array.from({ length: 6 }, (_, i) => {
        const t = (i + 1) / 7;
        const x = 100 + t * 700;
        const y = cy + (i % 2 ? 20 : -20);
        return leaf(x, y, 20, i % 2 ? 30 : -30);
      }),
    ].join("\n    ")),
    "dividers-10",
  ));

  // 11 — concentric circles
  out.push(svg(
    g(4, 0.9, [
      `<line x1="100" y1="${cy}" x2="370" y2="${cy}"/>`,
      `<line x1="530" y1="${cy}" x2="800" y2="${cy}"/>`,
      `<circle cx="450" cy="${cy}" r="22"/>`,
      `<circle cx="450" cy="${cy}" r="14" opacity="0.6"/>`,
      `<circle cx="450" cy="${cy}" r="6" fill="currentColor" opacity="0.8"/>`,
    ].join("\n    ")),
    "dividers-11",
  ));

  // 12 — art deco fan
  out.push(svg(
    g(3, 0.9, [
      `<line x1="100" y1="${cy + 30}" x2="800" y2="${cy + 30}"/>`,
      ...Array.from({ length: 9 }, (_, i) => {
        const angle = -90 + (i - 4) * 12;
        const rad = (angle * Math.PI) / 180;
        const x2 = 450 + Math.cos(rad) * 80;
        const y2 = cy + 30 + Math.sin(rad) * 80;
        return `<line x1="450" y1="${cy + 30}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
      }),
      `<path d="M370 ${cy + 30} Q450 ${cy - 50} 530 ${cy + 30}" opacity="0.6"/>`,
    ].join("\n    ")),
    "dividers-12",
  ));

  return out;
}

/* ───────────────────── wax-seals ────────────────────────────── */

function waxSeals() {
  const out = [];
  const cx = 450;
  const cy = 450;

  function sealBase(r = 200) {
    // Organic ragged-edge wax circle
    return [
      `<path d="M${cx - r} ${cy} Q${cx - r * 1.05} ${cy - r * 0.65} ${cx - r * 0.6} ${cy - r * 0.95} Q${cx} ${cy - r * 1.1} ${cx + r * 0.55} ${cy - r * 0.95} Q${cx + r * 1.05} ${cy - r * 0.7} ${cx + r * 1.05} ${cy} Q${cx + r * 1.05} ${cy + r * 0.65} ${cx + r * 0.55} ${cy + r * 0.95} Q${cx} ${cy + r * 1.1} ${cx - r * 0.6} ${cy + r * 0.95} Q${cx - r * 1.05} ${cy + r * 0.7} ${cx - r} ${cy} Z" fill="currentColor" opacity="0.85"/>`,
      `<circle cx="${cx}" cy="${cy}" r="${r * 0.85}" stroke="white" stroke-width="3" opacity="0.35"/>`,
    ].join("\n      ");
  }

  function withGlyph(glyph) {
    return svg(
      g(5, 1, [
        sealBase(),
        `<g stroke="white" fill="white" opacity="0.85">${glyph}</g>`,
      ].join("\n    ")),
      `wax-seal`,
    );
  }

  // 01 — heart
  out.push(withGlyph(
    `<path d="M${cx} ${cy + 60} C${cx - 100} ${cy} ${cx - 100} ${cy - 80} ${cx - 40} ${cy - 80} C${cx - 10} ${cy - 80} ${cx} ${cy - 50} ${cx} ${cy - 30} C${cx} ${cy - 50} ${cx + 10} ${cy - 80} ${cx + 40} ${cy - 80} C${cx + 100} ${cy - 80} ${cx + 100} ${cy} ${cx} ${cy + 60} Z" fill="white" stroke="none"/>`,
  ));

  // 02 — infinity
  out.push(withGlyph(
    `<path d="M${cx - 80} ${cy} A40 40 0 1 1 ${cx} ${cy} A40 40 0 1 1 ${cx + 80} ${cy} A40 40 0 1 1 ${cx} ${cy} A40 40 0 1 1 ${cx - 80} ${cy} Z" fill="none" stroke="white" stroke-width="10"/>`,
  ));

  // 03 — ampersand
  out.push(withGlyph(
    `<text x="${cx}" y="${cy + 50}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="180" fill="white">&amp;</text>`,
  ));

  // 04 — single letter "M"
  out.push(withGlyph(
    `<text x="${cx}" y="${cy + 50}" text-anchor="middle" font-family="Georgia, serif" font-size="180" fill="white">M</text>`,
  ));

  // 05 — double letter monogram "A·K"
  out.push(withGlyph(
    `<text x="${cx - 50}" y="${cy + 40}" text-anchor="middle" font-family="Georgia, serif" font-size="140" fill="white">A</text>
     <text x="${cx}" y="${cy + 40}" text-anchor="middle" font-family="Georgia, serif" font-size="100" fill="white">·</text>
     <text x="${cx + 50}" y="${cy + 40}" text-anchor="middle" font-family="Georgia, serif" font-size="140" fill="white">K</text>`,
  ));

  // 06 — crown
  out.push(withGlyph(
    `<path d="M${cx - 100} ${cy + 40} L${cx - 70} ${cy - 60} L${cx - 30} ${cy} L${cx} ${cy - 80} L${cx + 30} ${cy} L${cx + 70} ${cy - 60} L${cx + 100} ${cy + 40} Z" fill="white"/>
     <line x1="${cx - 100}" y1="${cy + 60}" x2="${cx + 100}" y2="${cy + 60}" stroke="white" stroke-width="8"/>`,
  ));

  // 07 — anchor
  out.push(withGlyph(
    `<line x1="${cx}" y1="${cy - 80}" x2="${cx}" y2="${cy + 70}" stroke="white" stroke-width="10"/>
     <circle cx="${cx}" cy="${cy - 80}" r="14" fill="none" stroke="white" stroke-width="8"/>
     <line x1="${cx - 40}" y1="${cy - 30}" x2="${cx + 40}" y2="${cy - 30}" stroke="white" stroke-width="8"/>
     <path d="M${cx - 80} ${cy + 30} Q${cx} ${cy + 110} ${cx + 80} ${cy + 30}" stroke="white" stroke-width="10" fill="none"/>`,
  ));

  // 08 — laurel circle
  out.push(withGlyph(
    `<g stroke="white" stroke-width="8" fill="none">
       <path d="M${cx - 90} ${cy - 90} Q${cx - 130} ${cy} ${cx - 90} ${cy + 90}"/>
       <path d="M${cx + 90} ${cy - 90} Q${cx + 130} ${cy} ${cx + 90} ${cy + 90}"/>
     </g>
     <text x="${cx}" y="${cy + 25}" text-anchor="middle" font-family="Georgia, serif" font-size="110" fill="white">&amp;</text>`,
  ));

  // 09 — diamond / gem
  out.push(withGlyph(
    `<path d="M${cx} ${cy - 90} L${cx + 80} ${cy - 30} L${cx} ${cy + 90} L${cx - 80} ${cy - 30} Z" fill="none" stroke="white" stroke-width="10"/>
     <line x1="${cx - 80}" y1="${cy - 30}" x2="${cx + 80}" y2="${cy - 30}" stroke="white" stroke-width="6"/>
     <line x1="${cx}" y1="${cy - 90}" x2="${cx}" y2="${cy - 30}" stroke="white" stroke-width="4"/>`,
  ));

  // 10 — wreath circle
  out.push(withGlyph(
    `<circle cx="${cx}" cy="${cy}" r="80" fill="none" stroke="white" stroke-width="8"/>
     <path d="M${cx} ${cy - 80} Q${cx - 30} ${cy - 110} ${cx - 60} ${cy - 100} M${cx} ${cy - 80} Q${cx + 30} ${cy - 110} ${cx + 60} ${cy - 100}" stroke="white" stroke-width="6" fill="none"/>`,
  ));

  // 11 — key
  out.push(withGlyph(
    `<circle cx="${cx - 50}" cy="${cy}" r="40" fill="none" stroke="white" stroke-width="10"/>
     <line x1="${cx - 10}" y1="${cy}" x2="${cx + 100}" y2="${cy}" stroke="white" stroke-width="10"/>
     <line x1="${cx + 50}" y1="${cy}" x2="${cx + 50}" y2="${cy + 30}" stroke="white" stroke-width="8"/>
     <line x1="${cx + 80}" y1="${cy}" x2="${cx + 80}" y2="${cy + 30}" stroke="white" stroke-width="8"/>`,
  ));

  // 12 — laurel "EST. YEAR" badge style
  out.push(withGlyph(
    `<text x="${cx}" y="${cy - 5}" text-anchor="middle" font-family="Georgia, serif" font-size="40" letter-spacing="6" fill="white">EST.</text>
     <text x="${cx}" y="${cy + 60}" text-anchor="middle" font-family="Georgia, serif" font-size="80" fill="white">2026</text>`,
  ));

  return out;
}

/* ───────────────────── badges ───────────────────────────────── */

function badges() {
  const out = [];

  // 01 — ribbon banner
  out.push(svg(
    g(5, 0.9, [
      `<path d="M150 380 L750 380 L720 450 L750 520 L150 520 L180 450 Z" fill="currentColor" opacity="0.4"/>`,
      `<path d="M150 380 L100 420 L150 460 Z" fill="currentColor" opacity="0.6"/>`,
      `<path d="M750 380 L800 420 L750 460 Z" fill="currentColor" opacity="0.6"/>`,
      `<path d="M150 460 L100 500 L150 540 Z" fill="currentColor" opacity="0.5"/>`,
      `<path d="M750 460 L800 500 L750 540 Z" fill="currentColor" opacity="0.5"/>`,
      `<text x="450" y="465" text-anchor="middle" font-family="Georgia, serif" font-size="42" fill="currentColor" opacity="0.85">SAVE THE DATE</text>`,
    ].join("\n    ")),
    "badges-1",
  ));

  // 02 — shield
  out.push(svg(
    g(5, 0.9, [
      `<path d="M450 200 L700 250 L700 500 Q700 650 450 750 Q200 650 200 500 L200 250 Z" fill="currentColor" opacity="0.4"/>`,
      `<path d="M450 240 L660 280 L660 500 Q660 620 450 700 Q240 620 240 500 L240 280 Z" opacity="0.7"/>`,
      `<text x="450" y="490" text-anchor="middle" font-family="Georgia, serif" font-size="120" fill="currentColor">M</text>`,
    ].join("\n    ")),
    "badges-2",
  ));

  // 03 — circular medallion with ring text
  out.push(svg(
    g(4, 0.9, [
      `<circle cx="450" cy="450" r="280" fill="currentColor" opacity="0.18"/>`,
      `<circle cx="450" cy="450" r="240" opacity="0.6"/>`,
      `<circle cx="450" cy="450" r="180" opacity="0.4"/>`,
      `<text x="450" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="80" fill="currentColor">&amp;</text>`,
      ...Array.from({ length: 8 }, (_, i) => {
        const a = (i * 2 * Math.PI) / 8;
        return star(450 + Math.cos(a) * 240, 450 + Math.sin(a) * 240, 8, 5);
      }),
    ].join("\n    ")),
    "badges-3",
  ));

  // 04 — twin ribbon laurel
  out.push(svg(
    g(5, 0.9, [
      // Laurel leaves
      ...Array.from({ length: 7 }, (_, i) => {
        const t = (i + 1) / 8;
        return [
          leaf(220, 250 + t * 400, 30, -65),
          leaf(680, 250 + t * 400, 30, 65),
        ].join("\n      ");
      }),
      `<path d="M220 700 Q450 770 680 700"/>`,
      `<text x="450" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="64" fill="currentColor" opacity="0.85">EST</text>`,
      `<text x="450" y="540" text-anchor="middle" font-family="Georgia, serif" font-size="54" fill="currentColor" opacity="0.7">2026</text>`,
    ].join("\n    ")),
    "badges-4",
  ));

  // 05 — diamond crest
  out.push(svg(
    g(5, 0.9, [
      `<path d="M450 200 L700 450 L450 700 L200 450 Z" fill="currentColor" opacity="0.25"/>`,
      `<path d="M450 240 L660 450 L450 660 L240 450 Z" opacity="0.65"/>`,
      `<text x="450" y="475" text-anchor="middle" font-family="Georgia, serif" font-size="100" fill="currentColor">A</text>`,
    ].join("\n    ")),
    "badges-5",
  ));

  // 06 — banner with curl
  out.push(svg(
    g(4, 0.9, [
      `<path d="M150 350 Q450 280 750 350 L750 550 Q450 480 150 550 Z" fill="currentColor" opacity="0.35"/>`,
      `<path d="M150 350 Q450 320 750 350" opacity="0.7"/>`,
      `<path d="M150 550 Q450 520 750 550" opacity="0.7"/>`,
      `<text x="450" y="465" text-anchor="middle" font-family="Georgia, serif" font-size="48" fill="currentColor">CELEBRATE</text>`,
    ].join("\n    ")),
    "badges-6",
  ));

  // 07 — hexagon badge
  out.push(svg(
    g(5, 0.9, [
      `<polygon points="450,180 720,330 720,570 450,720 180,570 180,330" fill="currentColor" opacity="0.3"/>`,
      `<polygon points="450,220 680,345 680,555 450,680 220,555 220,345" opacity="0.7"/>`,
      `<text x="450" y="490" text-anchor="middle" font-family="Georgia, serif" font-size="100" fill="currentColor">&amp;</text>`,
    ].join("\n    ")),
    "badges-7",
  ));

  // 08 — circular star burst
  out.push(svg(
    g(4, 0.9, [
      `<circle cx="450" cy="450" r="250" fill="currentColor" opacity="0.15"/>`,
      ...Array.from({ length: 24 }, (_, i) => {
        const a = (i * 2 * Math.PI) / 24;
        const len = i % 2 === 0 ? 280 : 240;
        const x = 450 + Math.cos(a) * len;
        const y = 450 + Math.sin(a) * len;
        return `<line x1="450" y1="450" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" opacity="0.4"/>`;
      }),
      `<circle cx="450" cy="450" r="120" fill="currentColor" opacity="0.5"/>`,
      `<text x="450" y="475" text-anchor="middle" font-family="Georgia, serif" font-size="60" fill="white">★</text>`,
    ].join("\n    ")),
    "badges-8",
  ));

  // 09 — wax-seal circle with leaves
  out.push(svg(
    g(5, 0.9, [
      `<circle cx="450" cy="450" r="220" fill="currentColor" opacity="0.4"/>`,
      `<circle cx="450" cy="450" r="180" stroke="currentColor" stroke-width="4" fill="none" opacity="0.8"/>`,
      ...Array.from({ length: 12 }, (_, i) => {
        const a = (i * 2 * Math.PI) / 12;
        return leaf(450 + Math.cos(a) * 180, 450 + Math.sin(a) * 180, 22, ((a * 180) / Math.PI) + 90);
      }),
      `<text x="450" y="475" text-anchor="middle" font-family="Georgia, serif" font-size="70" fill="currentColor">EST</text>`,
    ].join("\n    ")),
    "badges-9",
  ));

  // 10 — vertical pennant
  out.push(svg(
    g(4, 0.9, [
      `<path d="M380 150 L520 150 L520 600 L450 700 L380 600 Z" fill="currentColor" opacity="0.4"/>`,
      `<path d="M390 200 L510 200" opacity="0.7"/>`,
      `<text x="450" y="380" text-anchor="middle" font-family="Georgia, serif" font-size="56" fill="currentColor">A</text>`,
      `<text x="450" y="460" text-anchor="middle" font-family="Georgia, serif" font-size="36" fill="currentColor" opacity="0.8">&amp;</text>`,
      `<text x="450" y="540" text-anchor="middle" font-family="Georgia, serif" font-size="56" fill="currentColor">K</text>`,
    ].join("\n    ")),
    "badges-10",
  ));

  // 11 — minimal art-deco
  out.push(svg(
    g(4, 0.9, [
      `<rect x="280" y="320" width="340" height="260" fill="currentColor" opacity="0.15"/>`,
      `<rect x="300" y="340" width="300" height="220" stroke="currentColor" stroke-width="3" fill="none" opacity="0.7"/>`,
      `<line x1="280" y1="450" x2="200" y2="450"/>`,
      `<line x1="620" y1="450" x2="700" y2="450"/>`,
      `<text x="450" y="470" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="60" fill="currentColor">&amp;</text>`,
    ].join("\n    ")),
    "badges-11",
  ));

  // 12 — double ring with dot
  out.push(svg(
    g(4, 0.9, [
      `<circle cx="450" cy="450" r="240" stroke="currentColor" stroke-width="4" fill="none" opacity="0.6"/>`,
      `<circle cx="450" cy="450" r="200" stroke="currentColor" stroke-width="2" fill="none" opacity="0.4"/>`,
      `<circle cx="450" cy="450" r="14" fill="currentColor" opacity="0.8"/>`,
      ...Array.from({ length: 4 }, (_, i) => {
        const a = (i * Math.PI) / 2;
        return star(450 + Math.cos(a) * 240, 450 + Math.sin(a) * 240, 12, 5);
      }),
    ].join("\n    ")),
    "badges-12",
  ));

  return out;
}

/* ───────────────────── business-luxe ────────────────────────── */

function businessLuxe() {
  const out = [];

  // 01 — minimalist line + dot
  out.push(svg(
    g(3, 0.85, [
      `<line x1="100" y1="450" x2="350" y2="450"/>`,
      `<line x1="550" y1="450" x2="800" y2="450"/>`,
      `<circle cx="450" cy="450" r="6" fill="currentColor"/>`,
    ].join("\n    ")),
    "business-luxe-1",
  ));

  // 02 — cross hairs
  out.push(svg(
    g(2, 0.6, [
      `<line x1="450" y1="100" x2="450" y2="800"/>`,
      `<line x1="100" y1="450" x2="800" y2="450"/>`,
      `<circle cx="450" cy="450" r="20" stroke="currentColor" stroke-width="3" fill="none"/>`,
      `<circle cx="450" cy="450" r="6" fill="currentColor"/>`,
    ].join("\n    ")),
    "business-luxe-2",
  ));

  // 03 — concentric thin rings
  out.push(svg(
    g(2, 0.7, [
      `<circle cx="450" cy="450" r="280" fill="none"/>`,
      `<circle cx="450" cy="450" r="220" fill="none" opacity="0.7"/>`,
      `<circle cx="450" cy="450" r="160" fill="none" opacity="0.5"/>`,
      `<circle cx="450" cy="450" r="100" fill="none" opacity="0.4"/>`,
      `<circle cx="450" cy="450" r="40" fill="none" opacity="0.3"/>`,
    ].join("\n    ")),
    "business-luxe-3",
  ));

  // 04 — diagonal lines pattern
  out.push(svg(
    g(2, 0.4,
      Array.from({ length: 30 }, (_, i) => {
        const x = -100 + i * 50;
        return `<line x1="${x}" y1="0" x2="${x + 900}" y2="900"/>`;
      }).join("\n    "),
    ),
    "business-luxe-4",
  ));

  // 05 — art deco rays from bottom
  out.push(svg(
    g(2, 0.6, [
      `<line x1="450" y1="900" x2="450" y2="100"/>`,
      ...Array.from({ length: 20 }, (_, i) => {
        const a = -Math.PI / 2 + (-Math.PI / 4 + (i * Math.PI / 2) / 19);
        const x2 = 450 + Math.cos(a) * 700;
        const y2 = 900 + Math.sin(a) * 700;
        return `<line x1="450" y1="900" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" opacity="${(0.2 + (i % 3) * 0.15).toFixed(2)}"/>`;
      }),
    ].join("\n    ")),
    "business-luxe-5",
  ));

  // 06 — single thin square with dot grid
  out.push(svg(
    g(2, 0.7, [
      `<rect x="200" y="200" width="500" height="500" fill="none"/>`,
      ...Array.from({ length: 5 }, (_, i) =>
        Array.from({ length: 5 }, (_, j) =>
          dot(250 + i * 100, 250 + j * 100, 4, 0.5),
        ).join(""),
      ).join("\n    "),
    ].join("\n    ")),
    "business-luxe-6",
  ));

  // 07 — thin frame with corner brackets
  out.push(svg(
    g(3, 0.85, [
      `<path d="M150 220 L150 150 L220 150"/>`,
      `<path d="M680 150 L750 150 L750 220"/>`,
      `<path d="M750 680 L750 750 L680 750"/>`,
      `<path d="M220 750 L150 750 L150 680"/>`,
    ].join("\n    ")),
    "business-luxe-7",
  ));

  // 08 — golden ratio rectangle
  out.push(svg(
    g(2, 0.7, [
      `<rect x="150" y="200" width="600" height="500" fill="none"/>`,
      `<line x1="479" y1="200" x2="479" y2="700"/>`,
      `<line x1="150" y1="450" x2="479" y2="450"/>`,
      `<path d="M479 450 A171 171 0 0 1 308 621" fill="none" opacity="0.5"/>`,
    ].join("\n    ")),
    "business-luxe-8",
  ));

  // 09 — barcode/lines repetition
  out.push(svg(
    g(0, 0.7,
      Array.from({ length: 20 }, (_, i) => {
        const x = 150 + i * 30;
        const w = (i % 4 === 0 ? 4 : i % 3 === 0 ? 6 : 2);
        return `<rect x="${x}" y="380" width="${w}" height="140" fill="currentColor" opacity="${(0.3 + (i % 3) * 0.2).toFixed(2)}"/>`;
      }).join("\n    "),
    ),
    "business-luxe-9",
  ));

  // 10 — geometric triangle composition
  out.push(svg(
    g(2, 0.7, [
      `<polygon points="450,150 750,750 150,750" fill="currentColor" opacity="0.15"/>`,
      `<polygon points="450,250 660,690 240,690" fill="none" stroke="currentColor" stroke-width="3" opacity="0.6"/>`,
      `<polygon points="450,400 540,580 360,580" fill="currentColor" opacity="0.5"/>`,
    ].join("\n    ")),
    "business-luxe-10",
  ));

  // 11 — vertical rule with serif numerals
  out.push(svg(
    g(0, 0.85, [
      `<line x1="450" y1="100" x2="450" y2="800" stroke="currentColor" stroke-width="2" opacity="0.5"/>`,
      `<text x="450" y="240" text-anchor="middle" font-family="Georgia, serif" font-size="80" fill="currentColor">2026</text>`,
      `<text x="450" y="510" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="60" fill="currentColor" opacity="0.7">&amp;</text>`,
      `<text x="450" y="780" text-anchor="middle" font-family="Georgia, serif" font-size="40" fill="currentColor" opacity="0.6">EST.</text>`,
    ].join("\n    ")),
    "business-luxe-11",
  ));

  // 12 — sliced circle (pie chart-like minimal)
  out.push(svg(
    g(0, 0.85, [
      `<circle cx="450" cy="450" r="200" fill="none" stroke="currentColor" stroke-width="2" opacity="0.6"/>`,
      `<path d="M450 250 A200 200 0 0 1 622 550 L450 450 Z" fill="currentColor" opacity="0.45"/>`,
      `<line x1="450" y1="450" x2="450" y2="250" stroke="currentColor" stroke-width="1" opacity="0.4"/>`,
      `<line x1="450" y1="450" x2="622" y2="550" stroke="currentColor" stroke-width="1" opacity="0.4"/>`,
    ].join("\n    ")),
    "business-luxe-12",
  ));

  return out;
}

/* ───────────────────── baby-shower ──────────────────────────── */

function babyShower() {
  const out = [];

  // 01 — pacifier
  out.push(svg(
    g(5, 0.9, [
      `<circle cx="450" cy="450" r="120" fill="currentColor" opacity="0.3"/>`,
      `<circle cx="450" cy="450" r="80" fill="currentColor" opacity="0.6"/>`,
      `<ellipse cx="450" cy="610" rx="60" ry="80" fill="currentColor" opacity="0.5"/>`,
      `<ellipse cx="450" cy="610" rx="40" ry="55" fill="currentColor" opacity="0.7"/>`,
      `<line x1="370" y1="350" x2="320" y2="300"/>`,
      `<line x1="530" y1="350" x2="580" y2="300"/>`,
    ].join("\n    ")),
    "baby-shower-1",
  ));

  // 02 — onesie outline
  out.push(svg(
    g(5, 0.9, [
      `<path d="M340 280 Q340 230 380 230 L520 230 Q560 230 560 280 L580 380 Q620 400 620 460 L580 480 L580 600 Q580 650 530 650 L370 650 Q320 650 320 600 L320 480 L280 460 Q280 400 320 380 Z" fill="currentColor" opacity="0.3"/>`,
      `<circle cx="420" cy="500" r="10" fill="currentColor" opacity="0.7"/>`,
      `<circle cx="480" cy="500" r="10" fill="currentColor" opacity="0.7"/>`,
    ].join("\n    ")),
    "baby-shower-2",
  ));

  // 03 — cloud
  out.push(svg(
    g(6, 0.9, [
      `<path d="M260 480 Q260 380 360 380 Q380 320 460 320 Q540 320 560 380 Q650 380 650 460 Q700 480 670 540 Q670 580 600 580 L320 580 Q260 580 260 540 Q230 520 260 480 Z" fill="currentColor" opacity="0.4"/>`,
      `<path d="M360 380 Q380 320 460 320 Q540 320 560 380" opacity="0.7"/>`,
    ].join("\n    ")),
    "baby-shower-3",
  ));

  // 04 — star + moon
  out.push(svg(
    g(5, 0.9, [
      `<path d="M540 280 A140 140 0 1 0 660 540 A180 180 0 0 1 540 280 Z" fill="currentColor" opacity="0.5"/>`,
      star(280, 320, 60, 5),
      star(360, 600, 35, 5),
      dot(640, 220, 8),
      dot(720, 380, 6),
      dot(280, 560, 6),
    ].join("\n    ")),
    "baby-shower-4",
  ));

  // 05 — baby footprint
  out.push(svg(
    g(5, 0.9, [
      `<ellipse cx="380" cy="500" rx="80" ry="120" fill="currentColor" opacity="0.4"/>`,
      `<circle cx="320" cy="380" r="20" fill="currentColor" opacity="0.5"/>`,
      `<circle cx="350" cy="350" r="16" fill="currentColor" opacity="0.5"/>`,
      `<circle cx="385" cy="335" r="14" fill="currentColor" opacity="0.5"/>`,
      `<circle cx="420" cy="345" r="12" fill="currentColor" opacity="0.5"/>`,
      `<circle cx="450" cy="365" r="10" fill="currentColor" opacity="0.5"/>`,
    ].join("\n    ")),
    "baby-shower-5",
  ));

  // 06 — rattle
  out.push(svg(
    g(6, 0.9, [
      `<circle cx="380" cy="380" r="120" fill="currentColor" opacity="0.4"/>`,
      `<circle cx="380" cy="380" r="80" stroke="currentColor" stroke-width="4" fill="none" opacity="0.8"/>`,
      `<circle cx="380" cy="350" r="10" fill="currentColor" opacity="0.7"/>`,
      `<circle cx="370" cy="400" r="8" fill="currentColor" opacity="0.7"/>`,
      `<line x1="450" y1="450" x2="650" y2="650" stroke-width="20" opacity="0.5"/>`,
      `<rect x="640" y="640" width="60" height="60" rx="10" fill="currentColor" opacity="0.6"/>`,
    ].join("\n    ")),
    "baby-shower-6",
  ));

  // 07 — bib
  out.push(svg(
    g(5, 0.9, [
      `<path d="M360 280 Q360 240 400 240 L500 240 Q540 240 540 280 L580 320 Q620 360 620 440 L600 600 Q580 680 500 680 L400 680 Q320 680 300 600 L280 440 Q280 360 320 320 Z" fill="currentColor" opacity="0.35"/>`,
      `<path d="M360 280 Q450 320 540 280" opacity="0.7"/>`,
      `<text x="450" y="500" text-anchor="middle" font-family="Georgia, serif" font-size="60" fill="currentColor" opacity="0.8">♥</text>`,
    ].join("\n    ")),
    "baby-shower-7",
  ));

  // 08 — milk bottle
  out.push(svg(
    g(5, 0.9, [
      `<rect x="380" y="280" width="140" height="40" rx="20" fill="currentColor" opacity="0.6"/>`,
      `<rect x="370" y="320" width="160" height="60" fill="currentColor" opacity="0.4"/>`,
      `<path d="M370 380 Q360 400 360 440 L360 660 Q360 700 400 700 L500 700 Q540 700 540 660 L540 440 Q540 400 530 380 Z" fill="currentColor" opacity="0.3"/>`,
      `<line x1="380" y1="500" x2="520" y2="500" opacity="0.5"/>`,
      `<line x1="380" y1="560" x2="520" y2="560" opacity="0.5"/>`,
      `<line x1="380" y1="620" x2="520" y2="620" opacity="0.5"/>`,
    ].join("\n    ")),
    "baby-shower-8",
  ));

  // 09 — stork (very stylised)
  out.push(svg(
    g(5, 0.9, [
      `<ellipse cx="500" cy="400" rx="160" ry="80" fill="currentColor" opacity="0.4"/>`,
      `<circle cx="640" cy="340" r="36" fill="currentColor" opacity="0.5"/>`,
      `<path d="M676 340 L740 320 L720 360 Z" fill="currentColor" opacity="0.6"/>`,
      `<path d="M340 400 Q280 500 260 600"/>`,
      `<line x1="460" y1="480" x2="440" y2="640"/>`,
      `<line x1="540" y1="480" x2="560" y2="640"/>`,
      `<path d="M440 640 L420 660 L460 660 Z" fill="currentColor" opacity="0.6"/>`,
      `<path d="M560 640 L540 660 L580 660 Z" fill="currentColor" opacity="0.6"/>`,
    ].join("\n    ")),
    "baby-shower-9",
  ));

  // 10 — balloon
  out.push(svg(
    g(5, 0.9, [
      `<path d="M450 200 Q580 200 580 360 Q580 480 450 540 Q320 480 320 360 Q320 200 450 200 Z" fill="currentColor" opacity="0.4"/>`,
      `<path d="M430 540 L470 540 L450 580 Z" fill="currentColor" opacity="0.6"/>`,
      `<path d="M450 580 Q420 660 460 720 Q480 760 440 800"/>`,
    ].join("\n    ")),
    "baby-shower-10",
  ));

  // 11 — heart with wings
  out.push(svg(
    g(5, 0.9, [
      `<path d="M450 580 C200 420 220 240 360 220 C420 215 450 250 450 280 C450 250 480 215 540 220 C680 240 700 420 450 580 Z" fill="currentColor" opacity="0.4"/>`,
      `<path d="M260 380 Q160 350 100 400 Q200 410 260 440"/>`,
      `<path d="M640 380 Q740 350 800 400 Q700 410 640 440"/>`,
    ].join("\n    ")),
    "baby-shower-11",
  ));

  // 12 — mobile (hanging stars)
  out.push(svg(
    g(5, 0.9, [
      `<line x1="200" y1="280" x2="700" y2="280"/>`,
      `<line x1="280" y1="280" x2="280" y2="380"/>`,
      `<line x1="450" y1="280" x2="450" y2="450"/>`,
      `<line x1="620" y1="280" x2="620" y2="400"/>`,
      star(280, 420, 32, 5),
      star(450, 500, 36, 5),
      star(620, 440, 28, 5),
      `<circle cx="450" cy="180" r="20" fill="currentColor" opacity="0.6"/>`,
      `<line x1="450" y1="180" x2="450" y2="280" opacity="0.6"/>`,
    ].join("\n    ")),
    "baby-shower-12",
  ));

  return out;
}

/* ───────────────────── kids-party ───────────────────────────── */

function kidsParty() {
  const out = [];

  // 01 — balloon bunch
  out.push(svg(
    g(5, 0.9, [
      `<circle cx="380" cy="280" r="80" fill="currentColor" opacity="0.4"/>`,
      `<circle cx="500" cy="240" r="80" fill="currentColor" opacity="0.5"/>`,
      `<circle cx="620" cy="300" r="80" fill="currentColor" opacity="0.45"/>`,
      `<path d="M380 360 Q400 500 450 700"/>`,
      `<path d="M500 320 Q500 500 460 700"/>`,
      `<path d="M620 380 Q580 540 470 700"/>`,
      `<circle cx="450" cy="710" r="12" fill="currentColor"/>`,
    ].join("\n    ")),
    "kids-party-1",
  ));

  // 02 — birthday cake
  out.push(svg(
    g(5, 0.9, [
      `<rect x="240" y="500" width="420" height="160" rx="14" fill="currentColor" opacity="0.4"/>`,
      `<rect x="280" y="400" width="340" height="100" rx="10" fill="currentColor" opacity="0.5"/>`,
      `<rect x="320" y="320" width="260" height="80" rx="8" fill="currentColor" opacity="0.6"/>`,
      `<line x1="450" y1="240" x2="450" y2="320"/>`,
      `<path d="M440 240 Q450 200 460 240" fill="currentColor" opacity="0.7"/>`,
    ].join("\n    ")),
    "kids-party-2",
  ));

  // 03 — party hat
  out.push(svg(
    g(5, 0.9, [
      `<path d="M450 200 L650 600 L250 600 Z" fill="currentColor" opacity="0.4"/>`,
      `<line x1="320" y1="500" x2="580" y2="500" stroke-dasharray="6 8" opacity="0.7"/>`,
      `<line x1="290" y1="430" x2="610" y2="430" stroke-dasharray="6 8" opacity="0.5"/>`,
      `<circle cx="450" cy="200" r="22" fill="currentColor" opacity="0.7"/>`,
      `<line x1="250" y1="610" x2="650" y2="610" stroke-width="6"/>`,
    ].join("\n    ")),
    "kids-party-3",
  ));

  // 04 — gift box
  out.push(svg(
    g(5, 0.9, [
      `<rect x="240" y="380" width="420" height="320" fill="currentColor" opacity="0.35"/>`,
      `<rect x="240" y="320" width="420" height="80" fill="currentColor" opacity="0.55"/>`,
      `<line x1="450" y1="320" x2="450" y2="700" stroke-width="14" opacity="0.7"/>`,
      `<path d="M380 320 Q380 240 450 240 Q520 240 520 320" stroke-width="10" fill="none"/>`,
      `<path d="M450 240 Q400 220 410 280 Q450 260 450 240 Z" fill="currentColor" opacity="0.6"/>`,
      `<path d="M450 240 Q500 220 490 280 Q450 260 450 240 Z" fill="currentColor" opacity="0.6"/>`,
    ].join("\n    ")),
    "kids-party-4",
  ));

  // 05 — confetti scatter
  out.push(svg(
    g(0, 0.9,
      Array.from({ length: 30 }, (_, i) => {
        const x = 100 + (i * 27) % 700;
        const y = 100 + ((i * 47) % 700);
        const r = 6 + (i % 4) * 3;
        const op = 0.3 + (i % 3) * 0.2;
        if (i % 3 === 0) return `<rect x="${x}" y="${y}" width="${r * 2}" height="${r}" fill="currentColor" opacity="${op}" transform="rotate(${(i * 33) % 90} ${x + r} ${y + r / 2})"/>`;
        if (i % 3 === 1) return `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" opacity="${op}"/>`;
        return star(x, y, r, 5);
      }).join("\n    "),
    ),
    "kids-party-5",
  ));

  // 06 — ice cream cone
  out.push(svg(
    g(5, 0.9, [
      `<circle cx="450" cy="320" r="80" fill="currentColor" opacity="0.5"/>`,
      `<circle cx="400" cy="280" r="60" fill="currentColor" opacity="0.4"/>`,
      `<circle cx="500" cy="280" r="60" fill="currentColor" opacity="0.4"/>`,
      `<path d="M340 380 L450 700 L560 380 Z" fill="currentColor" opacity="0.45"/>`,
      `<line x1="380" y1="450" x2="520" y2="450" opacity="0.5"/>`,
      `<line x1="395" y1="500" x2="505" y2="500" opacity="0.5"/>`,
      `<line x1="410" y1="550" x2="490" y2="550" opacity="0.5"/>`,
      `<line x1="425" y1="600" x2="475" y2="600" opacity="0.5"/>`,
    ].join("\n    ")),
    "kids-party-6",
  ));

  // 07 — bunting flags
  out.push(svg(
    g(4, 0.9, [
      `<path d="M100 250 Q450 320 800 250"/>`,
      ...Array.from({ length: 7 }, (_, i) => {
        const x = 130 + i * 110;
        const y = 250 + Math.sin((i / 6) * Math.PI) * 40;
        return `<path d="M${x} ${y} L${x + 80} ${y} L${x + 40} ${y + 100} Z" fill="currentColor" opacity="${(0.3 + (i % 3) * 0.2).toFixed(2)}"/>`;
      }),
    ].join("\n    ")),
    "kids-party-7",
  ));

  // 08 — popcorn box
  out.push(svg(
    g(5, 0.9, [
      `<path d="M280 380 L340 720 L560 720 L620 380 Z" fill="currentColor" opacity="0.4"/>`,
      `<line x1="320" y1="500" x2="580" y2="500" opacity="0.5"/>`,
      `<line x1="310" y1="600" x2="590" y2="600" opacity="0.5"/>`,
      `<circle cx="380" cy="320" r="40" fill="currentColor" opacity="0.5"/>`,
      `<circle cx="450" cy="280" r="50" fill="currentColor" opacity="0.6"/>`,
      `<circle cx="540" cy="320" r="40" fill="currentColor" opacity="0.5"/>`,
      `<circle cx="430" cy="360" r="32" fill="currentColor" opacity="0.4"/>`,
      `<circle cx="500" cy="360" r="32" fill="currentColor" opacity="0.4"/>`,
    ].join("\n    ")),
    "kids-party-8",
  ));

  // 09 — number candle "5"
  out.push(svg(
    g(5, 0.9, [
      `<path d="M440 220 Q450 180 460 220" fill="currentColor" opacity="0.7"/>`,
      `<line x1="450" y1="240" x2="450" y2="320" stroke-width="8"/>`,
      `<text x="450" y="600" text-anchor="middle" font-family="Georgia, serif" font-size="320" font-weight="bold" fill="currentColor" opacity="0.6">5</text>`,
    ].join("\n    ")),
    "kids-party-9",
  ));

  // 10 — rainbow
  out.push(svg(
    g(0, 0.9,
      [80, 60, 40, 20].map((reduce, i) => {
        const r = 280 - reduce;
        const op = 0.6 - i * 0.1;
        return `<path d="M${450 - r} 600 A${r} ${r} 0 0 1 ${450 + r} 600" stroke="currentColor" stroke-width="36" fill="none" opacity="${op.toFixed(2)}"/>`;
      }).join("\n    "),
    ),
    "kids-party-10",
  ));

  // 11 — pinata (donkey-style abstract)
  out.push(svg(
    g(5, 0.9, [
      `<ellipse cx="450" cy="430" rx="200" ry="120" fill="currentColor" opacity="0.45"/>`,
      `<line x1="350" y1="540" x2="350" y2="660" stroke-width="10"/>`,
      `<line x1="550" y1="540" x2="550" y2="660" stroke-width="10"/>`,
      ...Array.from({ length: 5 }, (_, i) => {
        const x = 280 + i * 90;
        return `<path d="M${x} 360 L${x - 20} 320 L${x + 20} 320 Z" fill="currentColor" opacity="0.6"/>`;
      }),
      `<path d="M650 380 Q700 380 700 320" stroke-width="8"/>`,
    ].join("\n    ")),
    "kids-party-11",
  ));

  // 12 — donut
  out.push(svg(
    g(5, 0.9, [
      `<circle cx="450" cy="450" r="220" fill="currentColor" opacity="0.4"/>`,
      `<circle cx="450" cy="450" r="80" fill="white" stroke="currentColor" stroke-width="4"/>`,
      `<path d="M280 360 L240 340 M340 290 L320 250 M450 240 L450 200 M560 290 L580 250 M620 360 L660 340" stroke-width="8" stroke-linecap="round"/>`,
    ].join("\n    ")),
    "kids-party-12",
  ));

  return out;
}

/* ───────────────────── circumcision-classic ─────────────────── */

function circumcisionClassic() {
  const out = [];

  // 01 — crescent + star (Turkish)
  out.push(svg(
    g(5, 0.9, [
      `<path d="M520 250 A220 220 0 1 0 520 650 A180 180 0 0 1 520 250 Z" fill="currentColor" opacity="0.5"/>`,
      star(640, 450, 60, 5),
    ].join("\n    ")),
    "circumcision-classic-1",
  ));

  // 02 — gold medallion + "MAŞALLAH"
  out.push(svg(
    g(4, 0.9, [
      `<circle cx="450" cy="450" r="280" fill="currentColor" opacity="0.18"/>`,
      `<circle cx="450" cy="450" r="240" stroke="currentColor" stroke-width="4" fill="none" opacity="0.7"/>`,
      `<circle cx="450" cy="450" r="180" stroke="currentColor" stroke-width="2" fill="none" opacity="0.5"/>`,
      `<text x="450" y="475" text-anchor="middle" font-family="Georgia, serif" font-size="60" letter-spacing="4" fill="currentColor">MAŞALLAH</text>`,
    ].join("\n    ")),
    "circumcision-classic-2",
  ));

  // 03 — laurel wreath with crescent
  out.push(svg(
    g(5, 0.9, [
      ...Array.from({ length: 8 }, (_, i) => {
        const t = (i + 1) / 9;
        return [
          leaf(220, 230 + t * 440, 30, -65),
          leaf(680, 230 + t * 440, 30, 65),
        ].join("\n      ");
      }),
      `<path d="M220 670 Q450 740 680 670"/>`,
      `<path d="M520 380 A100 100 0 1 0 520 540 A80 80 0 0 1 520 380 Z" fill="currentColor" opacity="0.5"/>`,
      star(620, 460, 30, 5),
    ].join("\n    ")),
    "circumcision-classic-3",
  ));

  // 04 — Ottoman tulip
  out.push(svg(
    g(6, 0.9, [
      `<path d="M450 700 L450 440"/>`,
      `<path d="M380 460 Q360 320 410 260 Q420 380 440 380 Q420 280 470 240 Q500 360 460 400 Q500 280 540 320 Q540 420 460 440 Z" fill="currentColor" opacity="0.45"/>`,
      `<path d="M450 480 Q380 540 320 540" opacity="0.6"/>`,
      `<path d="M450 540 Q520 600 580 580" opacity="0.6"/>`,
    ].join("\n    ")),
    "circumcision-classic-4",
  ));

  // 05 — sünnet baş symbol (royal hat with feather)
  out.push(svg(
    g(5, 0.9, [
      `<path d="M280 540 L620 540 L600 360 Q450 320 300 360 Z" fill="currentColor" opacity="0.5"/>`,
      `<path d="M260 540 L640 540 L660 600 L240 600 Z" fill="currentColor" opacity="0.7"/>`,
      `<path d="M450 360 Q470 240 530 220 Q510 320 470 360" fill="currentColor" opacity="0.6"/>`,
      `<circle cx="380" cy="440" r="14" fill="currentColor" opacity="0.7"/>`,
      `<circle cx="520" cy="440" r="14" fill="currentColor" opacity="0.7"/>`,
    ].join("\n    ")),
    "circumcision-classic-5",
  ));

  // 06 — Geometric Ottoman pattern
  out.push(svg(
    g(3, 0.85, [
      ...Array.from({ length: 4 }, (_, ring) => {
        const r = 60 + ring * 60;
        return Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6 + (ring % 2 ? Math.PI / 12 : 0);
          const x = 450 + Math.cos(a) * r;
          const y = 450 + Math.sin(a) * r;
          return `<path d="M${x.toFixed(1)} ${y.toFixed(1)} L${(x + 20 * Math.cos(a + Math.PI / 6)).toFixed(1)} ${(y + 20 * Math.sin(a + Math.PI / 6)).toFixed(1)}" opacity="${(0.4 + ring * 0.15).toFixed(2)}"/>`;
        }).join("\n      ");
      }),
      `<circle cx="450" cy="450" r="20" fill="currentColor" opacity="0.7"/>`,
    ].join("\n    ")),
    "circumcision-classic-6",
  ));

  // 07 — gold chain border + center crescent
  out.push(svg(
    g(4, 0.9, [
      ...Array.from({ length: 16 }, (_, i) => {
        const a = (i * 2 * Math.PI) / 16;
        return `<circle cx="${(450 + Math.cos(a) * 320).toFixed(1)}" cy="${(450 + Math.sin(a) * 320).toFixed(1)}" r="14" stroke="currentColor" stroke-width="3" fill="none" opacity="0.7"/>`;
      }),
      `<path d="M520 320 A130 130 0 1 0 520 580 A110 110 0 0 1 520 320 Z" fill="currentColor" opacity="0.5"/>`,
      star(620, 450, 36, 5),
    ].join("\n    ")),
    "circumcision-classic-7",
  ));

  // 08 — ornate frame with text "SÜNNET"
  out.push(svg(
    g(4, 0.9, [
      `<rect x="180" y="350" width="540" height="200" rx="12" stroke="currentColor" stroke-width="3" fill="none"/>`,
      `<rect x="200" y="370" width="500" height="160" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>`,
      `<text x="450" y="475" text-anchor="middle" font-family="Georgia, serif" font-size="80" letter-spacing="14" fill="currentColor">SÜNNET</text>`,
    ].join("\n    ")),
    "circumcision-classic-8",
  ));

  // 09 — Twin crescents mirrored
  out.push(svg(
    g(5, 0.9, [
      `<path d="M380 250 A180 180 0 1 0 380 650 A150 150 0 0 1 380 250 Z" fill="currentColor" opacity="0.4"/>`,
      `<path d="M520 250 A180 180 0 1 1 520 650 A150 150 0 0 0 520 250 Z" fill="currentColor" opacity="0.4"/>`,
      star(450, 450, 50, 5),
    ].join("\n    ")),
    "circumcision-classic-9",
  ));

  // 10 — heart + crescent (love + faith)
  out.push(svg(
    g(5, 0.9, [
      `<path d="M450 700 C200 540 180 320 320 280 C400 260 440 320 450 360 C460 320 500 260 580 280 C720 320 700 540 450 700 Z" fill="currentColor" opacity="0.35"/>`,
      `<path d="M510 380 A80 80 0 1 0 510 540 A65 65 0 0 1 510 380 Z" fill="currentColor" opacity="0.6"/>`,
    ].join("\n    ")),
    "circumcision-classic-10",
  ));

  // 11 — radiating star
  out.push(svg(
    g(4, 0.9, [
      ...Array.from({ length: 16 }, (_, i) => {
        const a = (i * 2 * Math.PI) / 16;
        const x = 450 + Math.cos(a) * 320;
        const y = 450 + Math.sin(a) * 320;
        return `<line x1="450" y1="450" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" opacity="0.4"/>`;
      }),
      `<circle cx="450" cy="450" r="120" fill="currentColor" opacity="0.4"/>`,
      star(450, 450, 80, 5),
    ].join("\n    ")),
    "circumcision-classic-11",
  ));

  // 12 — Ottoman tugra-inspired (stylized signature)
  out.push(svg(
    g(5, 0.9, [
      `<path d="M180 500 Q200 320 360 320 Q480 320 480 400 Q480 460 420 460 Q360 460 360 400" fill="none"/>`,
      `<path d="M480 400 Q480 300 600 300 Q700 300 720 400" fill="none"/>`,
      `<line x1="180" y1="500" x2="720" y2="500"/>`,
      `<line x1="280" y1="500" x2="280" y2="600" opacity="0.7"/>`,
      `<line x1="380" y1="500" x2="380" y2="620" opacity="0.7"/>`,
      `<line x1="480" y1="500" x2="480" y2="640" opacity="0.7"/>`,
      `<line x1="580" y1="500" x2="580" y2="620" opacity="0.7"/>`,
      `<line x1="680" y1="500" x2="680" y2="600" opacity="0.7"/>`,
    ].join("\n    ")),
    "circumcision-classic-12",
  ));

  return out;
}

/* ───────────────────── wedding-essentials ───────────────────── */

function weddingEssentials() {
  const out = [];

  // 01 — interlocked rings
  out.push(svg(
    g(7, 0.9, [
      `<circle cx="380" cy="450" r="160" fill="none"/>`,
      `<circle cx="520" cy="450" r="160" fill="none" opacity="0.7"/>`,
      `<circle cx="380" cy="450" r="140" fill="none" opacity="0.4"/>`,
      `<circle cx="520" cy="450" r="140" fill="none" opacity="0.4"/>`,
      // Diamond on left ring
      `<path d="M380 280 L395 305 L380 330 L365 305 Z" fill="currentColor" opacity="0.7"/>`,
    ].join("\n    ")),
    "wedding-essentials-1",
  ));

  // 02 — heart with dove
  out.push(svg(
    g(5, 0.9, [
      `<path d="M450 720 C200 540 180 320 320 280 C400 260 440 320 450 360 C460 320 500 260 580 280 C720 320 700 540 450 720 Z" fill="currentColor" opacity="0.32"/>`,
      `<path d="M380 460 Q450 420 520 460 Q540 470 530 490 Q470 510 410 510 Q380 510 380 460 Z" fill="currentColor" opacity="0.7"/>`,
      `<path d="M520 460 L560 440 L555 470 Z" fill="currentColor" opacity="0.7"/>`,
      `<circle cx="540" cy="460" r="3" fill="white"/>`,
      `<path d="M380 460 Q360 480 350 510" opacity="0.7"/>`,
    ].join("\n    ")),
    "wedding-essentials-2",
  ));

  // 03 — wedding cake (3 tiers, ornate)
  out.push(svg(
    g(5, 0.9, [
      `<rect x="240" y="540" width="420" height="160" rx="14" fill="currentColor" opacity="0.35"/>`,
      `<rect x="280" y="420" width="340" height="120" rx="12" fill="currentColor" opacity="0.45"/>`,
      `<rect x="320" y="320" width="260" height="100" rx="10" fill="currentColor" opacity="0.55"/>`,
      `<path d="M280 480 Q330 460 380 480 Q430 460 480 480 Q530 460 580 480 Q620 460 620 480" stroke-width="3" opacity="0.7"/>`,
      `<path d="M240 600 Q290 580 340 600 Q390 580 440 600 Q490 580 540 600 Q590 580 660 600" stroke-width="3" opacity="0.7"/>`,
      `<path d="M450 320 L450 240"/>`,
      `<path d="M430 240 L470 240 M440 220 L460 220" opacity="0.7"/>`,
      `<circle cx="450" cy="200" r="14" fill="currentColor" opacity="0.6"/>`,
    ].join("\n    ")),
    "wedding-essentials-3",
  ));

  // 04 — bridal bouquet
  out.push(svg(
    g(5, 0.9, [
      `<path d="M400 540 Q380 700 360 800"/>`,
      `<path d="M450 540 Q450 700 450 800" opacity="0.7"/>`,
      `<path d="M500 540 Q520 700 540 800"/>`,
      rose(400, 380, 50),
      rose(500, 380, 50),
      daisy(450, 320, 45),
      tulip(380, 460, 70),
      tulip(520, 460, 70),
      leaf(340, 420, 30, -30),
      leaf(560, 420, 30, 30),
      leaf(450, 500, 28, 90),
      `<path d="M380 540 L520 540 L520 580 L380 580 Z" fill="currentColor" opacity="0.4"/>`,
    ].join("\n    ")),
    "wedding-essentials-4",
  ));

  // 05 — wedding arch
  out.push(svg(
    g(6, 0.9, [
      `<path d="M180 800 L180 380 Q180 180 450 180 Q720 180 720 380 L720 800"/>`,
      ...Array.from({ length: 8 }, (_, i) => {
        const t = i / 7;
        const a = Math.PI * (0.05 + t * 0.9);
        const x = 450 - Math.cos(a) * 270;
        const y = 380 - Math.sin(a) * 200;
        return `<g>
        ${rose(x, y, 28)}
        ${leaf(x - 30, y + 10, 22, -45)}
        ${leaf(x + 30, y + 10, 22, 45)}
      </g>`;
      }),
    ].join("\n    ")),
    "wedding-essentials-5",
  ));

  // 06 — champagne flutes clinking
  out.push(svg(
    g(5, 0.9, [
      `<path d="M340 240 L340 380 Q340 460 380 460 L380 700"/>`,
      `<path d="M420 240 L420 380 Q420 460 380 460"/>`,
      `<line x1="320" y1="700" x2="440" y2="700"/>`,
      `<path d="M340 320 Q380 340 420 320 L420 380 L340 380 Z" fill="currentColor" opacity="0.4"/>`,
      `<path d="M560 240 L560 380 Q560 460 520 460 L520 700"/>`,
      `<path d="M480 240 L480 380 Q480 460 520 460"/>`,
      `<line x1="460" y1="700" x2="580" y2="700"/>`,
      `<path d="M480 320 Q520 340 560 320 L560 380 L480 380 Z" fill="currentColor" opacity="0.4"/>`,
      // Sparkles
      star(450, 280, 20, 4),
      star(420, 220, 14, 4),
      star(480, 230, 14, 4),
    ].join("\n    ")),
    "wedding-essentials-6",
  ));

  // 07 — love letter envelope
  out.push(svg(
    g(5, 0.9, [
      `<rect x="200" y="320" width="500" height="320" rx="8" fill="currentColor" opacity="0.18"/>`,
      `<rect x="200" y="320" width="500" height="320" rx="8" fill="none"/>`,
      `<path d="M200 320 L450 520 L700 320" opacity="0.7"/>`,
      `<path d="M200 640 L380 480 M700 640 L520 480" opacity="0.5"/>`,
      `<path d="M450 380 C400 340 400 280 450 280 C500 280 500 340 450 380 Z" fill="currentColor" opacity="0.6"/>`,
    ].join("\n    ")),
    "wedding-essentials-7",
  ));

  // 08 — diamond ring with sparkle
  out.push(svg(
    g(5, 0.9, [
      `<circle cx="450" cy="540" r="160" fill="none"/>`,
      `<circle cx="450" cy="540" r="140" fill="none" opacity="0.4"/>`,
      `<path d="M450 280 L490 360 L450 440 L410 360 Z" fill="currentColor" opacity="0.6"/>`,
      `<path d="M410 360 L490 360 M450 280 L450 360" stroke="white" stroke-width="2"/>`,
      // Sparkles
      star(580, 330, 16, 4),
      star(330, 380, 14, 4),
      star(620, 460, 12, 4),
      star(280, 500, 12, 4),
    ].join("\n    ")),
    "wedding-essentials-8",
  ));

  // 09 — Mr & Mrs banner
  out.push(svg(
    g(5, 0.9, [
      `<path d="M150 350 Q450 280 750 350 L750 550 Q450 480 150 550 Z" fill="currentColor" opacity="0.35"/>`,
      `<text x="450" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="80" fill="currentColor">Mr &amp; Mrs</text>`,
    ].join("\n    ")),
    "wedding-essentials-9",
  ));

  // 10 — pair of doves
  out.push(svg(
    g(5, 0.9, [
      // Left dove
      `<path d="M250 400 Q200 380 200 440 Q200 480 250 480 Q300 470 320 440 Q360 420 350 400 Q330 380 290 400 Z" fill="currentColor" opacity="0.55"/>`,
      `<path d="M310 410 L350 390 L345 420 Z" fill="currentColor" opacity="0.7"/>`,
      `<circle cx="335" cy="405" r="3" fill="white"/>`,
      `<path d="M250 400 Q230 420 235 450" opacity="0.6"/>`,
      // Right dove (mirrored)
      `<path d="M650 400 Q700 380 700 440 Q700 480 650 480 Q600 470 580 440 Q540 420 550 400 Q570 380 610 400 Z" fill="currentColor" opacity="0.55"/>`,
      `<path d="M590 410 L550 390 L555 420 Z" fill="currentColor" opacity="0.7"/>`,
      `<circle cx="565" cy="405" r="3" fill="white"/>`,
      `<path d="M650 400 Q670 420 665 450" opacity="0.6"/>`,
      // Heart between
      `<path d="M450 540 C400 510 400 470 440 470 C460 470 460 490 450 500 C440 490 440 470 460 470 C500 470 500 510 450 540 Z" fill="currentColor" opacity="0.7"/>`,
    ].join("\n    ")),
    "wedding-essentials-10",
  ));

  // 11 — Save the Date with elegant frame
  out.push(svg(
    g(4, 0.9, [
      `<rect x="180" y="280" width="540" height="340" rx="10" fill="none"/>`,
      `<rect x="200" y="300" width="500" height="300" stroke-width="2" fill="none" opacity="0.5"/>`,
      `<text x="450" y="400" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="56" fill="currentColor">save the date</text>`,
      `<line x1="320" y1="430" x2="580" y2="430" stroke-width="1" opacity="0.6"/>`,
      `<text x="450" y="510" text-anchor="middle" font-family="Georgia, serif" font-size="80" fill="currentColor">15 · 06</text>`,
      `<text x="450" y="560" text-anchor="middle" font-family="Georgia, serif" font-size="32" letter-spacing="6" fill="currentColor" opacity="0.7">2026</text>`,
    ].join("\n    ")),
    "wedding-essentials-11",
  ));

  // 12 — bouquet wreath (circular)
  out.push(svg(
    g(5, 0.9, [
      `<circle cx="450" cy="450" r="240" fill="none" stroke="currentColor" stroke-width="3" opacity="0.5"/>`,
      ...Array.from({ length: 12 }, (_, i) => {
        const a = (i * 2 * Math.PI) / 12;
        const x = 450 + Math.cos(a) * 240;
        const y = 450 + Math.sin(a) * 240;
        if (i % 3 === 0) return rose(x, y, 30);
        if (i % 3 === 1) return daisy(x, y, 28);
        return leaf(x, y, 24, ((a * 180) / Math.PI) + 90);
      }),
    ].join("\n    ")),
    "wedding-essentials-12",
  ));

  // 13 — heart with initials placeholder
  out.push(svg(
    g(5, 0.9, [
      `<path d="M450 720 C200 540 180 320 320 280 C400 260 440 320 450 360 C460 320 500 260 580 280 C720 320 700 540 450 720 Z" fill="currentColor" opacity="0.18"/>`,
      `<path d="M450 720 C200 540 180 320 320 280 C400 260 440 320 450 360 C460 320 500 260 580 280 C720 320 700 540 450 720 Z" fill="none"/>`,
      `<text x="450" y="490" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="120" fill="currentColor">A &amp; K</text>`,
    ].join("\n    ")),
    "wedding-essentials-13",
  ));

  // 14 — laurel + "JUST MARRIED"
  out.push(svg(
    g(4, 0.9, [
      ...Array.from({ length: 8 }, (_, i) => {
        const t = (i + 1) / 9;
        return [
          leaf(220, 250 + t * 400, 28, -65),
          leaf(680, 250 + t * 400, 28, 65),
        ].join("\n      ");
      }),
      `<path d="M220 670 Q450 740 680 670"/>`,
      `<text x="450" y="430" text-anchor="middle" font-family="Georgia, serif" font-size="48" letter-spacing="6" fill="currentColor">JUST</text>`,
      `<text x="450" y="500" text-anchor="middle" font-family="Georgia, serif" font-size="48" letter-spacing="6" fill="currentColor">MARRIED</text>`,
    ].join("\n    ")),
    "wedding-essentials-14",
  ));

  // 15 — calendar with date "15"
  out.push(svg(
    g(5, 0.9, [
      `<rect x="240" y="240" width="420" height="420" rx="20" fill="currentColor" opacity="0.18"/>`,
      `<rect x="240" y="240" width="420" height="100" fill="currentColor" opacity="0.45"/>`,
      `<rect x="240" y="240" width="420" height="420" rx="20" fill="none"/>`,
      `<line x1="320" y1="200" x2="320" y2="280" stroke-width="14"/>`,
      `<line x1="580" y1="200" x2="580" y2="280" stroke-width="14"/>`,
      `<text x="450" y="305" text-anchor="middle" font-family="Georgia, serif" font-size="40" letter-spacing="6" fill="white">JUNE 2026</text>`,
      `<text x="450" y="540" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="200" fill="currentColor">15</text>`,
    ].join("\n    ")),
    "wedding-essentials-15",
  ));

  // 16 — entwined initials (single ornament)
  out.push(svg(
    g(0, 1, [
      `<text x="450" y="480" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="280" fill="currentColor" opacity="0.85">M&amp;Y</text>`,
      `<line x1="220" y1="540" x2="680" y2="540" stroke="currentColor" stroke-width="2" opacity="0.5"/>`,
      `<text x="450" y="600" text-anchor="middle" font-family="Georgia, serif" font-size="36" letter-spacing="10" fill="currentColor" opacity="0.7">FOREVER</text>`,
    ].join("\n    ")),
    "wedding-essentials-16",
  ));

  return out;
}

/* ───────────────────── monograms ────────────────────────────── */

function monograms() {
  const out = [];

  // Helper for circular monogram with frame
  function circleMono(letter1, letter2, decor) {
    return svg(
      g(0, 1, [
        `<circle cx="450" cy="450" r="280" stroke="currentColor" stroke-width="3" fill="none" opacity="0.7"/>`,
        `<circle cx="450" cy="450" r="240" stroke="currentColor" stroke-width="2" fill="none" opacity="0.4"/>`,
        decor,
        `<text x="350" y="510" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="180" fill="currentColor">${letter1}</text>`,
        `<text x="450" y="490" text-anchor="middle" font-family="Georgia, serif" font-size="100" fill="currentColor" opacity="0.7">·</text>`,
        `<text x="550" y="510" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="180" fill="currentColor">${letter2}</text>`,
      ].join("\n    ")),
      `monograms-circle`,
    );
  }

  // 01..04 — circle monograms with placeholder letters
  out.push(circleMono("A", "K", ""));
  out.push(circleMono("M", "Y", `<circle cx="450" cy="450" r="200" stroke="currentColor" stroke-width="1" fill="none" opacity="0.3" stroke-dasharray="4 8"/>`));
  out.push(circleMono("S", "E", `<text x="450" y="220" text-anchor="middle" font-family="Georgia, serif" font-size="32" letter-spacing="6" fill="currentColor" opacity="0.7">EST. 2026</text>`));
  out.push(circleMono("E", "B", `<path d="M250 660 Q450 750 650 660" stroke="currentColor" stroke-width="2" fill="none" opacity="0.5"/>`));

  // 05 — square monogram
  out.push(svg(
    g(0, 1, [
      `<rect x="180" y="180" width="540" height="540" stroke="currentColor" stroke-width="3" fill="none" opacity="0.6"/>`,
      `<rect x="220" y="220" width="460" height="460" stroke="currentColor" stroke-width="1" fill="none" opacity="0.4"/>`,
      `<text x="450" y="510" text-anchor="middle" font-family="Georgia, serif" font-size="240" fill="currentColor">M</text>`,
    ].join("\n    ")),
    "monograms-5",
  ));

  // 06 — diamond monogram
  out.push(svg(
    g(0, 1, [
      `<polygon points="450,150 750,450 450,750 150,450" stroke="currentColor" stroke-width="3" fill="none"/>`,
      `<polygon points="450,210 690,450 450,690 210,450" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>`,
      `<text x="450" y="500" text-anchor="middle" font-family="Georgia, serif" font-size="180" fill="currentColor">A</text>`,
    ].join("\n    ")),
    "monograms-6",
  ));

  // 07 — script-only monogram
  out.push(svg(
    g(0, 1, [
      `<text x="450" y="500" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="280" fill="currentColor">Aşk</text>`,
      `<line x1="200" y1="560" x2="700" y2="560" stroke="currentColor" stroke-width="2" opacity="0.5"/>`,
      `<text x="450" y="630" text-anchor="middle" font-family="Georgia, serif" font-size="40" letter-spacing="8" fill="currentColor" opacity="0.7">SONSUZA DEK</text>`,
    ].join("\n    ")),
    "monograms-7",
  ));

  // 08 — laurel monogram
  out.push(svg(
    g(5, 0.9, [
      ...Array.from({ length: 7 }, (_, i) => {
        const t = (i + 1) / 8;
        return [
          leaf(220, 250 + t * 400, 28, -65),
          leaf(680, 250 + t * 400, 28, 65),
        ].join("\n      ");
      }),
      `<g stroke="none" opacity="1">
       <text x="450" y="510" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="200" fill="currentColor">M&amp;K</text>
     </g>`,
    ].join("\n    ")),
    "monograms-8",
  ));

  // 09 — interlocked initials
  out.push(svg(
    g(0, 1, [
      `<text x="380" y="540" text-anchor="middle" font-family="Georgia, serif" font-size="320" fill="currentColor" opacity="0.7">A</text>`,
      `<text x="520" y="540" text-anchor="middle" font-family="Georgia, serif" font-size="320" fill="currentColor" opacity="0.5">K</text>`,
    ].join("\n    ")),
    "monograms-9",
  ));

  // 10 — single big letter with serifs
  out.push(svg(
    g(0, 1, [
      `<text x="450" y="600" text-anchor="middle" font-family="Georgia, serif" font-size="500" fill="currentColor" opacity="0.85">B</text>`,
      `<line x1="200" y1="640" x2="700" y2="640" stroke="currentColor" stroke-width="2" opacity="0.5"/>`,
    ].join("\n    ")),
    "monograms-10",
  ));

  // 11 — script ampersand
  out.push(svg(
    g(0, 1, [
      `<text x="450" y="600" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="500" fill="currentColor" opacity="0.85">&amp;</text>`,
    ].join("\n    ")),
    "monograms-11",
  ));

  // 12 — three-letter monogram (bride-middle-groom style)
  out.push(svg(
    g(0, 1, [
      `<circle cx="450" cy="450" r="260" stroke="currentColor" stroke-width="3" fill="none"/>`,
      `<text x="320" y="540" text-anchor="middle" font-family="Georgia, serif" font-size="120" fill="currentColor" opacity="0.6">A</text>`,
      `<text x="450" y="540" text-anchor="middle" font-family="Georgia, serif" font-size="200" fill="currentColor">M</text>`,
      `<text x="580" y="540" text-anchor="middle" font-family="Georgia, serif" font-size="120" fill="currentColor" opacity="0.6">K</text>`,
    ].join("\n    ")),
    "monograms-12",
  ));

  return out;
}

/* ───────────────────── henna-night (kına) ───────────────────── */

function hennaNight() {
  const out = [];

  // Paisley shape helper
  function paisley(cx, cy, size, rot = 0) {
    return `<g transform="translate(${cx} ${cy}) rotate(${rot})">
      <path d="M0 ${-size} Q${size * 0.7} ${-size * 0.7} ${size * 0.6} 0 Q${size * 0.5} ${size * 0.5} 0 ${size * 0.7} Q${-size * 0.3} ${size * 0.5} ${-size * 0.2} ${size * 0.2} Q${-size * 0.05} 0 0 ${-size} Z" fill="currentColor" opacity="0.4"/>
      <circle cx="0" cy="${-size * 0.3}" r="${size * 0.18}" fill="currentColor" opacity="0.7"/>
      <circle cx="0" cy="${-size * 0.3}" r="${size * 0.08}" fill="white"/>
    </g>`;
  }

  // 01 — central paisley
  out.push(svg(
    g(4, 0.9, [
      paisley(450, 450, 280, 0),
      ...Array.from({ length: 8 }, (_, i) => {
        const a = (i * 2 * Math.PI) / 8;
        return dot(450 + Math.cos(a) * 360, 450 + Math.sin(a) * 360, 8);
      }),
    ].join("\n    ")),
    "henna-night-1",
  ));

  // 02 — paisley wreath
  out.push(svg(
    g(0, 1,
      Array.from({ length: 8 }, (_, i) => {
        const a = (i * 2 * Math.PI) / 8;
        return paisley(450 + Math.cos(a) * 200, 450 + Math.sin(a) * 200, 100, ((a * 180) / Math.PI) + 90);
      }).join("\n    "),
    ),
    "henna-night-2",
  ));

  // 03 — mehndi mandala
  out.push(svg(
    g(3, 0.9, [
      `<circle cx="450" cy="450" r="40" fill="currentColor" opacity="0.6"/>`,
      ...Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return [
          `<line x1="450" y1="450" x2="${(450 + Math.cos(a) * 280).toFixed(1)}" y2="${(450 + Math.sin(a) * 280).toFixed(1)}" opacity="0.6"/>`,
          `<circle cx="${(450 + Math.cos(a) * 100).toFixed(1)}" cy="${(450 + Math.sin(a) * 100).toFixed(1)}" r="14" fill="currentColor" opacity="0.5"/>`,
          `<circle cx="${(450 + Math.cos(a) * 180).toFixed(1)}" cy="${(450 + Math.sin(a) * 180).toFixed(1)}" r="20" stroke="currentColor" stroke-width="2" fill="none" opacity="0.6"/>`,
          `<path d="M${(450 + Math.cos(a) * 240).toFixed(1)} ${(450 + Math.sin(a) * 240).toFixed(1)} L${(450 + Math.cos(a) * 280).toFixed(1)} ${(450 + Math.sin(a) * 280).toFixed(1)}" stroke-width="3"/>`,
        ].join("\n      ");
      }),
      `<circle cx="450" cy="450" r="180" fill="none" stroke-dasharray="6 8" opacity="0.5"/>`,
    ].join("\n    ")),
    "henna-night-3",
  ));

  // 04 — henna hand silhouette (simplified)
  out.push(svg(
    g(4, 0.9, [
      `<path d="M380 700 Q380 540 360 480 Q330 380 350 320 Q360 280 400 280 Q420 280 420 320 L420 420 Q430 280 460 280 Q480 280 480 320 L480 420 Q490 280 520 280 Q540 280 540 320 L540 420 Q550 320 580 320 Q600 320 600 360 Q600 480 580 540 Q540 700 540 720 L380 720 Z" fill="currentColor" opacity="0.4"/>`,
      // Henna pattern dots
      ...Array.from({ length: 6 }, (_, i) => dot(460, 480 + i * 25, 5, 0.7)),
      `<circle cx="460" cy="600" r="20" fill="none" stroke="currentColor" stroke-width="3" opacity="0.7"/>`,
      `<circle cx="460" cy="600" r="6" fill="currentColor" opacity="0.7"/>`,
    ].join("\n    ")),
    "henna-night-4",
  ));

  // 05 — crescent moon (kınanın kutsal)
  out.push(svg(
    g(5, 0.9, [
      `<path d="M450 220 A220 220 0 1 0 600 660 A180 180 0 0 1 450 220 Z" fill="currentColor" opacity="0.5"/>`,
      ...Array.from({ length: 7 }, (_, i) => star(640 + (i % 2 ? 30 : -30), 280 + i * 60, 14, 5)),
    ].join("\n    ")),
    "henna-night-5",
  ));

  // 06 — pomegranate (bereket)
  out.push(svg(
    g(5, 0.9, [
      `<circle cx="450" cy="500" r="200" fill="currentColor" opacity="0.4"/>`,
      `<path d="M420 320 L440 280 L440 320 M460 320 L460 280 M480 320 L480 280" stroke-width="6"/>`,
      `<circle cx="450" cy="320" r="10" fill="currentColor" opacity="0.7"/>`,
      ...Array.from({ length: 12 }, (_, i) => {
        const x = 360 + (i % 4) * 60;
        const y = 440 + Math.floor(i / 4) * 60;
        return dot(x, y, 12, 0.7);
      }),
    ].join("\n    ")),
    "henna-night-6",
  ));

  // 07 — lantern
  out.push(svg(
    g(5, 0.9, [
      `<line x1="450" y1="180" x2="450" y2="220"/>`,
      `<path d="M380 220 L520 220 L500 260 L400 260 Z" fill="currentColor" opacity="0.5"/>`,
      `<rect x="380" y="260" width="140" height="280" rx="10" fill="currentColor" opacity="0.35"/>`,
      `<line x1="380" y1="320" x2="520" y2="320" opacity="0.6"/>`,
      `<line x1="380" y1="480" x2="520" y2="480" opacity="0.6"/>`,
      `<line x1="430" y1="260" x2="430" y2="540" opacity="0.6"/>`,
      `<line x1="470" y1="260" x2="470" y2="540" opacity="0.6"/>`,
      `<path d="M380 540 L520 540 L500 580 L400 580 Z" fill="currentColor" opacity="0.5"/>`,
      `<circle cx="450" cy="400" r="30" fill="currentColor" opacity="0.7"/>`,
      `<circle cx="450" cy="400" r="14" fill="white"/>`,
    ].join("\n    ")),
    "henna-night-7",
  ));

  // 08 — geometric tile pattern
  out.push(svg(
    g(3, 0.85, [
      ...Array.from({ length: 5 }, (_, i) =>
        Array.from({ length: 5 }, (_, j) => {
          const cx = 250 + i * 100;
          const cy = 250 + j * 100;
          return `<polygon points="${cx},${cy - 30} ${cx + 30},${cy} ${cx},${cy + 30} ${cx - 30},${cy}" stroke="currentColor" stroke-width="2" fill="currentColor" opacity="${0.2 + ((i + j) % 3) * 0.15}"/>`;
        }).join(""),
      ).join("\n    "),
    ].join("\n    ")),
    "henna-night-8",
  ));

  // 09 — peacock feather (paisley + eye)
  out.push(svg(
    g(4, 0.9, [
      `<path d="M450 720 Q380 500 380 360 Q380 240 450 200 Q520 240 520 360 Q520 500 450 720 Z" fill="currentColor" opacity="0.4"/>`,
      `<circle cx="450" cy="320" r="40" fill="currentColor" opacity="0.6"/>`,
      `<circle cx="450" cy="320" r="22" fill="white"/>`,
      `<circle cx="450" cy="320" r="14" fill="currentColor" opacity="0.8"/>`,
      `<circle cx="450" cy="320" r="6" fill="white"/>`,
    ].join("\n    ")),
    "henna-night-9",
  ));

  // 10 — bridal henna circle ornament
  out.push(svg(
    g(3, 0.9, [
      `<circle cx="450" cy="450" r="280" fill="none" opacity="0.6"/>`,
      `<circle cx="450" cy="450" r="220" fill="none" opacity="0.4"/>`,
      `<circle cx="450" cy="450" r="160" fill="none" opacity="0.5"/>`,
      ...Array.from({ length: 16 }, (_, i) => {
        const a = (i * 2 * Math.PI) / 16;
        return dot(450 + Math.cos(a) * 280, 450 + Math.sin(a) * 280, 8);
      }),
      ...Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return paisley(450 + Math.cos(a) * 220, 450 + Math.sin(a) * 220, 50, ((a * 180) / Math.PI) + 90);
      }),
      `<text x="450" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="56" fill="currentColor">Kına</text>`,
    ].join("\n    ")),
    "henna-night-10",
  ));

  // 11 — turkish coffee cup
  out.push(svg(
    g(5, 0.9, [
      `<path d="M340 380 L340 580 Q340 660 450 660 Q560 660 560 580 L560 380 Z" fill="currentColor" opacity="0.4"/>`,
      `<ellipse cx="450" cy="380" rx="110" ry="20" fill="currentColor" opacity="0.6"/>`,
      `<path d="M560 440 Q620 440 620 500 Q620 560 560 560" stroke-width="6" fill="none"/>`,
      `<rect x="280" y="680" width="340" height="20" rx="4" fill="currentColor" opacity="0.6"/>`,
      // Steam
      `<path d="M400 320 Q380 280 420 240 Q440 220 420 180" opacity="0.5"/>`,
      `<path d="M450 320 Q470 280 430 240 Q410 220 430 180" opacity="0.5"/>`,
      `<path d="M500 320 Q480 280 520 240 Q540 220 520 180" opacity="0.5"/>`,
    ].join("\n    ")),
    "henna-night-11",
  ));

  // 12 — gold coin
  out.push(svg(
    g(0, 1, [
      `<circle cx="450" cy="450" r="280" fill="currentColor" opacity="0.5"/>`,
      `<circle cx="450" cy="450" r="240" fill="none" stroke="white" stroke-width="3" opacity="0.7"/>`,
      `<circle cx="450" cy="450" r="200" fill="none" stroke="currentColor" stroke-width="2" opacity="0.7"/>`,
      `<text x="450" y="510" text-anchor="middle" font-family="Georgia, serif" font-size="200" fill="white">₺</text>`,
    ].join("\n    ")),
    "henna-night-12",
  ));

  return out;
}

/* ───────────────────── engagement (nişan) ───────────────────── */

function engagement() {
  const out = [];

  // 01 — single ring with diamond
  out.push(svg(
    g(7, 0.9, [
      `<circle cx="450" cy="540" r="180" fill="none"/>`,
      `<circle cx="450" cy="540" r="160" fill="none" opacity="0.4"/>`,
      `<path d="M450 280 L500 360 L450 440 L400 360 Z" fill="currentColor" opacity="0.7"/>`,
      `<line x1="400" y1="360" x2="500" y2="360" stroke="white" stroke-width="2"/>`,
    ].join("\n    ")),
    "engagement-1",
  ));

  // 02 — ring on cushion
  out.push(svg(
    g(5, 0.9, [
      `<rect x="240" y="540" width="420" height="160" rx="40" fill="currentColor" opacity="0.3"/>`,
      `<rect x="240" y="540" width="420" height="160" rx="40" fill="none"/>`,
      `<circle cx="450" cy="450" r="100" fill="none"/>`,
      `<circle cx="450" cy="450" r="84" fill="none" opacity="0.5"/>`,
      `<path d="M450 290 L490 360 L450 410 L410 360 Z" fill="currentColor" opacity="0.7"/>`,
    ].join("\n    ")),
    "engagement-2",
  ));

  // 03 — flowers + ring
  out.push(svg(
    g(5, 0.9, [
      `<circle cx="450" cy="450" r="160" fill="none"/>`,
      rose(280, 280, 50),
      rose(620, 620, 50),
      daisy(620, 280, 40),
      daisy(280, 620, 40),
      leaf(340, 250, 28, -30),
      leaf(560, 650, 28, -30),
      leaf(650, 340, 28, 60),
      leaf(250, 560, 28, 60),
    ].join("\n    ")),
    "engagement-3",
  ));

  // 04 — hand-drawn heart
  out.push(svg(
    g(7, 0.9, [
      `<path d="M450 720 C200 540 180 320 320 280 C400 260 440 320 450 360 C460 320 500 260 580 280 C720 320 700 540 450 720 Z"/>`,
    ].join("\n    ")),
    "engagement-4",
  ));

  // 05 — "söz" (promise) banner
  out.push(svg(
    g(4, 0.9, [
      `<path d="M150 350 Q450 280 750 350 L750 550 Q450 480 150 550 Z" fill="currentColor" opacity="0.32"/>`,
      `<text x="450" y="475" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="80" fill="currentColor">söz</text>`,
    ].join("\n    ")),
    "engagement-5",
  ));

  // 06 — connecting hearts pair
  out.push(svg(
    g(5, 0.9, [
      `<path d="M310 510 C200 410 200 280 290 280 C340 280 350 320 360 360 C370 320 380 280 430 280 C520 280 520 410 410 510 Z" fill="currentColor" opacity="0.45"/>`,
      `<path d="M490 510 C380 410 380 280 470 280 C520 280 530 320 540 360 C550 320 560 280 610 280 C700 280 700 410 590 510 Z" fill="currentColor" opacity="0.45"/>`,
      `<line x1="410" y1="510" x2="490" y2="510" opacity="0.7"/>`,
    ].join("\n    ")),
    "engagement-6",
  ));

  // 07 — bow tie ribbon
  out.push(svg(
    g(5, 0.9, [
      `<path d="M450 450 L300 350 L260 480 L300 600 L450 450" fill="currentColor" opacity="0.5"/>`,
      `<path d="M450 450 L600 350 L640 480 L600 600 L450 450" fill="currentColor" opacity="0.5"/>`,
      `<rect x="430" y="420" width="40" height="60" fill="currentColor" opacity="0.7"/>`,
      `<line x1="430" y1="430" x2="430" y2="470"/>`,
      `<line x1="470" y1="430" x2="470" y2="470"/>`,
    ].join("\n    ")),
    "engagement-7",
  ));

  // 08 — ring + sparkle constellation
  out.push(svg(
    g(5, 0.9, [
      `<circle cx="450" cy="450" r="160" fill="none"/>`,
      `<path d="M450 290 L470 320 L450 350 L430 320 Z" fill="currentColor" opacity="0.7"/>`,
      ...[[200, 200], [700, 200], [180, 600], [720, 700], [300, 750], [600, 730]].map(
        ([x, y]) => star(x, y, 18, 4),
      ),
      ...[[150, 400], [780, 480], [250, 250], [680, 350]].map(
        ([x, y]) => dot(x, y, 5),
      ),
    ].join("\n    ")),
    "engagement-8",
  ));

  // 09 — overlapping hearts (subtle)
  out.push(svg(
    g(4, 0.9, [
      `<path d="M380 610 C200 470 200 290 320 270 C380 260 410 310 410 340 C410 310 440 260 500 270 C620 290 620 470 380 610 Z" fill="currentColor" opacity="0.3"/>`,
      `<path d="M520 670 C340 530 340 350 460 330 C520 320 550 370 550 400 C550 370 580 320 640 330 C760 350 760 530 520 670 Z" fill="currentColor" opacity="0.3"/>`,
    ].join("\n    ")),
    "engagement-9",
  ));

  // 10 — calendar marking engagement date
  out.push(svg(
    g(4, 0.9, [
      `<rect x="240" y="240" width="420" height="420" rx="20" stroke="currentColor" stroke-width="3" fill="none"/>`,
      `<rect x="240" y="240" width="420" height="80" fill="currentColor" opacity="0.4"/>`,
      `<text x="450" y="295" text-anchor="middle" font-family="Georgia, serif" font-size="32" letter-spacing="6" fill="white">NİŞAN</text>`,
      `<line x1="240" y1="380" x2="660" y2="380" opacity="0.5"/>`,
      `<line x1="240" y1="480" x2="660" y2="480" opacity="0.5"/>`,
      `<line x1="240" y1="580" x2="660" y2="580" opacity="0.5"/>`,
      `<line x1="380" y1="320" x2="380" y2="660" opacity="0.5"/>`,
      `<line x1="520" y1="320" x2="520" y2="660" opacity="0.5"/>`,
      `<circle cx="450" cy="530" r="32" fill="currentColor" opacity="0.6"/>`,
    ].join("\n    ")),
    "engagement-10",
  ));

  // 11 — promise — pinky link (abstract chain)
  out.push(svg(
    g(8, 0.9, [
      `<circle cx="380" cy="450" r="120" fill="none"/>`,
      `<circle cx="520" cy="450" r="120" fill="none"/>`,
      `<rect x="370" y="420" width="160" height="60" stroke="white" stroke-width="14" fill="none"/>`,
    ].join("\n    ")),
    "engagement-11",
  ));

  // 12 — twin doves with ring
  out.push(svg(
    g(5, 0.9, [
      `<path d="M250 400 Q200 380 200 440 Q200 480 250 480 Q300 470 320 440 Q360 420 350 400 Q330 380 290 400 Z" fill="currentColor" opacity="0.55"/>`,
      `<path d="M650 400 Q700 380 700 440 Q700 480 650 480 Q600 470 580 440 Q540 420 550 400 Q570 380 610 400 Z" fill="currentColor" opacity="0.55"/>`,
      `<circle cx="450" cy="540" r="80" fill="none"/>`,
      `<path d="M450 380 L470 420 L450 460 L430 420 Z" fill="currentColor" opacity="0.7"/>`,
    ].join("\n    ")),
    "engagement-12",
  ));

  return out;
}

/* ───────────────────── save-the-date ────────────────────────── */

function saveTheDate() {
  const out = [];

  // 01 — full calendar style
  out.push(svg(
    g(4, 0.9, [
      `<rect x="180" y="200" width="540" height="500" rx="20" fill="currentColor" opacity="0.18"/>`,
      `<rect x="180" y="200" width="540" height="120" fill="currentColor" opacity="0.5"/>`,
      `<rect x="180" y="200" width="540" height="500" rx="20" fill="none"/>`,
      `<text x="450" y="280" text-anchor="middle" font-family="Georgia, serif" font-size="48" letter-spacing="10" fill="white">JUNE 2026</text>`,
      // Day grid
      ...["P", "S", "Ç", "P", "C", "C", "P"].map((d, i) =>
        `<text x="${230 + i * 70}" y="380" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="currentColor" opacity="0.7">${d}</text>`,
      ),
      ...Array.from({ length: 30 }, (_, n) => {
        const day = n + 1;
        const col = (day - 1) % 7;
        const row = Math.floor((day - 1) / 7);
        const x = 230 + col * 70;
        const y = 430 + row * 60;
        if (day === 15) {
          return `<circle cx="${x}" cy="${y - 7}" r="22" fill="currentColor" opacity="0.7"/>
        <text x="${x}" y="${y}" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="white">${day}</text>`;
        }
        return `<text x="${x}" y="${y}" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="currentColor" opacity="0.6">${day}</text>`;
      }),
    ].join("\n    ")),
    "save-the-date-1",
  ));

  // 02 — large date stamp
  out.push(svg(
    g(0, 1, [
      `<text x="450" y="380" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="56" fill="currentColor" opacity="0.7">save the date</text>`,
      `<line x1="220" y1="420" x2="680" y2="420" stroke="currentColor" stroke-width="2"/>`,
      `<text x="450" y="540" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="160" fill="currentColor">15 · 06</text>`,
      `<line x1="220" y1="580" x2="680" y2="580" stroke="currentColor" stroke-width="2"/>`,
      `<text x="450" y="650" text-anchor="middle" font-family="Georgia, serif" font-size="40" letter-spacing="14" fill="currentColor" opacity="0.7">2026</text>`,
    ].join("\n    ")),
    "save-the-date-2",
  ));

  // 03 — postcard stamp corner
  out.push(svg(
    g(4, 0.9, [
      `<rect x="180" y="180" width="540" height="540" stroke="currentColor" stroke-width="3" fill="none"/>`,
      `<rect x="540" y="200" width="160" height="200" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="6 4"/>`,
      `<text x="620" y="260" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="currentColor">SAVE</text>`,
      `<text x="620" y="290" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="currentColor">THE</text>`,
      `<text x="620" y="320" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="currentColor">DATE</text>`,
      `<text x="620" y="370" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="20" fill="currentColor">15·06</text>`,
      `<text x="220" y="280" font-family="Georgia, serif" font-style="italic" font-size="40" fill="currentColor" opacity="0.7">Sevgili</text>`,
      `<line x1="220" y1="310" x2="500" y2="310" opacity="0.5"/>`,
      `<line x1="220" y1="370" x2="500" y2="370" opacity="0.4"/>`,
      `<line x1="220" y1="430" x2="500" y2="430" opacity="0.4"/>`,
    ].join("\n    ")),
    "save-the-date-3",
  ));

  // 04 — circle date
  out.push(svg(
    g(0, 1, [
      `<circle cx="450" cy="450" r="280" stroke="currentColor" stroke-width="3" fill="none"/>`,
      `<circle cx="450" cy="450" r="240" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>`,
      `<text x="450" y="380" text-anchor="middle" font-family="Georgia, serif" font-size="32" letter-spacing="10" fill="currentColor" opacity="0.7">SAVE THE DATE</text>`,
      `<text x="450" y="510" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="120" fill="currentColor">15·06·26</text>`,
    ].join("\n    ")),
    "save-the-date-4",
  ));

  // 05 — pen ribbon scroll
  out.push(svg(
    g(4, 0.9, [
      `<path d="M150 360 Q450 300 750 360 L750 540 Q450 480 150 540 Z" fill="currentColor" opacity="0.35"/>`,
      `<path d="M150 360 L100 410 L150 460" fill="currentColor" opacity="0.6"/>`,
      `<path d="M750 360 L800 410 L750 460" fill="currentColor" opacity="0.6"/>`,
      `<text x="450" y="470" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="60" fill="currentColor">save the date</text>`,
    ].join("\n    ")),
    "save-the-date-5",
  ));

  // 06 — calligraphic + ornament
  out.push(svg(
    g(4, 0.9, [
      `<path d="M250 380 Q300 360 350 380 Q400 400 450 380 Q500 360 550 380 Q600 400 650 380" stroke-width="2" opacity="0.6"/>`,
      `<text x="450" y="490" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="80" fill="currentColor">save the date</text>`,
      `<path d="M250 540 Q300 560 350 540 Q400 520 450 540 Q500 560 550 540 Q600 520 650 540" stroke-width="2" opacity="0.6"/>`,
      `<text x="450" y="600" text-anchor="middle" font-family="Georgia, serif" font-size="36" letter-spacing="8" fill="currentColor" opacity="0.7">15·06·2026</text>`,
    ].join("\n    ")),
    "save-the-date-6",
  ));

  // 07 — postage stamp style
  out.push(svg(
    g(0, 1, [
      // Perforated edge — circles around perimeter
      ...Array.from({ length: 14 }, (_, i) => `<circle cx="${150 + i * 45}" cy="170" r="8" fill="white" stroke="currentColor" stroke-width="2"/>`),
      ...Array.from({ length: 14 }, (_, i) => `<circle cx="${150 + i * 45}" cy="730" r="8" fill="white" stroke="currentColor" stroke-width="2"/>`),
      ...Array.from({ length: 14 }, (_, i) => `<circle cx="170" cy="${170 + i * 45}" r="8" fill="white" stroke="currentColor" stroke-width="2"/>`),
      ...Array.from({ length: 14 }, (_, i) => `<circle cx="730" cy="${170 + i * 45}" r="8" fill="white" stroke="currentColor" stroke-width="2"/>`),
      `<rect x="200" y="200" width="500" height="500" stroke="currentColor" stroke-width="3" fill="currentColor" fill-opacity="0.18"/>`,
      `<text x="450" y="380" text-anchor="middle" font-family="Georgia, serif" font-size="36" letter-spacing="10" fill="currentColor">SAVE THE DATE</text>`,
      `<text x="450" y="500" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="100" fill="currentColor">15</text>`,
      `<text x="450" y="570" text-anchor="middle" font-family="Georgia, serif" font-size="36" letter-spacing="10" fill="currentColor" opacity="0.7">JUNE 2026</text>`,
    ].join("\n    ")),
    "save-the-date-7",
  ));

  // 08 — heart-marked date
  out.push(svg(
    g(5, 0.9, [
      `<text x="320" y="500" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="100" fill="currentColor">15</text>`,
      `<text x="450" y="500" text-anchor="middle" font-family="Georgia, serif" font-size="100" fill="currentColor" opacity="0.5">·</text>`,
      `<text x="580" y="500" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="100" fill="currentColor">06</text>`,
      `<path d="M450 600 C420 575 420 545 440 545 C448 545 450 555 450 560 C450 555 452 545 460 545 C480 545 480 575 450 600 Z" fill="currentColor" opacity="0.7"/>`,
      `<text x="450" y="370" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="48" fill="currentColor" opacity="0.7">our wedding</text>`,
    ].join("\n    ")),
    "save-the-date-8",
  ));

  // 09 — torn paper edge
  out.push(svg(
    g(4, 0.9, [
      `<path d="M150 350 L170 340 L190 360 L210 345 L230 360 L250 340 L270 360 L290 350 L310 360 L330 345 L350 360 L370 340 L390 360 L410 350 L430 360 L450 340 L470 360 L490 345 L510 360 L530 340 L550 360 L570 350 L590 360 L610 345 L630 360 L650 340 L670 360 L690 350 L710 360 L730 345 L750 360 L750 540 L730 555 L710 540 L690 555 L670 540 L650 555 L630 540 L610 555 L590 540 L570 555 L550 540 L530 555 L510 540 L490 555 L470 540 L450 555 L430 540 L410 555 L390 540 L370 555 L350 540 L330 555 L310 540 L290 555 L270 540 L250 555 L230 540 L210 555 L190 540 L170 555 L150 540 Z" fill="currentColor" opacity="0.18"/>`,
      `<text x="450" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="56" letter-spacing="6" fill="currentColor">SAVE THE DATE</text>`,
    ].join("\n    ")),
    "save-the-date-9",
  ));

  // 10 — vertical date column
  out.push(svg(
    g(4, 0.9, [
      `<line x1="450" y1="180" x2="450" y2="720" stroke-width="2" opacity="0.5"/>`,
      `<text x="450" y="280" text-anchor="middle" font-family="Georgia, serif" font-size="40" letter-spacing="8" fill="currentColor">15</text>`,
      `<text x="450" y="340" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="28" fill="currentColor" opacity="0.7">JUN</text>`,
      `<text x="450" y="500" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="60" fill="currentColor">save</text>`,
      `<text x="450" y="560" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="60" fill="currentColor">the date</text>`,
      `<text x="450" y="680" text-anchor="middle" font-family="Georgia, serif" font-size="32" letter-spacing="8" fill="currentColor" opacity="0.7">2026</text>`,
    ].join("\n    ")),
    "save-the-date-10",
  ));

  // 11 — arch frame + date
  out.push(svg(
    g(5, 0.9, [
      `<path d="M180 720 L180 380 Q180 200 450 200 Q720 200 720 380 L720 720 Z" stroke-width="3" fill="none"/>`,
      `<text x="450" y="380" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="44" fill="currentColor" opacity="0.7">save the date</text>`,
      `<text x="450" y="510" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="120" fill="currentColor">15·06</text>`,
      `<text x="450" y="600" text-anchor="middle" font-family="Georgia, serif" font-size="36" letter-spacing="10" fill="currentColor" opacity="0.7">2026</text>`,
    ].join("\n    ")),
    "save-the-date-11",
  ));

  // 12 — minimal handwritten
  out.push(svg(
    g(4, 0.9, [
      `<text x="450" y="430" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="100" fill="currentColor">save the date</text>`,
      `<path d="M250 460 Q450 440 650 460" stroke-width="3" opacity="0.6"/>`,
      `<text x="450" y="600" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="80" fill="currentColor">15.06.2026</text>`,
    ].join("\n    ")),
    "save-the-date-12",
  ));

  return out;
}

/* ──────────────────────────── Run ─────────────────────────────── */

const generators = {
  "wedding-essentials": weddingEssentials,
  "monograms": monograms,
  "save-the-date": saveTheDate,
  "engagement": engagement,
  "henna-night": hennaNight,
  "botanical-frames": botanicalFrames,
  "floral-corners": floralCorners,
  "gold-ornaments": goldOrnaments,
  "dividers": dividers,
  "wax-seals": waxSeals,
  "badges": badges,
  "business-luxe": businessLuxe,
  "baby-shower": babyShower,
  "kids-party": kidsParty,
  "circumcision-classic": circumcisionClassic,
};

// Friendly category labels used in the editor picker UI.
const CATEGORY_LABELS = {
  "wedding-essentials": "Düğün Süslemeleri",
  "monograms": "Monogram",
  "save-the-date": "Tarihi Kaydet",
  "engagement": "Nişan",
  "henna-night": "Kına Gecesi",
  "botanical-frames": "Botanik Çerçeve",
  "floral-corners": "Çiçekli Köşe",
  "gold-ornaments": "Altın Süsleme",
  "dividers": "Ayraç",
  "wax-seals": "Mühür",
  "badges": "Rozet",
  "business-luxe": "Minimal Lüks",
  "baby-shower": "Bebek Mevlüdü",
  "kids-party": "Çocuk Partisi",
  "circumcision-classic": "Sünnet Klasik",
};

let total = 0;
const manifest = [];
for (const [category, fn] of Object.entries(generators)) {
  const dir = join(ROOT, category);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const files = fn();
  const items = [];
  files.forEach((content, i) => {
    const num = String(i + 1).padStart(2, "0");
    const filename = `${category}-${num}.svg`;
    writeFileSync(join(dir, filename), content);
    items.push({
      id: `${category}-${num}`,
      url: `/assets/templates/${category}/${filename}`,
    });
    total++;
  });
  manifest.push({
    key: category,
    label: CATEGORY_LABELS[category] ?? category,
    items,
  });
  console.log(`  ${category.padEnd(22)} ${files.length} files`);
}

// Emit a TypeScript manifest the editor consumes for the picker UI.
const manifestPath = resolve(
  __dirname,
  "..",
  "src",
  "components",
  "decorations",
  "templateManifest.ts",
);
mkdirSync(dirname(manifestPath), { recursive: true });
writeFileSync(
  manifestPath,
  `// AUTO-GENERATED by scripts/generate-decoration-templates.mjs — do not edit by hand.
export interface DecorationTemplate {
  id: string;
  url: string;
}

export interface DecorationTemplateCategory {
  key: string;
  label: string;
  items: DecorationTemplate[];
}

export const DECORATION_TEMPLATE_CATEGORIES: DecorationTemplateCategory[] =
  ${JSON.stringify(manifest, null, 2)};

export function findTemplate(id: string): DecorationTemplate | undefined {
  for (const cat of DECORATION_TEMPLATE_CATEGORIES) {
    const found = cat.items.find((i) => i.id === id);
    if (found) return found;
  }
  return undefined;
}
`,
);

console.log(
  `\n${total} decoration templates regenerated under public/assets/templates/`,
);
console.log(`Manifest: ${manifestPath}`);
