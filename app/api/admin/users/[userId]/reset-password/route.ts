import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

function userFilter(userId: string) {
  if (ObjectId.isValid(userId)) {
    return { $or: [{ _id: new ObjectId(userId) }, { id: userId }] };
  }
  return { id: userId };
}

export async function POST(
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
    if (!userDoc?.email) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const baseUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://uygundavet.com";

    await auth.api.forgetPassword({
      body: {
        email: userDoc.email,
        redirectTo: `${baseUrl}/reset-password`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
