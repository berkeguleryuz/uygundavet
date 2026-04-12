import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { GalleryPhoto } from "@/models/GalleryPhoto";
import { Order } from "@/models/Order";
import { canAccess } from "@/lib/package-gating";
import { cloudinary, getUserFolder } from "@/lib/cloudinary";
import type { SelectedPackage } from "@/models/Order";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const order = await Order.findOne({ userId: session.user.id }).lean();
    if (!order || !canAccess("gallery", order.selectedPackage as SelectedPackage)) {
      return NextResponse.json({ error: "Feature not available" }, { status: 403 });
    }

    const photos = await GalleryPhoto.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Get gallery error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const order = await Order.findOne({ userId: session.user.id }).lean();
    if (!order || !canAccess("gallery", order.selectedPackage as SelectedPackage)) {
      return NextResponse.json({ error: "Feature not available" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const name = (formData.get("name") as string) || "Untitled";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const folder = getUserFolder(session.user.id);
    const result = await new Promise<{ secure_url: string; public_id: string; bytes: number }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error || !result) reject(error || new Error("Upload failed"));
          else resolve(result as { secure_url: string; public_id: string; bytes: number });
        }
      ).end(buffer);
    });

    const photo = await GalleryPhoto.create({
      userId: session.user.id,
      name,
      url: result.secure_url,
      thumbnailUrl: result.secure_url.replace("/upload/", "/upload/w_400,h_300,c_fill/"),
      publicId: result.public_id,
      uploader: session.user.name || session.user.email?.split("@")[0] || "",
      size: result.bytes,
    });

    return NextResponse.json({ photo }, { status: 201 });
  } catch (error) {
    console.error("Upload gallery error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
