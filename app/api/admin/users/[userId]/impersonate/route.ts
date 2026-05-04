import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { requireAdmin } from "@/lib/admin-auth";
import { auth } from "@/lib/auth";

export async function POST(
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
    const reqHeaders = await headers();

    const response = await auth.api.impersonateUser({
      body: { userId },
      headers: reqHeaders,
      asResponse: true,
    });

    const out = NextResponse.json({ success: true });
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        out.headers.append("set-cookie", value);
      }
    });
    return out;
  } catch (error) {
    console.error("Impersonate error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
