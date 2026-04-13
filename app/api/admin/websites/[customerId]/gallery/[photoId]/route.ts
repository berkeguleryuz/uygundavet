import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { GalleryPhoto } from "@/models/GalleryPhoto";

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

    const photo = await GalleryPhoto.findByIdAndDelete(photoId);
    if (!photo) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete photo error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
