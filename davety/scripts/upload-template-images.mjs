#!/usr/bin/env node
/**
 * Hazır görseller migrasyon scripti.
 *
 *   /public/template-images/{category}/*.webp
 *     →  R2:  system/template-images/{category}/*.webp
 *
 * "system/" prefix'i KASITLI — kullanıcı asset'leri (`users/{userId}/...`)
 * dışında, sistem tarafından yüklenen kalıcı içerik. `deleteR2Prefix`
 * `system/` altını silmeyi reddeder (src/lib/r2.ts'deki guard).
 *
 * Çalıştırma:
 *   node scripts/upload-template-images.mjs            # tüm kategoriler
 *   node scripts/upload-template-images.mjs wedding    # sadece wedding
 *
 * Env: .env'den otomatik yüklenir (Next CLI tarzı).
 *      R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
 *      R2_BUCKET, R2_PUBLIC_URL
 */
import { readFile, writeFile, stat } from "node:fs/promises";
import { resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

// .env loader — küçük inline parser, dotenv dependency'sine gerek yok.
async function loadDotenv(rootDir) {
  try {
    const envText = await readFile(resolve(rootDir, ".env"), "utf8");
    for (const line of envText.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2].trim();
      // Strip surrounding single or double quotes.
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env yoksa zaten env'den okuyacak — sessiz geç.
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");
const MANIFEST_PATH = resolve(ROOT, "public/template-images/manifest.json");
const R2_PREFIX = "system/template-images";

await loadDotenv(ROOT);

function getEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`✗ Missing env: ${name}`);
    process.exit(1);
  }
  return v;
}

const accountId = getEnv("R2_ACCOUNT_ID");
const accessKeyId = getEnv("R2_ACCESS_KEY_ID");
const secretAccessKey = getEnv("R2_SECRET_ACCESS_KEY");
const bucket = getEnv("R2_BUCKET");
const publicBase = getEnv("R2_PUBLIC_URL").replace(/\/$/, "");

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

async function objectExists(key) {
  try {
    await r2.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function uploadOne(localPath, key, contentType) {
  const body = await readFile(localPath);
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      // Asset'ler immutable, 1 yıl edge cache. Cloudflare CDN sıkı tutar.
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
}

function r2KeyFor(item, categoryId) {
  return `${R2_PREFIX}/${categoryId}/${basename(item.url)}`;
}

function r2UrlFor(key) {
  return `${publicBase}/${key}`;
}

function localPathFor(item) {
  // url ör: /template-images/wedding/x.webp veya R2 absolute URL.
  // Sadece /template-images ile başlayanlar local. R2'ye işaret edenler
  // zaten yüklenmiş, atla.
  if (!item.url.startsWith("/template-images/")) return null;
  return resolve(ROOT, "public" + item.url);
}

async function main() {
  const onlyCategory = process.argv[2];

  const manifestRaw = await readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(manifestRaw);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  console.log(`R2 hedef: ${publicBase}/${R2_PREFIX}/`);
  console.log(`Manifest: ${MANIFEST_PATH}\n`);

  for (const cat of manifest.categories) {
    if (onlyCategory && cat.id !== onlyCategory) continue;
    console.log(
      `— ${cat.id} (${cat.label}) — ${cat.items.length} görsel`,
    );

    for (const item of cat.items) {
      const key = r2KeyFor(item, cat.id);
      const newUrl = r2UrlFor(key);

      if (item.url.startsWith(publicBase)) {
        skipped++;
        continue;
      }

      const localPath = localPathFor(item);
      if (!localPath) {
        console.warn(`  ⚠ ${item.url} — local path çözümlenemedi, atlandı`);
        failed++;
        continue;
      }

      try {
        await stat(localPath);
      } catch {
        console.warn(`  ⚠ Local dosya yok: ${localPath}`);
        failed++;
        continue;
      }

      const exists = await objectExists(key);
      if (exists) {
        console.log(`  ⤴ ${basename(item.url)} (R2'de mevcut)`);
        item.url = newUrl;
        skipped++;
        continue;
      }

      try {
        await uploadOne(localPath, key, "image/webp");
        item.url = newUrl;
        uploaded++;
        console.log(`  ✓ ${basename(item.url)}`);
      } catch (err) {
        console.error(`  ✗ ${basename(item.url)}:`, err?.message ?? err);
        failed++;
      }
    }
    console.log("");
  }

  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  console.log(`Bitti. Yüklenen: ${uploaded}, atlanan: ${skipped}, başarısız: ${failed}`);
  console.log(`Manifest güncellendi (URL'ler R2'yi gösteriyor).`);
  console.log(
    `\nÖneri: doğrulamadan sonra public/template-images/{kategori}/*.webp dosyalarını silebilirsin (manifest.json'u TUT).`,
  );
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
