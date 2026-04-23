import { notFound } from "next/navigation";
import type { InvitationDoc } from "@davety/schema";
import { DavetyInvitationClient } from "./DavetyInvitationClient";

interface DavetyPublicResponse {
  slug: string;
  vanityPath: string | null;
  doc: InvitationDoc;
  publishedAt: string;
}

async function fetchPublishedDesign(
  slug: string
): Promise<DavetyPublicResponse | null> {
  const base = process.env.NEXT_PUBLIC_DAVETY_URL ?? "http://localhost:3100";
  try {
    const res = await fetch(`${base}/api/public/design/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as DavetyPublicResponse;
  } catch {
    return null;
  }
}

export default async function DavetyInvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const design = await fetchPublishedDesign(slug);
  if (!design) notFound();

  return (
    <main className="min-h-dvh flex items-center justify-center py-12 px-4 bg-[var(--background)]">
      <DavetyInvitationClient doc={design.doc} slug={design.slug} />
    </main>
  );
}
