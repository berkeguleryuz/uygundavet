import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import {
  planLimitsFor,
  nextTierLabel,
  tierOrFree,
} from "@/src/lib/plan-limits";
import type { PlanTier } from "@davety/schema";

type Params = Promise<{ locale: string; id: string }>;

function readTier(d: unknown): PlanTier {
  if (!d || typeof d !== "object") return "free";
  const meta = (d as { meta?: { tier?: unknown } }).meta;
  if (meta && typeof meta.tier === "string") {
    const t = meta.tier;
    if (t === "free" || t === "basic" || t === "pro" || t === "premium") {
      return t;
    }
  }
  return "free";
}

export default async function GuestsPage({ params }: { params: Params }) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  // Önce ownership ve tier'ı çekelim. rsvpReadEnabled false ise misafir
  // listesini SQL'den okumaya gerek yok — kilitli ekran göster, sadece
  // toplam sayıyı (rsvpCountEnabled için) ihtiyaç olursa ayrı çek.
  const [session, design] = await Promise.all([
    getSession(),
    prisma.invitationDesign.findUnique({
      where: { id },
      select: { userId: true, slug: true, doc: true, publishedDoc: true },
    }),
  ]);

  if (!session?.user) {
    redirect(
      `/login?returnTo=${encodeURIComponent(`/dashboard/${id}/guests`)}`,
    );
  }
  if (!design || design.userId !== session.user.id) notFound();

  const tier = readTier(design.publishedDoc) ?? readTier(design.doc);
  const limits = planLimitsFor(tier);

  // Detay listesi yetkisi yoksa kilitli ekran. Toplam sayıyı
  // göstermek için (Klasik tier rsvpCountEnabled true) sadece sayı
  // çekiyoruz, isim/telefon/not okumadan.
  if (!limits.rsvpReadEnabled) {
    const totalCount = limits.rsvpCountEnabled
      ? await prisma.guest.count({ where: { designId: id } })
      : null;
    return (
      <main className="min-h-dvh max-w-2xl mx-auto px-6 py-12">
        <header className="mb-6">
          <h1 className="font-display text-3xl">Misafir Listesi</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Davetiyene gelen RSVP yanıtlarının detayı.
          </p>
        </header>
        <div className="rounded-2xl border border-amber-300/50 bg-amber-50 p-6 flex flex-col items-center text-center gap-3">
          <div className="size-12 rounded-full bg-amber-100 flex items-center justify-center">
            <Lock className="size-5 text-amber-700" />
          </div>
          <h2 className="font-display text-xl text-amber-900">
            {nextTierLabel(tier)} paketinde açılır
          </h2>
          <p className="text-sm text-amber-900/80 max-w-md">
            Her misafirin adını, telefonunu ve mesajını ayrıntılı görmek
            için paketini yükselt. Mevcut paketin (
            <span className="font-medium">{tierOrFree(tier)}</span>) sadece
            toplam sayıyı gösterir.
          </p>
          {totalCount !== null ? (
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-white/60 px-4 py-2 text-sm">
              Toplam yanıt:{" "}
              <span className="font-semibold">{totalCount}</span>
            </div>
          ) : null}
          <Link
            href={`/design/invitations/${id}/save`}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500 text-white text-xs px-4 py-2 font-chakra uppercase tracking-[0.15em] hover:bg-amber-600"
          >
            <Sparkles className="size-3.5" /> Paketi Yükselt
          </Link>
        </div>
      </main>
    );
  }

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
                  <td className="px-4 py-2 text-muted-foreground">{g.phone ?? ","}</td>
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
                    {g.note ?? ","}
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
