import { Prisma, PrismaClient } from "@prisma/client";
import {
  PREMIUM_TEMPLATES,
  buildPremiumTemplateDoc,
} from "../src/templates/premiumTemplates.ts";

const prisma = new PrismaClient();

async function main() {
  if (process.argv.includes("--dry-run")) {
    console.log(
      JSON.stringify(
        {
          status: "ok",
          mode: "dry-run",
          templates: PREMIUM_TEMPLATES.length,
        },
        null,
        2,
      ),
    );
    return;
  }

  const creatorId = await resolveCreatorId();
  const published = process.env.PREMIUM_TEMPLATES_PUBLISHED !== "false";

  for (const template of PREMIUM_TEMPLATES) {
    const doc = buildPremiumTemplateDoc(template, {
      weddingDate: "2026-09-12",
      weddingTime: "19:30",
      locale: "tr",
    });

    await prisma.designTemplate.upsert({
      where: { slug: template.slug },
      create: {
        slug: template.slug,
        title: template.title,
        description: template.description,
        category: template.category,
        previewUrl: template.previewUrl,
        doc: doc as unknown as Prisma.InputJsonValue,
        published,
        createdBy: creatorId,
      },
      update: {
        title: template.title,
        description: template.description,
        category: template.category,
        previewUrl: template.previewUrl,
        doc: doc as unknown as Prisma.InputJsonValue,
        published,
      },
    });
  }

  console.log(
    JSON.stringify(
      {
        status: "ok",
        templates: PREMIUM_TEMPLATES.length,
        published,
      },
      null,
      2,
    ),
  );
}

async function resolveCreatorId() {
  if (process.env.PREMIUM_TEMPLATE_CREATOR_ID) {
    return process.env.PREMIUM_TEMPLATE_CREATOR_ID;
  }

  const user = await prisma.user.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!user) {
    throw new Error(
      "No user found. Set PREMIUM_TEMPLATE_CREATOR_ID or create an admin user before seeding templates.",
    );
  }

  return user.id;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
