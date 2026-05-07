import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

/**
 * Print-friendly HTML view of a published invitation. Browser's native
 * "Save as PDF" / Cmd+P prints this single-page version with optimized
 * print CSS. No external PDF lib needed, every browser already has a
 * good PDF engine.
 *
 * Tier gate: Free tier'da kullanıcı PDF indiremesin, sayfa 402 döner.
 * Diğer tier'larda davetiyenin print-friendly HTML'i serve edilir.
 *
 * Auth: yayında olan davetiyeyi herkes görebilir (host'un paylaştığı
 * link gibi), ama route public olduğu için tier check `publishedDoc`
 * üzerinden okunan tier ile yapılır, host kendi cihazında bile Free
 * ise PDF alamaz.
 */
type Params = Promise<{ slug: string }>;

export async function GET(_: Request, ctx: { params: Params }) {
  const { slug } = await ctx.params;

  const design = await prisma.invitationDesign.findFirst({
    where: { OR: [{ slug }, { vanityPath: slug }], status: "published" },
    select: { publishedDoc: true, slug: true },
  });
  if (!design || !design.publishedDoc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const doc = design.publishedDoc as {
    meta?: { tier?: string; weddingDate?: string; weddingTime?: string };
    blocks?: Array<{ type: string; data?: Record<string, unknown> }>;
    theme?: { bgColor?: string; accentColor?: string };
  };

  const tier = doc.meta?.tier ?? "free";
  if (tier === "free") {
    return NextResponse.json(
      {
        error: "PdfLocked",
        message: "PDF indirme Klasik+ paketinde açılır.",
      },
      { status: 402 }
    );
  }

  const hero = doc.blocks?.find((b) => b.type === "hero");
  const heroData = hero?.data as
    | { brideName?: string; groomName?: string; subtitle?: string; description?: string }
    | undefined;
  const venue = doc.blocks?.find((b) => b.type === "venue");
  const venueData = venue?.data as
    | { venueName?: string; venueAddress?: string }
    | undefined;
  const program = doc.blocks?.find((b) => b.type === "event_program");
  const programData = program?.data as
    | {
        items?: Array<{ time?: string; label?: string }>;
        eventDays?: Array<{ label?: string; date?: string; time?: string }>;
      }
    | undefined;

  const couple =
    heroData?.brideName && heroData?.groomName
      ? `${heroData.brideName} & ${heroData.groomName}`
      : heroData?.brideName ?? "Davetiye";
  const dateStr = doc.meta?.weddingDate
    ? new Date(doc.meta.weddingDate).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
      })
    : "";
  const timeStr = doc.meta?.weddingTime ?? "";

  const bg = doc.theme?.bgColor ?? "#fdfbf4";
  const accent = doc.theme?.accentColor ?? "#3a2e18";

  // Print-optimised single-page HTML. Cmd+P / Ctrl+P → "Save as PDF"
  // ile kullanıcı tek tıkla PDF alır. CSS @page A5 portrait, etrafında
  // ince bir altın çerçeve ve net tipografi.
  const html = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(couple)} davetiye</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Merienda:wght@400;700&family=Space+Grotesk:wght@300;400;500&display=swap" rel="stylesheet" />
<style>
  @page { size: A5 portrait; margin: 0; }
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0;
    background: ${bg};
    color: ${accent};
    font-family: "Space Grotesk", sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    width: 148mm; height: 210mm;
    padding: 18mm 14mm;
    margin: 0 auto;
    display: flex; flex-direction: column;
    align-items: center; justify-content: space-between;
    text-align: center;
    background: ${bg};
    position: relative;
  }
  .page::before {
    content: ""; position: absolute;
    inset: 8mm;
    border: 1px solid ${accent};
    opacity: 0.25;
    pointer-events: none;
  }
  .subtitle {
    font-size: 10pt; letter-spacing: 0.3em;
    text-transform: uppercase; opacity: 0.7;
    margin-bottom: 6mm;
  }
  .couple {
    font-family: "Merienda", serif;
    font-weight: 700;
    font-size: 32pt;
    line-height: 1.05;
    margin-bottom: 6mm;
  }
  .ampersand {
    font-family: "Merienda", serif;
    font-style: italic;
    font-size: 16pt;
    opacity: 0.7;
    margin: 0 0.5em;
  }
  .description {
    font-size: 11pt; line-height: 1.5;
    max-width: 105mm;
    opacity: 0.85;
    margin-bottom: 8mm;
  }
  .divider {
    width: 22mm; height: 1px;
    background: ${accent};
    opacity: 0.5;
    margin: 4mm 0;
  }
  .date {
    font-family: "Merienda", serif;
    font-size: 18pt;
    font-weight: 700;
    margin: 4mm 0 2mm;
  }
  .time {
    font-size: 12pt;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    opacity: 0.85;
    margin-bottom: 6mm;
  }
  .venue {
    font-size: 11pt; line-height: 1.4;
    max-width: 100mm;
    opacity: 0.85;
  }
  .venue strong { font-weight: 600; }
  .program {
    margin-top: 8mm;
    font-size: 9.5pt;
    line-height: 1.6;
    opacity: 0.8;
  }
  .program-row {
    display: flex; justify-content: center; gap: 12mm;
    border-bottom: 1px dotted ${accent}40;
    padding: 1.2mm 0;
  }
  .program-row .t { width: 14mm; text-align: right; opacity: 0.7; }
  .program-row .l { text-align: left; }
  .footer {
    margin-top: 10mm;
    font-size: 8pt;
    opacity: 0.55;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  @media screen {
    body { padding: 24px; background: #f5f6f3; }
    .page { box-shadow: 0 24px 60px -20px rgba(0,0,0,0.25); }
    .print-toolbar {
      position: fixed; top: 16px; right: 16px;
      display: flex; gap: 8px;
    }
    .print-toolbar button {
      background: #252224; color: #d5d1ad;
      border: 0; padding: 12px 22px;
      font-family: "Space Grotesk", sans-serif;
      font-size: 12px; letter-spacing: 0.2em;
      text-transform: uppercase; font-weight: 600;
      border-radius: 999px;
      cursor: pointer;
    }
    .print-toolbar button:hover { background: #1c1a1b; }
  }
  @media print {
    .print-toolbar { display: none !important; }
  }
</style>
</head>
<body>
<div class="print-toolbar">
  <button onclick="window.print()">PDF Olarak Kaydet</button>
</div>
<div class="page">
  <div>
    ${heroData?.subtitle ? `<div class="subtitle">${escapeHtml(heroData.subtitle)}</div>` : ""}
    <div class="couple">
      ${escapeHtml(heroData?.brideName ?? "")}
      ${heroData?.groomName ? `<div class="ampersand">&amp;</div>${escapeHtml(heroData.groomName)}` : ""}
    </div>
    ${heroData?.description ? `<div class="description">${escapeHtml(heroData.description)}</div>` : ""}
    <div class="divider"></div>
    <div class="date">${escapeHtml(dateStr)}</div>
    <div class="time">${escapeHtml(timeStr)}</div>
    ${
      venueData?.venueName
        ? `<div class="venue"><strong>${escapeHtml(venueData.venueName)}</strong>${venueData.venueAddress ? `<br/>${escapeHtml(venueData.venueAddress)}` : ""}</div>`
        : ""
    }
    ${
      programData?.items && programData.items.length > 0
        ? `<div class="program">${programData.items
            .map(
              (it) =>
                `<div class="program-row"><span class="t">${escapeHtml(it.time ?? "")}</span><span class="l">${escapeHtml(it.label ?? "")}</span></div>`
            )
            .join("")}</div>`
        : ""
    }
  </div>
  <div class="footer">davetyolla.com</div>
</div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, max-age=0",
    },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
