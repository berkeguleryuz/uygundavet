/**
 * Fetches curated images from Pexels for every template-image category,
 * converts them to webp (max 1600px wide, quality 80) and writes them
 * to /public/template-images/<category-id>/<idx>.webp. Then rewrites
 * /public/template-images/manifest.json with the full inventory.
 *
 * Run: npx tsx scripts/fetch-pexels-templates.ts
 *
 * Idempotent: existing files are kept, only missing slots are filled.
 * Pexels free-tier: 200 requests/hour, 20K/month. We stay well under.
 *
 * Pexels licence: free to use, modification allowed, no attribution
 * required (license: https://www.pexels.com/license/).
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

// .env.local / .env okuma — Next.js dotenv runtime, scriptte manuel.
async function loadEnv(): Promise<void> {
  for (const file of [".env.local", ".env"]) {
    try {
      const content = await fs.readFile(
        path.join(process.cwd(), file),
        "utf-8"
      );
      for (const raw of content.split("\n")) {
        const line = raw.trim();
        if (!line || line.startsWith("#")) continue;
        const eq = line.indexOf("=");
        if (eq === -1) continue;
        const key = line.slice(0, eq).trim();
        let val = line.slice(eq + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = val;
      }
    } catch {
      // missing file, ignore
    }
  }
}

interface CategorySpec {
  id: string;
  label: string;
  /** Pexels search queries, results merged + dedup'd. */
  queries: string[];
  /** Target image count for this category. */
  target: number;
}

/**
 * KURALLAR:
 * - Hiç insan içermeyen, dekoratif/obje/manzara/desen ağırlıklı görseller
 * - Davetiye arka planı için uygun (yumuşak, ortası boş, metin overlay'e
 *   uygun)
 * - Yüz / el / vücut close-up YOK
 * Pexels'in built-in "exclude people" filtresi yok, bu yüzden query'ler
 * obje-merkezli seçildi. Bu kelimeler insan döndüren sonuçları minimuma
 * indirir ama %100 garanti değil — script çalıştırdıktan sonra göz
 * gezdir, istemediğin dosyaları manuel sil.
 */
const CATEGORIES: CategorySpec[] = [
  {
    id: "wedding",
    label: "Düğün",
    queries: [
      "wedding flowers bouquet",
      "wedding rings closeup",
      "wedding decoration table",
      "wedding arch flowers",
      "wedding cake",
      "wedding candles",
      "white flowers wedding",
    ],
    target: 18,
  },
  {
    id: "engagement",
    label: "Nişan",
    queries: [
      "engagement ring",
      "rose petals",
      "diamond ring closeup",
      "champagne glasses",
      "rose roses background",
    ],
    target: 12,
  },
  {
    id: "henna",
    label: "Kına",
    queries: [
      "marigold flowers",
      "indian decoration",
      "rangoli pattern",
      "mehndi pattern art",
      "indian textile pattern",
      "orange flowers indian",
    ],
    target: 10,
  },
  {
    id: "betrothal",
    label: "Söz",
    queries: [
      "candle light romantic",
      "rose petals candles",
      "wine glasses dinner",
      "elegant table setting",
    ],
    target: 8,
  },
  {
    id: "birthday",
    label: "Doğum Günü",
    queries: [
      "birthday balloons",
      "birthday cake closeup",
      "party decoration colorful",
      "confetti celebration",
      "birthday candles cake",
      "balloon background",
    ],
    target: 12,
  },
  {
    id: "circumcision",
    label: "Sünnet",
    queries: [
      "blue balloons celebration",
      "boy party decoration",
      "blue confetti party",
      "blue silver decoration",
    ],
    target: 8,
  },
  {
    id: "baby-shower",
    label: "Baby Shower",
    queries: [
      "teddy bear toy",
      "baby toys pastel",
      "baby shower decoration",
      "pastel balloons",
      "baby items flatlay",
      "stuffed animals toys",
    ],
    target: 10,
  },
  {
    id: "graduation",
    label: "Mezuniyet",
    queries: [
      "graduation cap diploma",
      "graduation cap closeup",
      "diploma certificate",
      "books stack vintage",
      "academic books",
    ],
    target: 8,
  },
  {
    id: "anniversary",
    label: "Yıl Dönümü",
    queries: [
      "rose petals heart",
      "candle light dinner table",
      "champagne glasses cheers",
      "red roses bouquet",
      "anniversary decoration",
    ],
    target: 8,
  },
  {
    id: "general",
    label: "Genel",
    queries: [
      "elegant flowers background",
      "candle flame",
      "marble texture white",
      "gold sparkle bokeh",
      "watercolor pastel background",
      "abstract pastel texture",
      "floral pattern",
      "minimal beige background",
      "soft fabric texture",
    ],
    target: 16,
  },
];

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  alt: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    portrait: string;
    landscape: string;
    medium: string;
  };
}

interface ManifestItem {
  url: string;
  label?: string;
  width?: number;
  height?: number;
}

interface Manifest {
  version: number;
  categories: { id: string; label: string; items: ManifestItem[] }[];
}

const ROOT = path.join(process.cwd(), "public", "template-images");

async function searchPexels(
  apiKey: string,
  query: string,
  perPage: number
): Promise<PexelsPhoto[]> {
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("orientation", "portrait");
  const r = await fetch(url, { headers: { Authorization: apiKey } });
  if (!r.ok) {
    console.warn(`  ! Pexels ${r.status} for "${query}"`);
    return [];
  }
  const j = (await r.json()) as { photos: PexelsPhoto[] };
  return j.photos ?? [];
}

async function downloadAndConvert(
  src: string,
  outPath: string
): Promise<{ width: number; height: number } | null> {
  try {
    const r = await fetch(src);
    if (!r.ok) {
      console.warn(`  ! download ${r.status} ${src}`);
      return null;
    }
    const buf = Buffer.from(await r.arrayBuffer());
    const pipeline = sharp(buf).resize({
      width: 1600,
      height: 2400,
      fit: "inside",
      withoutEnlargement: true,
    });
    const meta = await pipeline.metadata();
    await pipeline.webp({ quality: 80, effort: 5 }).toFile(outPath);
    return { width: meta.width ?? 0, height: meta.height ?? 0 };
  } catch (e) {
    console.warn(`  ! convert failed ${src}`, e);
    return null;
  }
}

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function processCategory(
  spec: CategorySpec,
  apiKey: string
): Promise<ManifestItem[]> {
  const dir = path.join(ROOT, spec.id);
  await fs.mkdir(dir, { recursive: true });

  // Mevcut webp'leri keşfet, dolu slot'ları atla.
  const existing = (await fs.readdir(dir)).filter((f) => f.endsWith(".webp"));
  const items: ManifestItem[] = [];

  // Pexels arama sonuçlarını topla, photo.id ile dedup.
  const seen = new Set<number>();
  const candidates: PexelsPhoto[] = [];
  // İlk batch: target * 1.5 kadar sonuç çek, sonra fail-safe için fazlası
  // gerekirse sonraki query'lere geç.
  const perPage = Math.min(40, Math.ceil(spec.target * 1.6));
  for (const q of spec.queries) {
    if (candidates.length >= spec.target * 1.5) break;
    const photos = await searchPexels(apiKey, q, perPage);
    for (const p of photos) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      candidates.push(p);
    }
    // Pexels rate limit'e nazik ol
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log(
    `[${spec.id}] hedef ${spec.target}, mevcut ${existing.length}, aday ${candidates.length}`
  );

  // İlk önce mevcutları manifest'e ekle (fotoğraf id'lerini dosya adından
  // çıkar)
  for (const f of existing) {
    items.push({
      url: `/template-images/${spec.id}/${f}`,
    });
  }

  // Eksiklerini doldur
  for (const photo of candidates) {
    if (items.length >= spec.target) break;
    const fileName = `${photo.id}.webp`;
    const outPath = path.join(dir, fileName);
    if (await exists(outPath)) continue; // dosya varsa zaten manifestte
    const meta = await downloadAndConvert(photo.src.large2x, outPath);
    if (!meta) continue;
    items.push({
      url: `/template-images/${spec.id}/${fileName}`,
      width: meta.width,
      height: meta.height,
    });
    process.stdout.write(`  + ${spec.id}/${fileName}\n`);
  }

  return items;
}

async function main() {
  await loadEnv();
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.error("PEXELS_API_KEY env değişkeni bulunamadı");
    process.exit(1);
  }

  // --clean flag, tüm kategori klasörlerini siler ve sıfırdan çeker.
  // Idempotent moddan çıkıp temiz yeniden derleme yapar.
  const clean = process.argv.includes("--clean");
  if (clean) {
    console.log("--clean modu: mevcut görseller siliniyor...");
    for (const spec of CATEGORIES) {
      const dir = path.join(ROOT, spec.id);
      await fs.rm(dir, { recursive: true, force: true });
    }
  }

  await fs.mkdir(ROOT, { recursive: true });

  const manifest: Manifest = { version: 1, categories: [] };
  let total = 0;

  for (const spec of CATEGORIES) {
    const items = await processCategory(spec, apiKey);
    manifest.categories.push({ id: spec.id, label: spec.label, items });
    total += items.length;
  }

  await fs.writeFile(
    path.join(ROOT, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf-8"
  );

  console.log(`\nTamamlandı. ${total} görsel manifest.json'a yazıldı.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
