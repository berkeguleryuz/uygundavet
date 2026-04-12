import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { Guest } from "@/models/Guest";
import { MemoryEntry } from "@/models/MemoryEntry";
import { Order } from "@/models/Order";
import { canAccess } from "@/lib/package-gating";
import { z } from "zod";
import type { SelectedPackage } from "@/models/Order";

const rsvpSchema = z.object({
  name: z.string().min(1).max(200),
  phone: z.string().max(50).default(""),
  rsvpStatus: z.enum(["confirmed", "declined"]),
  additionalGuests: z
    .array(z.object({ name: z.string().min(1).max(200) }))
    .max(20)
    .default([]),
  note: z.string().max(1000).default(""),
  message: z.string().max(2000).optional(),
  source: z.enum(["whatsapp", "qr-code"]).default("qr-code"),
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

    Customer.updateOne(
      { inviteCode },
      { $inc: { invitationViews: 1 } }
    ).catch(() => {});

    const order = await Order.findOne({ userId: customer.userId }).lean();
    const pkg = (order?.selectedPackage || "starter") as SelectedPackage;

    return NextResponse.json({
      invitation: {
        groomName: `${customer.groom.firstName} ${customer.groom.lastName}`,
        brideName: `${customer.bride.firstName} ${customer.bride.lastName}`,
        weddingDate: customer.weddingDate,
        weddingTime: customer.weddingTime,
        venueName: customer.venueName || "",
        venueAddress: customer.venueAddress || "",
        hasGallery: canAccess("gallery", pkg),
        hasMemoryBook: canAccess("memoryBook", pkg),
        selectedTheme: order?.selectedTheme || "rose",
      },
    });
  } catch (error) {
    console.error("Get invitation error:", error);
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
    const parsed = rsvpSchema.safeParse(body);
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

    const { additionalGuests, source, ...mainData } = parsed.data;

    // Create main guest record (guestCount = 1 for this person only)
    await Guest.create({
      userId: customer.userId,
      name: mainData.name,
      phone: mainData.phone,
      rsvpStatus: mainData.rsvpStatus,
      guestCount: 1,
      note: mainData.note,
      source,
    });

    // Create separate guest records for each additional guest
    if (additionalGuests.length > 0) {
      const validGuests = additionalGuests.filter((g) => g.name.trim());
      for (const g of validGuests) {
        try {
          await Guest.create({
            userId: customer.userId,
            name: g.name.trim(),
            phone: "",
            rsvpStatus: "guest",
            guestCount: 1,
            note: `${mainData.name} tarafından eklendi`,
            source,
          });
        } catch (err) {
          console.error("Failed to create additional guest:", g.name, err);
        }
      }
    }

    // Create memory entry if message provided
    if (mainData.message?.trim()) {
      const order = await Order.findOne({ userId: customer.userId }).lean();
      if (
        order &&
        canAccess("memoryBook", order.selectedPackage as SelectedPackage)
      ) {
        await MemoryEntry.create({
          userId: customer.userId,
          authorName: mainData.name,
          message: mainData.message.trim(),
          approved: false,
        });
      }
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("RSVP submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
