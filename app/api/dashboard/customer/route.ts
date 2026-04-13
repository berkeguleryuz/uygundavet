import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { Order } from "@/models/Order";
import { generateInviteCode } from "@/lib/invite-code";
import { z } from "zod";

const updateCustomerSchema = z.object({
  weddingDate: z.string().optional(),
  weddingTime: z.string().max(10).optional(),
  venueName: z.string().max(200).optional(),
  venueAddress: z.string().max(500).optional(),
  groom: z
    .object({
      firstName: z.string().max(100),
      lastName: z.string().max(100),
    })
    .optional(),
  bride: z
    .object({
      firstName: z.string().max(100),
      lastName: z.string().max(100),
    })
    .optional(),
  groomFamily: z
    .object({
      father: z.object({
        firstName: z.string().max(100),
        lastName: z.string().max(100),
      }),
      mother: z.object({
        firstName: z.string().max(100),
        lastName: z.string().max(100),
      }),
    })
    .optional(),
  brideFamily: z
    .object({
      father: z.object({
        firstName: z.string().max(100),
        lastName: z.string().max(100),
      }),
      mother: z.object({
        firstName: z.string().max(100),
        lastName: z.string().max(100),
      }),
    })
    .optional(),
  eventSchedule: z
    .array(
      z.object({
        time: z.string().max(10),
        label: z.string().max(200),
      })
    )
    .max(10)
    .optional(),
  storyMilestones: z
    .array(
      z.object({
        date: z.string().max(100),
        title: z.string().max(200),
        description: z.string().max(2000),
        imageUrl: z.string().max(500).default(""),
        imagePublicId: z.string().max(500).default(""),
      })
    )
    .max(10)
    .optional(),
});

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [customer, order] = await Promise.all([
      Customer.findOne({ userId: session.user.id }),
      Order.findOne({ userId: session.user.id }).lean(),
    ]);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Auto-generate inviteCode for existing users who don't have one
    if (!customer.inviteCode) {
      customer.inviteCode = generateInviteCode();
      await customer.save();
    }

    const customerData = customer.toObject();

    return NextResponse.json({
      customer: customerData,
      order: order
        ? {
            selectedPackage: order.selectedPackage,
            selectedTheme: order.selectedTheme,
            userPhone: order.userPhone,
            userEmail: order.userEmail,
            paymentStatus: order.paymentStatus,
          }
        : null,
    });
  } catch (error) {
    console.error("Get customer error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateCustomerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();
    const customer = await Customer.findOneAndUpdate(
      { userId: session.user.id },
      parsed.data,
      { new: true }
    ).lean();

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error("Update customer error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
