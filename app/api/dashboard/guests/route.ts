import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { Guest } from "@/models/Guest";
import { z } from "zod";

const createGuestSchema = z.object({
  name: z.string().min(1).max(200),
  phone: z.string().max(50).default(""),
  rsvpStatus: z.enum(["confirmed", "declined", "pending"]).default("pending"),
  guestCount: z.number().int().min(0).max(50).default(1),
  note: z.string().max(500).default(""),
  source: z
    .enum(["whatsapp", "manual", "qr-code", "website"])
    .default("manual"),
});

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const guests = await Guest.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ guests });
  } catch (error) {
    console.error("Get guests error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createGuestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();
    const guest = await Guest.create({
      userId: session.user.id,
      ...parsed.data,
    });

    return NextResponse.json({ guest }, { status: 201 });
  } catch (error) {
    console.error("Create guest error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
