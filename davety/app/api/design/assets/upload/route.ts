import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import sharp from "sharp";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { R2_ENABLED, uploadToR2 } from "@/src/lib/r2";
import { verifyMime, maxBytesFor } from "@/src/lib/file-sniff";
import { rateLimit } from "@/src/lib/rate-limit";
import { assertWithinStorageQuota } from "@/src/lib/storage-quota";

const HARD_MAX_BYTES = 120 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "audio/mpeg",
  "audio/mp4",
  "audio/ogg",
  "audio/wav",
]);

const MAX_PIXELS = 4096 * 4096;

const IMAGE_VARIANTS: { suffix: string; width: number }[] = [
  { suffix: "thumb", width: 400 },
  { suffix: "md", width: 800 },
  { suffix: "lg", width: 1600 },
];

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = await rateLimit({
    key: `upload:${session.user.id}`,
    limit: 30,
    windowSeconds: 60,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many uploads, please slow down." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  if (!R2_ENABLED) {
    return NextResponse.json(
      { error: "R2 storage is not configured on this server" },
      { status: 503 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form payload" }, { status: 400 });
  }
  const file = form.get("file");
  const designId = form.get("designId");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: `Unsupported: ${file.type}` },
      { status: 415 }
    );
  }
  const perTypeLimit = maxBytesFor(file.type);
  if (file.size > Math.min(perTypeLimit, HARD_MAX_BYTES)) {
    return NextResponse.json(
      { error: `File too large for ${file.type}` },
      { status: 413 }
    );
  }

  if (designId && typeof designId === "string") {
    const design = await prisma.invitationDesign.findUnique({
      where: { id: designId },
      select: { userId: true },
    });
    if (!design || design.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  try {
    await assertWithinStorageQuota(session.user.id, file.size);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Quota exceeded";
    return NextResponse.json({ error: msg }, { status: 402 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  if (!verifyMime(bytes, file.type)) {
    return NextResponse.json(
      { error: "File content does not match its declared type" },
      { status: 415 }
    );
  }

  const id = nanoid(12);
  const baseKey = `users/${session.user.id}/${
    designId && typeof designId === "string" ? `designs/${designId}/` : "uploads/"
  }${id}`;

  let width: number | undefined;
  let height: number | undefined;
  const variants: Record<string, string> = {};
  let totalUploadedBytes = 0;

  const isImage = file.type.startsWith("image/");

  if (isImage && file.type !== "image/gif") {
    let source: sharp.Sharp;
    try {
      source = sharp(bytes, {
        failOn: "error",
        limitInputPixels: MAX_PIXELS,
      });
    } catch {
      return NextResponse.json(
        { error: "Image rejected (too large or malformed)" },
        { status: 415 }
      );
    }
    let meta;
    try {
      meta = await source.metadata();
    } catch {
      return NextResponse.json(
        { error: "Image metadata could not be read" },
        { status: 415 }
      );
    }
    width = meta.width;
    height = meta.height;
    if (width && height && width * height > MAX_PIXELS) {
      return NextResponse.json(
        { error: "Image dimensions too large" },
        { status: 413 }
      );
    }

    const originalKey = `${baseKey}.webp`;
    let originalBytes: Buffer;
    try {
      originalBytes = await source.clone().webp({ quality: 85 }).toBuffer();
    } catch {
      return NextResponse.json(
        { error: "Image could not be processed" },
        { status: 415 }
      );
    }
    await uploadToR2({
      key: originalKey,
      body: originalBytes,
      contentType: "image/webp",
    });
    variants.original = originalKey;
    totalUploadedBytes += originalBytes.length;

    // Üç boyut (thumb/md/lg) bağımsız — her biri kendi sharp clone'u
    // üzerinde çalışıyor + R2 upload ediyor. Sequential yerine paralel
    // çalıştırılırsa upload süresi en yavaş tek varyant kadar olur,
    // toplam üçte bir civarına düşer. (async-parallel)
    const variantResults = await Promise.all(
      IMAGE_VARIANTS.filter((v) => !width || width > v.width).map(
        async (v) => {
          const vkey = `${baseKey}-${v.suffix}.webp`;
          const vbuf = await source
            .clone()
            .resize({ width: v.width, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();
          await uploadToR2({
            key: vkey,
            body: vbuf,
            contentType: "image/webp",
          });
          return { suffix: v.suffix, key: vkey, bytes: vbuf.length };
        },
      ),
    );
    for (const r of variantResults) {
      variants[r.suffix] = r.key;
      totalUploadedBytes += r.bytes;
    }
  } else {
    const ext =
      file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ??
      "bin";
    const key = `${baseKey}.${ext}`;
    await uploadToR2({ key, body: bytes, contentType: file.type });
    variants.original = key;
    totalUploadedBytes += bytes.length;
  }

  const publicBase = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");
  const variantUrls = Object.fromEntries(
    Object.entries(variants).map(([k, key]) => [k, `${publicBase}/${key}`])
  );
  const primaryUrl = variantUrls.original;

  // Response sadece id kullanıyor; full row pull etmeye gerek yok.
  const asset = await prisma.asset.create({
    data: {
      userId: session.user.id,
      designId: typeof designId === "string" ? designId : null,
      url: primaryUrl,
      key: variants.original,
      mimeType: isImage && file.type !== "image/gif" ? "image/webp" : file.type,
      sizeBytes: totalUploadedBytes,
      width: width ?? null,
      height: height ?? null,
    },
    select: { id: true },
  });

  const mediaType = file.type.startsWith("video/")
    ? "video"
    : file.type.startsWith("audio/")
    ? "audio"
    : "image";

  return NextResponse.json({
    id: asset.id,
    url: primaryUrl,
    key: variants.original,
    width: width ?? null,
    height: height ?? null,
    mediaType,
    variants: variantUrls,
  });
}
