import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { Order } from "@/models/Order";
import { GalleryPhoto } from "@/models/GalleryPhoto";
import { MemoryEntry } from "@/models/MemoryEntry";
import { Guest } from "@/models/Guest";
import { z } from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { customerId } = await params;
    await connectDB();

    const customer = await Customer.findById(customerId).lean();
    if (!customer) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const [order, photos, memories, guests] = await Promise.all([
      Order.findOne({ userId: customer.userId }).lean(),
      GalleryPhoto.find({ userId: customer.userId })
        .sort({ createdAt: -1 })
        .lean(),
      MemoryEntry.find({ userId: customer.userId })
        .sort({ createdAt: -1 })
        .lean(),
      Guest.find({ userId: customer.userId })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    return NextResponse.json({ customer, order, photos, memories, guests });
  } catch (error) {
    console.error("Admin website detail error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

const personSchema = z.object({
  firstName: z.string().trim().max(80).optional(),
  lastName: z.string().trim().max(80).optional(),
});

const familySchema = z.object({
  father: personSchema.optional(),
  mother: personSchema.optional(),
});

const updateSchema = z.object({
  customDomain: z.string().optional(),
  bride: personSchema.optional(),
  groom: personSchema.optional(),
  weddingDate: z.string().optional(),
  weddingTime: z.string().max(20).optional(),
  venueName: z.string().trim().max(200).optional(),
  venueAddress: z.string().trim().max(500).optional(),
  brideFamily: familySchema.optional(),
  groomFamily: familySchema.optional(),
  eventSchedule: z
    .array(z.object({ time: z.string().max(20), label: z.string().max(120) }))
    .max(20)
    .optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { customerId } = await params;
    const body = await req.json();
    const data = updateSchema.parse(body);

    await connectDB();

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { $set: data },
      { returnDocument: "after" }
    ).lean();

    if (!customer) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    console.error("Admin website update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
