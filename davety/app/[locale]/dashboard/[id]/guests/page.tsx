import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";

type Params = Promise<{ locale: string; id: string }>;

export default async function GuestsPage({ params }: { params: Params }) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await getSession();
  if (!session?.user) {
    redirect(`/login?returnTo=${encodeURIComponent(`/dashboard/${id}/guests`)}`);
  }

  const design = await prisma.invitationDesign.findUnique({
    where: { id },
    select: { userId: true, slug: true },
  });
  if (!design || design.userId !== session.user.id) notFound();

  const guests = await prisma.guest.findMany({
    where: { designId: id },
    orderBy: { createdAt: "desc" },
  });

  const yes = guests
    .filter((g) => g.attending === "yes")
    .reduce((a, g) => a + g.guestCount, 0);
  const no = guests.filter((g) => g.attending === "no").length;

  return (
    <main className="min-h-dvh max-w-4xl mx-auto px-6 py-12">
      <header className="mb-6">
        <h1 className="font-display text-3xl">Misafir Listesi</h1>
        <p className="text-sm text-muted-foreground mt-1">
          <span className="font-medium text-success">{yes}</span> katılım •{" "}
          <span className="font-medium text-destructive">{no}</span> katılamayan
          • {guests.length} toplam yanıt
        </p>
      </header>

      <div className="border border-border rounded-lg overflow-hidden bg-card">
        {guests.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground text-center">
            Henüz yanıt yok.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-2">Ad</th>
                <th className="text-left px-4 py-2">Telefon</th>
                <th className="text-left px-4 py-2">Durum</th>
                <th className="text-left px-4 py-2">Kişi</th>
                <th className="text-left px-4 py-2">Not</th>
                <th className="text-left px-4 py-2">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {guests.map((g) => (
                <tr key={g.id}>
                  <td className="px-4 py-2 font-medium">{g.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{g.phone ?? "—"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        g.attending === "yes"
                          ? "bg-success/20 text-success"
                          : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {g.attending === "yes" ? "Katılıyor" : "Katılamıyor"}
                    </span>
                  </td>
                  <td className="px-4 py-2">{g.guestCount}</td>
                  <td className="px-4 py-2 text-muted-foreground max-w-xs truncate">
                    {g.note ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">
                    {new Date(g.createdAt).toLocaleDateString(locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
