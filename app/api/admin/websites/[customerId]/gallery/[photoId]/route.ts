import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { GalleryPhoto } from "@/models/GalleryPhoto";
import { cloudinary } from "@/lib/cloudinary";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ customerId: string; photoId: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { photoId } = await params;
    await connectDB();

    const photo = await GalleryPhoto.findById(photoId);
    if (!photo) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (photo.publicId) {
      try {
        const result = await cloudinary.uploader.destroy(photo.publicId, {
          invalidate: true,
        });
        if (result.result !== "ok" && result.result !== "not found") {
          console.error("Cloudinary destroy returned non-ok:", result);
          return NextResponse.json(
            { error: "Failed to delete from Cloudinary" },
            { status: 500 }
          );
        }
      } catch (err) {
        console.error("Cloudinary destroy error:", err);
        return NextResponse.json(
          { error: "Failed to delete from Cloudinary" },
          { status: 500 }
        );
      }
    }

    await photo.deleteOne();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete photo error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
