import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();

    const [totalOrders, pendingOrders, depositPaid, fullyPaid, totalUsers] =
      await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ paymentStatus: "pending" }),
        Order.countDocuments({ paymentStatus: "deposit_paid" }),
        Order.countDocuments({ paymentStatus: "fully_paid" }),
        db.collection("user").countDocuments(),
      ]);

    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$paidAmount" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      depositPaid,
      fullyPaid,
      totalUsers,
      totalRevenue,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
