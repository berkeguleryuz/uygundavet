import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { Order } from "@/models/Order";
import { MemoryEntry } from "@/models/MemoryEntry";
import { canAccess } from "@/lib/package-gating";
import { z } from "zod";
import type { SelectedPackage } from "@/models/Order";

const memorySchema = z.object({
  authorName: z.string().min(1).max(200),
  message: z.string().min(1).max(2000),
});

export async function GET(
  _req: NextRequest,
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
      !canAccess("memoryBook", order.selectedPackage as SelectedPackage)
    ) {
      return NextResponse.json(
        { error: "Feature not available" },
        { status: 403 }
      );
    }

    const memories = await MemoryEntry.find({
      userId: customer.userId,
      approved: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ memories });
  } catch (error) {
    console.error("Public memories get error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ inviteCode: string }> }
) {
  try {
    const { inviteCode } = await params;

    const body = await req.json();
    const parsed = memorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

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
      !canAccess("memoryBook", order.selectedPackage as SelectedPackage)
    ) {
      return NextResponse.json(
        { error: "Feature not available" },
        { status: 403 }
      );
    }

    const entry = await MemoryEntry.create({
      userId: customer.userId,
      authorName: parsed.data.authorName,
      message: parsed.data.message,
      approved: false,
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("Public memory create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
