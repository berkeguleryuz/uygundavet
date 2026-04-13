import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { Order } from "@/models/Order";
import { GalleryPhoto } from "@/models/GalleryPhoto";
import { MemoryEntry } from "@/models/MemoryEntry";
import { Guest } from "@/models/Guest";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();

    const customers = await Customer.find().sort({ createdAt: -1 }).lean();

    const userIds = customers.map((c) => c.userId);

    const [orders, photoCounts, memoryCounts, guestCounts] = await Promise.all([
      Order.find({ userId: { $in: userIds } }).lean(),
      GalleryPhoto.aggregate([
        { $match: { userId: { $in: userIds } } },
        { $group: { _id: "$userId", count: { $sum: 1 } } },
      ]),
      MemoryEntry.aggregate([
        { $match: { userId: { $in: userIds } } },
        { $group: { _id: "$userId", count: { $sum: 1 } } },
      ]),
      Guest.aggregate([
        { $match: { userId: { $in: userIds } } },
        { $group: { _id: "$userId", count: { $sum: 1 } } },
      ]),
    ]);

    const orderMap = new Map(orders.map((o) => [o.userId, o]));
    const photoMap = new Map(photoCounts.map((p) => [p._id, p.count]));
    const memoryMap = new Map(memoryCounts.map((m) => [m._id, m.count]));
    const guestMap = new Map(guestCounts.map((g) => [g._id, g.count]));

    const websites = customers.map((c) => ({
      _id: c._id,
      userId: c.userId,
      bride: c.bride,
      groom: c.groom,
      weddingDate: c.weddingDate,
      inviteCode: c.inviteCode,
      customDomain: c.customDomain || "",
      invitationViews: c.invitationViews || 0,
      selectedTheme: orderMap.get(c.userId)?.selectedTheme || "—",
      photoCount: photoMap.get(c.userId) || 0,
      memoryCount: memoryMap.get(c.userId) || 0,
      guestCount: guestMap.get(c.userId) || 0,
    }));

    return NextResponse.json({ websites });
  } catch (error) {
    console.error("Admin websites error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
