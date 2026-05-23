import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { cloudinary } from "@/lib/cloudinary";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
    if (file.size > MAX_BYTES)
      return NextResponse.json({ error: "File too large" }, { status: 413 });
    if (!ALLOWED_TYPES.has(file.type))
      return NextResponse.json({ error: "Unsupported type" }, { status: 415 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "uygundavet/blog",
      resource_type: "image",
    });

    return NextResponse.json({
      url: result.secure_url,
      width: result.width,
      height: result.height,
      publicId: result.public_id,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err instanceof Error && err.message === "Forbidden")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("[clodron/blog/upload-image POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
