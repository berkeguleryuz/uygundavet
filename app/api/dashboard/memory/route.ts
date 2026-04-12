import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { MemoryEntry } from "@/models/MemoryEntry";
import { Order } from "@/models/Order";
import { canAccess } from "@/lib/package-gating";
import { z } from "zod";
import type { SelectedPackage } from "@/models/Order";

const createEntrySchema = z.object({
  authorName: z.string().min(1).max(200),
  message: z.string().min(1).max(2000),
});

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const order = await Order.findOne({ userId: session.user.id }).lean();
    if (!order || !canAccess("memoryBook", order.selectedPackage as SelectedPackage)) {
      return NextResponse.json({ error: "Feature not available" }, { status: 403 });
    }

    const entries = await MemoryEntry.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Get memory entries error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createEntrySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findOne({ userId: session.user.id }).lean();
    if (!order || !canAccess("memoryBook", order.selectedPackage as SelectedPackage)) {
      return NextResponse.json({ error: "Feature not available" }, { status: 403 });
    }

    const entry = await MemoryEntry.create({
      userId: session.user.id,
      ...parsed.data,
      approved: true,
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("Create memory entry error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
