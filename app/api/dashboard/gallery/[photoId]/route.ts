import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { GalleryPhoto } from "@/models/GalleryPhoto";
import { cloudinary } from "@/lib/cloudinary";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ photoId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { photoId } = await params;

    await connectDB();
    const photo = await GalleryPhoto.findOne({
      _id: photoId,
      userId: session.user.id,
    });

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    photo.liked = !photo.liked;
    await photo.save();

    return NextResponse.json({ photo });
  } catch (error) {
    console.error("Toggle like error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ photoId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { photoId } = await params;

    await connectDB();
    const photo = await GalleryPhoto.findOneAndDelete({
      _id: photoId,
      userId: session.user.id,
    });

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    // Delete from Cloudinary
    if (photo.publicId) {
      cloudinary.uploader.destroy(photo.publicId).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete photo error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
