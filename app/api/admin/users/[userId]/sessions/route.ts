import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

function userFilter(userId: string) {
  if (ObjectId.isValid(userId)) {
    return { $or: [{ _id: new ObjectId(userId) }, { id: userId }] };
  }
  return { id: userId };
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { userId } = await params;
    const userDoc = await db.collection("user").findOne(userFilter(userId));
    if (!userDoc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const stringId = String(userDoc._id);
    const altId = (userDoc.id as string | undefined) || stringId;

    const result = await db
      .collection("session")
      .deleteMany({ userId: { $in: [stringId, altId] } });

    return NextResponse.json({ success: true, deleted: result.deletedCount || 0 });
  } catch (error) {
    console.error("Admin revoke sessions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
