import { prisma } from "@/src/lib/prisma";

export default async function AdminHome() {
  const [userCount, designCount, publishedCount, templateCount, memoryCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.invitationDesign.count(),
      prisma.invitationDesign.count({ where: { status: "published" } }),
      prisma.designTemplate.count(),
      prisma.memoryEntry.count(),
    ]);

  const stats = [
    { label: "Kullanıcı", value: userCount },
    { label: "Davetiye", value: designCount },
    { label: "Yayında", value: publishedCount },
    { label: "Template", value: templateCount },
    { label: "Hatıra Mesajı", value: memoryCount },
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl mb-6">Panel</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="border border-border rounded-lg bg-card p-4"
          >
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              {s.label}
            </div>
            <div className="font-display text-2xl mt-2">{s.value}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
