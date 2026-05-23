import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

const RATE_LIMIT = 30;
const WINDOW_MS = 60 * 60 * 1000;

export async function GET() {
  try {
    const session = await requireAdmin();
    const since = new Date(Date.now() - WINDOW_MS);
    const count = await db.collection("blog_ai_usage").countDocuments({
      userId: session.user.id,
      createdAt: { $gte: since },
    });
    return NextResponse.json({ used: count, remaining: Math.max(0, RATE_LIMIT - count), limit: RATE_LIMIT });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err instanceof Error && err.message === "Forbidden")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("[clodron/blog/ai/usage GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
