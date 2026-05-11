import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Customer } from "@/models/Customer";
import { Guest } from "@/models/Guest";

function userFilter(userId: string) {
  if (ObjectId.isValid(userId)) {
    return { $or: [{ _id: new ObjectId(userId) }, { id: userId }] };
  }
  return { id: userId };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { userId } = await params;
    const userDoc = await db.collection("user").findOne(userFilter(userId));
    if (!userDoc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const stringId = String(userDoc._id);
    const altId = (userDoc.id as string | undefined) || stringId;

    await connectDB();

    const [orders, customer, guestCount, sessions, accounts] = await Promise.all([
      Order.find({ userId: { $in: [stringId, altId] } })
        .sort({ createdAt: -1 })
        .lean(),
      Customer.findOne({ userId: { $in: [stringId, altId] } }).lean(),
      Guest.countDocuments({ userId: { $in: [stringId, altId] } }),
      db
        .collection("session")
        .find({ userId: { $in: [stringId, altId] } })
        .sort({ createdAt: -1 })
        .toArray(),
      db
        .collection("account")
        .find(
          { userId: { $in: [stringId, altId] } },
          { projection: { providerId: 1, accountId: 1, createdAt: 1 } }
        )
        .toArray(),
    ]);

    return NextResponse.json({
      user: {
        _id: stringId,
        id: altId,
        name: userDoc.name || null,
        email: userDoc.email,
        emailVerified: !!userDoc.emailVerified,
        image: userDoc.image || null,
        locale: userDoc.locale || null,
        disabled: !!userDoc.disabled,
        disabledAt: userDoc.disabledAt || null,
        adminNotes: userDoc.adminNotes || "",
        createdAt: userDoc.createdAt || null,
        updatedAt: userDoc.updatedAt || null,
      },
      orders,
      customer,
      guestCount,
      sessions: sessions.map((s) => ({
        _id: String(s._id),
        token: s.token ? `${String(s.token).slice(0, 6)}...` : null,
        ipAddress: s.ipAddress || null,
        userAgent: s.userAgent || null,
        expiresAt: s.expiresAt || null,
        createdAt: s.createdAt || null,
      })),
      accounts: accounts.map((a) => ({
        providerId: a.providerId,
        accountId: a.accountId,
        createdAt: a.createdAt || null,
      })),
    });
  } catch (error) {
    console.error("Admin get user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const patchSchema = z.object({
  disabled: z.boolean().optional(),
  adminNotes: z.string().max(2000).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { userId } = await params;
    const data = patchSchema.parse(await req.json());

    const update: Record<string, unknown> = { updatedAt: new Date() };
    if (typeof data.disabled === "boolean") {
      update.disabled = data.disabled;
      update.disabledAt = data.disabled ? new Date() : null;
    }
    if (typeof data.adminNotes === "string") {
      update.adminNotes = data.adminNotes;
    }

    const filter = userFilter(userId);
    const result = await db.collection("user").findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    if (!result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (data.disabled === true) {
      const stringId = String(result._id);
      const altId = (result.id as string | undefined) || stringId;
      await db
        .collection("session")
        .deleteMany({ userId: { $in: [stringId, altId] } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    console.error("Admin patch user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
