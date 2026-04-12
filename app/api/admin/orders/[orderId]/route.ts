import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Customer } from "@/models/Customer";
import { Guest } from "@/models/Guest";
import { z } from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { orderId } = await params;
    await connectDB();
    const order = await Order.findById(orderId).lean();
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const [customer, guestCount] = await Promise.all([
      Customer.findOne({ userId: order.userId }).lean(),
      Guest.countDocuments({ userId: order.userId }),
    ]);

    const weddingDate = customer?.weddingDate;
    let cleanupInfo = null;
    if (weddingDate) {
      const cleanupDate = new Date(weddingDate);
      cleanupDate.setDate(cleanupDate.getDate() + 30);
      const now = new Date();
      const daysUntilCleanup = Math.ceil((cleanupDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const isCleaned = order.adminNotes?.includes("[AUTO-CLEANED") || false;
      cleanupInfo = {
        weddingDate,
        cleanupDate,
        daysUntilCleanup,
        isCleaned,
      };
    }

    return NextResponse.json({ order, customer, guestCount, cleanupInfo });
  } catch (error) {
    console.error("Admin get order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const updateSchema = z.object({
  paymentStatus: z.enum(["pending", "deposit_paid", "fully_paid"]).optional(),
  paidAmount: z.number().min(0).optional(),
  adminNotes: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { orderId } = await params;
    const body = await req.json();
    const data = updateSchema.parse(body);

    await connectDB();

    const order = await Order.findByIdAndUpdate(
      orderId,
      { $set: data },
      { new: true }
    ).lean();

    if (!order) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    console.error("Admin order update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
