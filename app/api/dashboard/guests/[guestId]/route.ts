import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { Guest } from "@/models/Guest";
import { z } from "zod";

const updateGuestSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  phone: z.string().max(50).optional(),
  email: z.string().email().or(z.literal("")).optional(),
  rsvpStatus: z.enum(["confirmed", "declined", "pending"]).optional(),
  guestCount: z.number().int().min(0).max(50).optional(),
  note: z.string().max(500).optional(),
  source: z
    .enum(["whatsapp", "email", "manual", "qr-code", "website"])
    .optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ guestId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { guestId } = await params;
    const body = await req.json();
    const parsed = updateGuestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();
    const guest = await Guest.findOneAndUpdate(
      { _id: guestId, userId: session.user.id },
      parsed.data,
      { new: true }
    ).lean();

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    return NextResponse.json({ guest });
  } catch (error) {
    console.error("Update guest error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ guestId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { guestId } = await params;

    await connectDB();
    const guest = await Guest.findOneAndDelete({
      _id: guestId,
      userId: session.user.id,
    });

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete guest error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
