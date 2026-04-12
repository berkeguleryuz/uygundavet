import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { Order } from "@/models/Order";
import { GalleryPhoto } from "@/models/GalleryPhoto";
import { canAccess } from "@/lib/package-gating";
import { cloudinary, getUserFolder } from "@/lib/cloudinary";
import type { SelectedPackage } from "@/models/Order";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ inviteCode: string }> }
) {
  try {
    const { inviteCode } = await params;

    await connectDB();
    const customer = await Customer.findOne({ inviteCode }).lean();

    if (!customer) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    const order = await Order.findOne({ userId: customer.userId }).lean();
    if (
      !order ||
      !canAccess("gallery", order.selectedPackage as SelectedPackage)
    ) {
      return NextResponse.json(
        { error: "Feature not available" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const uploaderName = (formData.get("uploader") as string) || "Misafir";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const folder = getUserFolder(customer.userId);
    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      bytes: number;
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: "image",
            transformation: [{ quality: "auto", fetch_format: "auto" }],
          },
          (error, result) => {
            if (error || !result)
              reject(error || new Error("Upload failed"));
            else
              resolve(
                result as {
                  secure_url: string;
                  public_id: string;
                  bytes: number;
                }
              );
          }
        )
        .end(buffer);
    });

    await GalleryPhoto.create({
      userId: customer.userId,
      name: file.name.replace(/\.[^.]+$/, "") || "Photo",
      url: result.secure_url,
      thumbnailUrl: result.secure_url.replace(
        "/upload/",
        "/upload/w_400,h_300,c_fill/"
      ),
      publicId: result.public_id,
      uploader: uploaderName,
      size: result.bytes,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Public gallery upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
