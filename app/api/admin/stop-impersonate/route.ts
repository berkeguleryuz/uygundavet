import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(_req: NextRequest) {
  try {
    const reqHeaders = await headers();
    const response = await auth.api.stopImpersonating({
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
    console.error("Stop impersonate error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
