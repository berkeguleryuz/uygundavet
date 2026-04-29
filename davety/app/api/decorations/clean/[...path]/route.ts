import { readFile } from "node:fs/promises";
import { normalize, resolve } from "node:path";
import { NextResponse } from "next/server";
import { stripSvgText } from "@/app/components/buildDesignDoc";

/**
 * Galeri kart önizlemesi süsleme SVG'lerini CSS `mask-image` ile
 * yüklerken, dosyada gömülü `<text>` öğeleri (sabit "S · E" harfleri,
 * "EST. 2026" yazıları, vb.) maskede de görünüyor. Bu route, istenen
 * SVG'yi `/public/assets/templates/...` altından alır, metin
 * elementlerini temizler ve geri kalan saf süslemeyi `image/svg+xml`
 * olarak servis eder.
 *
 *   GET /api/decorations/clean/wedding-essentials/wedding-essentials-01.svg
 *
 * Path traversal'a karşı `resolve` ile public/assets/templates kökü
 * dışına çıkma kontrolü yapılır.
 */
const TEMPLATES_ROOT = resolve(
  process.cwd(),
  "public",
  "assets",
  "templates",
);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const rel = normalize(path.join("/"));

  if (!rel.endsWith(".svg") || rel.includes("..")) {
    return new NextResponse("Bad request", { status: 400 });
  }

  const abs = resolve(TEMPLATES_ROOT, rel);
  if (!abs.startsWith(TEMPLATES_ROOT)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  let raw: string;
  try {
    raw = await readFile(abs, "utf8");
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  const cleaned = stripSvgText(raw);
  return new NextResponse(cleaned, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      // SVG dosyaları statik — bir kez fetch edilip uzun süre cache'lensin.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
