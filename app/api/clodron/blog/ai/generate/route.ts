import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { getOpenAi, BLOG_MODEL } from "@/lib/blog/openai-client";
import { SYSTEM_PROMPT, buildUserPrompt, type AiAction, type AiContext } from "@/lib/blog/ai-prompts";
import { stripEmDash } from "@/lib/blog/strip-em-dash";

const RATE_LIMIT = 30;
const WINDOW_MS = 60 * 60 * 1000;

const bodySchema = z.object({
  action: z.enum(["full-post", "title-suggest", "intro", "h2-outline", "meta-description", "excerpt"]),
  context: z
    .object({
      topic: z.string().max(500).optional(),
      title: z.string().max(300).optional(),
      keywords: z.array(z.string().max(100)).max(20).optional(),
      targetLength: z.enum(["short", "standard", "long"]).optional(),
      existingContent: z.string().max(20000).optional(),
    })
    .default({}),
});

async function checkRateLimit(userId: string): Promise<{ ok: boolean; remaining: number }> {
  const since = new Date(Date.now() - WINDOW_MS);
  const count = await db.collection("blog_ai_usage").countDocuments({ userId, createdAt: { $gte: since } });
  return { ok: count < RATE_LIMIT, remaining: Math.max(0, RATE_LIMIT - count) };
}

async function recordUsage(userId: string, action: string, inputTokens: number, outputTokens: number) {
  await db.collection("blog_ai_usage").insertOne({
    userId,
    action,
    inputTokens,
    outputTokens,
    createdAt: new Date(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }
    const { action, context } = parsed.data;

    const limit = await checkRateLimit(session.user.id);
    if (!limit.ok) {
      return NextResponse.json({ error: "Rate limit exceeded", remaining: 0 }, { status: 429 });
    }

    const openai = getOpenAi();
    const completion = await openai.chat.completions.create({
      model: BLOG_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(action as AiAction, context as AiContext) },
      ],
    });

    const rawOutput = completion.choices[0]?.message?.content ?? "";
    const cleaned = stripEmDash(rawOutput);

    await recordUsage(
      session.user.id,
      action,
      completion.usage?.prompt_tokens ?? 0,
      completion.usage?.completion_tokens ?? 0
    );

    return NextResponse.json({
      output: cleaned,
      remaining: limit.remaining - 1,
      tokens: {
        input: completion.usage?.prompt_tokens ?? 0,
        output: completion.usage?.completion_tokens ?? 0,
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err instanceof Error && err.message === "Forbidden")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    console.error("[clodron/blog/ai/generate POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
