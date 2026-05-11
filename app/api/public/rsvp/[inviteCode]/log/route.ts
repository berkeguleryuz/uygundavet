import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ inviteCode: string }> }
) {
  try {
    const { inviteCode } = await params;
    await connectDB();
    const customer = await Customer.findOne({ inviteCode }).lean();
    if (!customer) {
      return NextResponse.json({ ok: false }, { status: 404 });
    }

    const body = await req.json().catch(() => null);
    const ua = req.headers.get("user-agent") || "unknown";
    console.error(
      "[gallery-client]",
      JSON.stringify({ inviteCode, ua, ...(body ?? {}) })
    );
  } catch (err) {
    console.error("[gallery-client] log endpoint error", err);
  }
  return NextResponse.json({ ok: true });
}
