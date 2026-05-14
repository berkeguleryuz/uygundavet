import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { GalleryPhoto } from "@/models/GalleryPhoto";
import { cloudinary } from "@/lib/cloudinary";

type CloudinaryResource = {
  public_id: string;
  bytes?: number;
  resource_type?: string;
};

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const dryRun = searchParams.get("dryRun") !== "false";

  try {
    await connectDB();

    const allPhotos = await GalleryPhoto.find({}, { publicId: 1 }).lean();
    const knownPublicIds = new Set(
      allPhotos.map((p) => p.publicId).filter(Boolean)
    );

    const orphans: CloudinaryResource[] = [];
    let scanned = 0;
    let nextCursor: string | undefined;

    do {
      const res = (await cloudinary.api.resources({
        type: "upload",
        prefix: "uygundavet/users/",
        max_results: 500,
        next_cursor: nextCursor,
      })) as { resources: CloudinaryResource[]; next_cursor?: string };

      scanned += res.resources.length;
      for (const r of res.resources) {
        if (!knownPublicIds.has(r.public_id)) {
          orphans.push(r);
        }
      }
      nextCursor = res.next_cursor;
    } while (nextCursor);

    let deleted = 0;
    if (!dryRun && orphans.length > 0) {
      for (let i = 0; i < orphans.length; i += 100) {
        const batch = orphans.slice(i, i + 100).map((o) => o.public_id);
        const result = (await cloudinary.api.delete_resources(batch, {
          invalidate: true,
        })) as { deleted: Record<string, string> };
        for (const status of Object.values(result.deleted)) {
          if (status === "deleted") deleted++;
        }
      }
    }

    return NextResponse.json({
      dryRun,
      scanned,
      knownInDb: knownPublicIds.size,
      orphanCount: orphans.length,
      deleted,
      orphanSample: orphans.slice(0, 20).map((o) => o.public_id),
    });
  } catch (error) {
    console.error("Cleanup orphan photos error:", error);
    return NextResponse.json(
      { error: "Internal server error", detail: String(error) },
      { status: 500 }
    );
  }
}
