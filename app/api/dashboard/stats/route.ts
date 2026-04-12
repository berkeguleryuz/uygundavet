import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { Guest } from "@/models/Guest";
import { Customer } from "@/models/Customer";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [guests, customer] = await Promise.all([
      Guest.find({ userId: session.user.id }).lean(),
      Customer.findOne({ userId: session.user.id }).lean(),
    ]);

    const totalGuestCount = guests.reduce((sum, g) => sum + g.guestCount, 0);
    const confirmed = guests.filter(
      (g) => g.rsvpStatus === "confirmed" || g.rsvpStatus === "guest"
    ).length;
    const declined = guests.filter((g) => g.rsvpStatus === "declined").length;
    const pending = guests.filter((g) => g.rsvpStatus === "pending").length;

    let daysUntilWedding = 0;
    if (customer?.weddingDate) {
      const diff =
        new Date(customer.weddingDate).getTime() - Date.now();
      daysUntilWedding = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    const invitationViews = customer?.invitationViews || 0;

    return NextResponse.json({
      stats: {
        totalGuests: guests.length,
        totalGuestCount,
        confirmed,
        declined,
        pending,
        daysUntilWedding,
        invitationViews,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
