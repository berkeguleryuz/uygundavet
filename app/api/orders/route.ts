import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { db } from "@/lib/db";
import { Order } from "@/models/Order";
import { Customer } from "@/models/Customer";
import { PACKAGES, type PackageKey } from "@/lib/packages";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { orderConfirmationEmail } from "@/lib/emails/templates";
import { z } from "zod";
import { generateInviteCode } from "@/lib/invite-code";

const orderSchema = z.object({
  phone: z.string().min(1),
  owner1FirstName: z.string().min(1),
  owner1LastName: z.string().min(1),
  owner2FirstName: z.string().min(1),
  owner2LastName: z.string().min(1),
  weddingDate: z.string().min(1),
  weddingTime: z.string().min(1),
  selectedPackage: z.enum(["starter", "pro", "business"]),
  selectedTheme: z.enum(["rose", "sunset", "pearl", "crystal", "garden", "ocean", "golden", "custom"]),
  customThemeRequest: z.string().optional(),
  paymentMethod: z.enum(["deposit", "full"]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = orderSchema.parse(body);

    if (data.selectedTheme === "custom" && (!data.customThemeRequest || !data.customThemeRequest.trim())) {
      return NextResponse.json({ error: "Custom theme request is required" }, { status: 400 });
    }

    await connectDB();

    const pkg = PACKAGES[data.selectedPackage as PackageKey];
    const totalAmount = pkg.price;
    const depositAmount = Math.round(totalAmount * pkg.depositPercent);

    const session_db = await mongoose.startSession();
    try {
      session_db.startTransaction();

      const existingOrder = await Order.findOne({ userId: session.user.id }).session(session_db);
      if (existingOrder) {
        await session_db.abortTransaction();
        return NextResponse.json({ error: "Order already exists" }, { status: 409 });
      }

      await Customer.create(
        [
          {
            userId: session.user.id,
            weddingDate: new Date(data.weddingDate),
            weddingTime: data.weddingTime,
            inviteCode: generateInviteCode(),
            groom: { firstName: data.owner1FirstName, lastName: data.owner1LastName },
            bride: { firstName: data.owner2FirstName, lastName: data.owner2LastName },
          },
        ],
        { session: session_db }
      );

      await Order.create(
        [
          {
            userId: session.user.id,
            userEmail: session.user.email,
            userPhone: data.phone,
            selectedPackage: data.selectedPackage,
            selectedTheme: data.selectedTheme,
            customThemeRequest: data.customThemeRequest,
            paymentStatus: "pending",
            paymentMethod: data.paymentMethod,
            depositAmount,
            totalAmount,
            paidAmount: 0,
          },
        ],
        { session: session_db }
      );

      await session_db.commitTransaction();
    } catch (txError) {
      await session_db.abortTransaction();
      throw txError;
    } finally {
      session_db.endSession();
    }

    const locale = (await db.collection("user").findOne({ email: session.user.email }))?.locale || "tr";
    const { subject, html } = orderConfirmationEmail({
      selectedPackage: data.selectedPackage,
      selectedTheme: data.selectedTheme,
      customThemeRequest: data.customThemeRequest,
      paymentMethod: data.paymentMethod,
      totalAmount,
      depositAmount,
      groomName: `${data.owner1FirstName} ${data.owner1LastName}`,
      brideName: `${data.owner2FirstName} ${data.owner2LastName}`,
      weddingDate: data.weddingDate,
      dashboardUrl: `${process.env.BETTER_AUTH_URL || "https://uygundavet.com"}/dashboard`,
    }, locale as "tr" | "en" | "de");

    resend.emails.send({ from: FROM_EMAIL, to: session.user.email, subject, html }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
