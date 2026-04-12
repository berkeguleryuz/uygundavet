import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { Order } from "@/models/Order";
import { Guest } from "@/models/Guest";
import { GalleryPhoto } from "@/models/GalleryPhoto";
import { MemoryEntry } from "@/models/MemoryEntry";
import { deleteUserFolder } from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    // Find customers whose wedding date + 30 days has passed
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    const expiredCustomers = await Customer.find({
      weddingDate: { $lt: cutoffDate },
    }).lean();

    let cleaned = 0;

    for (const customer of expiredCustomers) {
      const userId = customer.userId;

      // Delete Cloudinary folder
      await deleteUserFolder(userId);

      // Delete all user data from DB
      await Promise.all([
        GalleryPhoto.deleteMany({ userId }),
        MemoryEntry.deleteMany({ userId }),
        Guest.deleteMany({ userId }),
      ]);

      // Mark order as cleaned (add a flag instead of deleting)
      await Order.updateOne(
        { userId },
        { $set: { adminNotes: `[AUTO-CLEANED ${new Date().toISOString()}] ${(await Order.findOne({ userId }))?.adminNotes || ""}`.trim() } }
      );

      cleaned++;
    }

    return NextResponse.json({
      success: true,
      cleaned,
      checked: expiredCustomers.length,
    });
  } catch (error) {
    console.error("Cleanup cron error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
