/**
 * Downloads every URL in app/components/imageLibrary.ts into public/stock so
 * they can be self-hosted. Produces stock-manifest.json so the UI can switch
 * from Unsplash CDN URLs to local ones.
 *
 * Run:  npx tsx scripts/import-stock-images.ts
 *
 * The script is idempotent — existing files are skipped. It does NOT rewrite
 * imageLibrary.ts automatically; after the first run you can pipe the
 * manifest back (or update `url`/`thumb` to point at `/stock/<id>.jpg`).
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { STOCK_IMAGES } from "../app/components/imageLibrary";

const OUT_DIR = path.join(process.cwd(), "public", "stock");
const MANIFEST = path.join(OUT_DIR, "stock-manifest.json");

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const manifest: Array<{
    id: string;
    local: string;
    localThumb: string;
    credit: string;
  }> = [];
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const image of STOCK_IMAGES) {
    const name = image.id.replace(/^photo-/, "");
    const fullPath = path.join(OUT_DIR, `${name}.jpg`);
    const thumbPath = path.join(OUT_DIR, `${name}.thumb.jpg`);

    const hasFull = await exists(fullPath);
    const hasThumb = await exists(thumbPath);

    if (!hasFull) {
      const ok = await download(image.url, fullPath);
      if (ok) downloaded++;
      else failed++;
    } else {
      skipped++;
    }
    if (!hasThumb) {
      await download(image.thumb, thumbPath);
    }

    manifest.push({
      id: image.id,
      local: `/stock/${name}.jpg`,
      localThumb: `/stock/${name}.thumb.jpg`,
      credit: image.credit,
    });
  }

  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `Done. downloaded=${downloaded} skipped=${skipped} failed=${failed}. Manifest: ${MANIFEST}`
  );
}

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function download(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`! ${url} → ${res.status}`);
      return false;
    }
    const ab = await res.arrayBuffer();
    await fs.writeFile(dest, Buffer.from(ab));
    console.log(`✓ ${path.basename(dest)}`);
    return true;
  } catch (err) {
    console.warn(`! ${url} failed`, err);
    return false;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
