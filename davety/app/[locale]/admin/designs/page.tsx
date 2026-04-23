import { prisma } from "@/src/lib/prisma";

export default async function AdminDesignsPage() {
  const designs = await prisma.invitationDesign.findMany({
    orderBy: { updatedAt: "desc" },
    take: 200,
    include: {
      user: { select: { email: true, name: true } },
      _count: { select: { guests: true, memories: true } },
    },
  });

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl mb-6">Davetiyeler</h1>

      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-2">Slug</th>
              <th className="text-left px-4 py-2">Durum</th>
              <th className="text-left px-4 py-2">Sahip</th>
              <th className="text-left px-4 py-2">Misafir</th>
              <th className="text-left px-4 py-2">Hatıra</th>
              <th className="text-left px-4 py-2">Güncelleme</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {designs.map((d) => (
              <tr key={d.id}>
                <td className="px-4 py-2 font-medium">
                  {d.vanityPath ?? d.slug}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      d.status === "published"
                        ? "bg-success/20 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  {d.user.email}
                </td>
                <td className="px-4 py-2 tabular-nums">{d._count.guests}</td>
                <td className="px-4 py-2 tabular-nums">{d._count.memories}</td>
                <td className="px-4 py-2 text-xs text-muted-foreground">
                  {new Date(d.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
