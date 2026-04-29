import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const { PREMIUM_TEMPLATES } = await import(
  pathToFileURL(path.join(root, "src/templates/premiumTemplates.ts")).href
);

const groups = [
  "floral-corners",
  "botanical-frames",
  "gold-ornaments",
  "wax-seals",
  "ribbons",
  "kids-party",
  "baby-shower",
  "circumcision-classic",
  "business-luxe",
  "monograms",
  "dividers",
  "badges",
];

const rootDir = path.join(root, "public/assets/templates");

for (const group of groups) {
  const dir = path.join(rootDir, group);
  fs.mkdirSync(dir, { recursive: true });
  for (let i = 1; i <= 12; i += 1) {
    const file = path.join(dir, `${group}-${String(i).padStart(2, "0")}.svg`);
    fs.writeFileSync(file, assetSvg(group, i), "utf8");
  }
}

const previewDir = path.join(rootDir, "previews");
fs.mkdirSync(previewDir, { recursive: true });
for (const template of PREMIUM_TEMPLATES) {
  fs.writeFileSync(
    path.join(previewDir, `${template.slug}.svg`),
    previewSvg(template),
    "utf8",
  );
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      assets: groups.length * 12,
      previews: PREMIUM_TEMPLATES.length,
    },
    null,
    2,
  ),
);

function assetSvg(group, index) {
  const hue = (index * 31 + group.length * 17) % 360;
  const accent = hsl(hue, 58, 48);
  const soft = hsl(hue, 66, 78);
  const deep = hsl(hue, 45, 30);
  const gold = "#c9a45b";
  const id = `${group}-${index}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900" fill="none" role="img" aria-label="${id}">
  <g stroke="${deep}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity="0.96">
    ${shapeFor(group, index, accent, soft, gold, deep)}
  </g>
</svg>
`;
}

function shapeFor(group, index, accent, soft, gold, deep) {
  if (group === "floral-corners") {
    return `
      <path d="M120 760 C220 640 270 530 292 390"/>
      <path d="M128 748 C230 720 302 662 346 568"/>
      ${flower(300, 520, 62, accent, soft)}
      ${flower(212, 650, 48, accent, soft)}
      <path d="M300 520 C378 470 444 394 486 292"/>
      <path d="M160 720 C132 648 142 590 190 548"/>
    `;
  }
  if (group === "botanical-frames") {
    return `
      <rect x="110" y="110" width="680" height="680" rx="${40 + index * 2}" stroke="${accent}" opacity="0.65"/>
      <path d="M168 704 C252 612 302 486 312 198"/>
      <path d="M732 196 C646 292 604 438 590 704"/>
      ${leafRun(225, 600, accent)}
      ${leafRun(662, 300, accent)}
    `;
  }
  if (group === "gold-ornaments") {
    return `
      <path d="M120 450 H348"/>
      <path d="M552 450 H780"/>
      <path d="M450 250 C520 330 520 570 450 650 C380 570 380 330 450 250Z" stroke="${gold}"/>
      <circle cx="450" cy="450" r="${84 + index * 2}" stroke="${gold}"/>
      <path d="M340 450 C382 390 518 390 560 450 C518 510 382 510 340 450Z"/>
    `;
  }
  if (group === "wax-seals") {
    return `
      <path d="M450 180 C548 180 600 254 690 284 C772 312 730 408 768 478 C810 555 716 604 690 682 C662 766 558 722 490 766 C420 812 362 724 282 718 C196 710 218 604 164 546 C108 486 190 418 188 344 C186 258 300 272 352 218 C382 188 414 180 450 180Z" fill="${accent}" stroke="${deepColor(accent)}"/>
      <circle cx="450" cy="450" r="170" stroke="${soft}" opacity="0.72"/>
      <path d="M360 462 C414 390 486 390 540 462"/>
      <path d="M382 514 H518"/>
    `;
  }
  if (group === "ribbons") {
    return `
      <path d="M164 324 C330 262 570 262 736 324 V542 C570 480 330 480 164 542Z" fill="${soft}" stroke="${accent}"/>
      <path d="M164 542 L86 650 V420 L164 458"/>
      <path d="M736 542 L814 650 V420 L736 458"/>
      <path d="M250 414 C380 374 520 374 650 414"/>
    `;
  }
  if (group === "kids-party") {
    return `
      <path d="M222 654 C312 540 408 488 522 510 C638 532 700 454 724 316"/>
      <circle cx="238" cy="308" r="88" fill="${soft}" stroke="${accent}"/>
      <circle cx="462" cy="220" r="70" fill="${accent}" stroke="${deep}"/>
      <circle cx="652" cy="338" r="78" fill="${soft}" stroke="${accent}"/>
      <path d="M238 396 C226 476 220 556 222 654"/>
      <path d="M462 290 C438 368 450 438 522 510"/>
      ${stars(5)}
    `;
  }
  if (group === "baby-shower") {
    return `
      <path d="M234 500 C234 376 330 274 450 274 C570 274 666 376 666 500 C666 620 570 704 450 704 C330 704 234 620 234 500Z" fill="${soft}" stroke="${accent}"/>
      <path d="M332 424 C390 478 510 478 568 424"/>
      <circle cx="378" cy="492" r="18" fill="${accent}" stroke="${accent}"/>
      <circle cx="522" cy="492" r="18" fill="${accent}" stroke="${accent}"/>
      <path d="M450 274 C450 210 512 182 562 214"/>
      <path d="M342 706 C332 760 378 792 428 756"/>
      <path d="M558 706 C568 760 522 792 472 756"/>
    `;
  }
  if (group === "circumcision-classic") {
    return `
      <path d="M192 598 H708"/>
      <path d="M270 598 V382 L450 232 L630 382 V598"/>
      <path d="M340 598 V442 H560 V598"/>
      <path d="M306 304 C392 350 508 350 594 304"/>
      <path d="M450 232 V154"/>
      <path d="M450 154 C486 154 510 176 518 202 C484 184 454 188 432 214"/>
      <circle cx="450" cy="442" r="52" stroke="${gold}"/>
    `;
  }
  if (group === "business-luxe") {
    return `
      <rect x="174" y="174" width="552" height="552" rx="36" stroke="${accent}"/>
      <path d="M278 450 H622"/>
      <path d="M450 278 V622"/>
      <path d="M312 312 L588 588"/>
      <path d="M588 312 L312 588"/>
      <circle cx="450" cy="450" r="${92 + index}" stroke="${gold}"/>
    `;
  }
  if (group === "monograms") {
    return `
      <circle cx="450" cy="450" r="268" stroke="${accent}"/>
      <circle cx="450" cy="450" r="212" stroke="${gold}"/>
      <path d="M332 548 V352 L450 512 L568 352 V548"/>
      <path d="M286 450 H218"/>
      <path d="M682 450 H614"/>
      <path d="M450 218 V286"/>
      <path d="M450 614 V682"/>
    `;
  }
  if (group === "dividers") {
    return `
      <path d="M116 450 H326"/>
      <path d="M574 450 H784"/>
      <path d="M450 350 C512 398 512 502 450 550 C388 502 388 398 450 350Z" fill="${soft}" stroke="${accent}"/>
      <circle cx="450" cy="450" r="28" fill="${accent}" stroke="${accent}"/>
      <path d="M326 450 C364 410 398 410 426 450"/>
      <path d="M574 450 C536 490 502 490 474 450"/>
    `;
  }
  return `
    <path d="M450 138 L540 318 L740 348 L595 490 L628 692 L450 596 L272 692 L305 490 L160 348 L360 318Z" fill="${soft}" stroke="${accent}"/>
    <circle cx="450" cy="450" r="112" stroke="${gold}"/>
    <path d="M384 450 H516"/>
    <path d="M450 384 V516"/>
  `;
}

function previewSvg(template) {
  const p = template.palette;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1400" viewBox="0 0 1000 1400" fill="none" role="img" aria-label="${template.title}">
  <rect width="1000" height="1400" fill="${p.page}"/>
  <rect x="128" y="94" width="744" height="1212" rx="42" fill="${p.bg}"/>
  <rect x="164" y="130" width="672" height="1140" rx="32" stroke="${p.accent}" stroke-width="8" opacity="0.54"/>
  <path d="M246 286 C340 190 660 190 754 286" stroke="${p.accent}" stroke-width="9" stroke-linecap="round" opacity="0.68"/>
  <circle cx="500" cy="366" r="74" fill="${p.accent}" opacity="0.13"/>
  <text x="500" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="76" fill="${p.text}">${escapeXml(template.hero.primary)}</text>
  <text x="500" y="548" text-anchor="middle" font-family="Georgia, serif" font-size="52" fill="${p.accent}">&amp;</text>
  <text x="500" y="634" text-anchor="middle" font-family="Georgia, serif" font-size="76" fill="${p.text}">${escapeXml(template.hero.secondary)}</text>
  <text x="500" y="734" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" letter-spacing="4" fill="${p.accent}">${escapeXml(template.hero.subtitle.toLocaleUpperCase("tr"))}</text>
  <path d="M318 812 H682" stroke="${p.accent}" stroke-width="4" stroke-linecap="round" opacity="0.5"/>
  <text x="500" y="902" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" fill="${p.text}">${escapeXml(categoryLabel(template.category))}</text>
  <text x="500" y="976" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="${p.text}" opacity="0.72">12 Eylül 2026 · 19:30</text>
  <rect x="310" y="1060" width="380" height="76" rx="38" fill="${p.accent}" opacity="0.95"/>
  <text x="500" y="1109" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="${p.bg}">DAVETİYEYİ DÜZENLE</text>
</svg>
`;
}

function flower(x, y, size, accent, soft) {
  return `
    <circle cx="${x}" cy="${y}" r="${size * 0.26}" fill="${accent}" stroke="${accent}"/>
    <ellipse cx="${x}" cy="${y - size * 0.46}" rx="${size * 0.2}" ry="${size * 0.42}" fill="${soft}" stroke="${accent}"/>
    <ellipse cx="${x + size * 0.4}" cy="${y}" rx="${size * 0.42}" ry="${size * 0.2}" fill="${soft}" stroke="${accent}"/>
    <ellipse cx="${x}" cy="${y + size * 0.46}" rx="${size * 0.2}" ry="${size * 0.42}" fill="${soft}" stroke="${accent}"/>
    <ellipse cx="${x - size * 0.4}" cy="${y}" rx="${size * 0.42}" ry="${size * 0.2}" fill="${soft}" stroke="${accent}"/>
  `;
}

function leafRun(x, y, accent) {
  return `
    <path d="M${x} ${y} C${x + 80} ${y - 80} ${x + 120} ${y - 190} ${x + 116} ${y - 310}"/>
    <path d="M${x + 42} ${y - 80} C${x - 10} ${y - 104} ${x - 4} ${y - 160} ${x + 62} ${y - 154}" fill="${accent}" opacity="0.25"/>
    <path d="M${x + 86} ${y - 182} C${x + 146} ${y - 208} ${x + 144} ${y - 272} ${x + 76} ${y - 254}" fill="${accent}" opacity="0.25"/>
  `;
}

function stars(count) {
  let out = "";
  for (let i = 0; i < count; i += 1) {
    const x = 160 + i * 140;
    const y = 180 + (i % 2) * 430;
    out += `<path d="M${x} ${y - 26} L${x + 12} ${y - 8} L${x + 34} ${y} L${x + 12} ${y + 8} L${x} ${y + 26} L${x - 12} ${y + 8} L${x - 34} ${y} L${x - 12} ${y - 8}Z"/>`;
  }
  return out;
}

function hsl(h, s, l) {
  return `hsl(${h} ${s}% ${l}%)`;
}

function deepColor() {
  return "#3c3021";
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function categoryLabel(category) {
  const labels = {
    wedding: "Düğün",
    engagement: "Nişan / Nikah",
    henna: "Kına",
    circumcision: "Sünnet",
    birthday: "Doğum Günü",
    baby: "Baby Shower",
    celebration: "Özel Kutlama",
    business: "Açılış / Lansman",
  };
  return labels[category] ?? category;
}
