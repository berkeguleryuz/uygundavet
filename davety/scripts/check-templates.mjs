import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const rows = await p.designTemplate.findMany({ select: { id: true, slug: true, title: true, published: true } });
console.log(JSON.stringify(rows, null, 2));
await p.$disconnect();
