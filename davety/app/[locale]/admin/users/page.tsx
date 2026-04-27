import { prisma } from "@/src/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      createdAt: true,
      _count: { select: { designs: true, assets: true } },
    },
  });

  return (
    <main className="max-w-5xl mx-auto px-2 py-10">
      <h1 className="font-display text-3xl mb-6">Kullanıcılar</h1>

      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">İsim</th>
              <th className="text-left px-4 py-2">Doğrulanmış</th>
              <th className="text-left px-4 py-2">Davetiye</th>
              <th className="text-left px-4 py-2">Asset</th>
              <th className="text-left px-4 py-2">Kayıt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-2 font-medium">{u.email}</td>
                <td className="px-4 py-2 text-muted-foreground">
                  {u.name || "—"}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      u.emailVerified
                        ? "bg-success/20 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {u.emailVerified ? "evet" : "hayır"}
                  </span>
                </td>
                <td className="px-4 py-2 tabular-nums">{u._count.designs}</td>
                <td className="px-4 py-2 tabular-nums">{u._count.assets}</td>
                <td className="px-4 py-2 text-xs text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
