import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const d = await p.invitationDesign.findUnique({
  where: { slug: "4z3e9" },
  select: { id: true, slug: true, status: true, publishedAt: true, publishedDoc: true, updatedAt: true },
});
console.log(JSON.stringify({
  found: !!d,
  id: d?.id,
  slug: d?.slug,
  status: d?.status,
  publishedAt: d?.publishedAt,
  hasPublishedDoc: !!d?.publishedDoc,
}, null, 2));
await p.$disconnect();
