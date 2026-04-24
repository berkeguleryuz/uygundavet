import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import sharp from "sharp";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { R2_ENABLED, uploadToR2 } from "@/src/lib/r2";

const MAX_BYTES = 20 * 1024 * 1024;
const ALLOWED = [
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
];

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

  if (!R2_ENABLED) {
    return NextResponse.json(
      { error: "R2 storage is not configured on this server" },
      { status: 503 }
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  const designId = form.get("designId");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: `Unsupported: ${file.type}` },
      { status: 415 }
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

  const bytes = Buffer.from(await file.arrayBuffer());
  const id = nanoid(12);
  const baseKey = `users/${session.user.id}/${
    designId && typeof designId === "string" ? `designs/${designId}/` : "uploads/"
  }${id}`;

  let width: number | undefined;
  let height: number | undefined;
  const variants: Record<string, string> = {};

  const isImage = file.type.startsWith("image/");

  if (isImage && file.type !== "image/gif") {
    // Pre-render sized variants + a canonical webp original
    const source = sharp(bytes, { failOn: "error" });
    const meta = await source.metadata();
    width = meta.width;
    height = meta.height;

    // Original (webp, quality 85)
    const originalKey = `${baseKey}.webp`;
    const originalBytes = await source.clone().webp({ quality: 85 }).toBuffer();
    await uploadToR2({
      key: originalKey,
      body: originalBytes,
      contentType: "image/webp",
    });
    variants.original = originalKey;

    // Responsive variants
    for (const v of IMAGE_VARIANTS) {
      if (width && width <= v.width) continue;
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
      variants[v.suffix] = vkey;
    }
  } else {
    // Video / audio / gif: store as-is
    const ext =
      file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ??
      "bin";
    const key = `${baseKey}.${ext}`;
    await uploadToR2({ key, body: bytes, contentType: file.type });
    variants.original = key;
  }

  const publicBase = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");
  const variantUrls = Object.fromEntries(
    Object.entries(variants).map(([k, key]) => [k, `${publicBase}/${key}`])
  );
  const primaryUrl = variantUrls.original;

  const asset = await prisma.asset.create({
    data: {
      userId: session.user.id,
      designId: typeof designId === "string" ? designId : null,
      url: primaryUrl,
      key: variants.original,
      mimeType: isImage && file.type !== "image/gif" ? "image/webp" : file.type,
      sizeBytes: file.size,
      width: width ?? null,
      height: height ?? null,
    },
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
