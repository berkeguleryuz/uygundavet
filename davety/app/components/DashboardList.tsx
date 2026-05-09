"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Calendar,
  Check,
  Copy,
  ExternalLink,
  Eye,
  Heart,
  Lock,
  MapPin,
  MessageCircle,
  Pencil,
  Search,
  Share2,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import type { PlanTier } from "@davety/schema";
import { Link, useRouter } from "@/i18n/navigation";
import { planLimitsFor, nextTierLabel } from "@/src/lib/plan-limits";

export interface DashboardDesign {
  id: string;
  slug: string;
  vanityPath: string | null;
  status: string;
  /** Tier the invitation was published with. null/undefined = not yet
   *  published, treated as "free" for paywall purposes. */
  tier?: PlanTier | null;
  updatedAt: string;
  createdAt: string;
  publishedAt: string | null;
  coupleName?: string | null;
  templateLabel?: string | null;
  weddingIso?: string | null;
  venueName?: string | null;
  bgColor?: string | null;
  accentColor?: string | null;
  pageBgColor?: string | null;
  guestCount: number;
  memoryCount: number;
  rsvpYes: number;
  rsvpNo: number;
  rsvpYesHeads: number;
}

type Filter = "all" | "published" | "draft";

interface Props {
  designs: DashboardDesign[];
  locale: string;
  publicBase: string;
}

export function DashboardList({ designs: initial, locale, publicBase }: Props) {
  const router = useRouter();
  const [designs, setDesigns] = useState(initial);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const stats = useMemo(() => {
    return designs.reduce(
      (acc, d) => {
        acc.total += 1;
        if (d.status === "published") acc.published += 1;
        else acc.draft += 1;
        acc.guests += d.guestCount;
        // RSVP yanıt toplamı: sayıyı görmeye yetkili tier'lardan
        // toplanır. Klasik tier sayıyı görür (rsvpCountEnabled),
        // detay listesi için Pro+ gerek (rsvpReadEnabled). Free
        // hiçbir RSVP datası göremez.
        if (planLimitsFor(d.tier).rsvpCountEnabled) {
          acc.rsvpHeads += d.rsvpYesHeads;
        }
        acc.memories += d.memoryCount;
        return acc;
      },
      { total: 0, published: 0, draft: 0, guests: 0, rsvpHeads: 0, memories: 0 },
    );
  }, [designs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return designs.filter((d) => {
      if (filter === "published" && d.status !== "published") return false;
      if (filter === "draft" && d.status === "published") return false;
      if (!q) return true;
      const hay = [
        d.coupleName,
        d.vanityPath,
        d.slug,
        d.venueName,
        d.templateLabel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [designs, filter, query]);

  async function handleDelete(id: string) {
    setBusy(id);
    try {
      const res = await fetch(`/api/design/invitations/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error ?? "Silinemedi");
        return;
      }
      setDesigns((prev) => prev.filter((d) => d.id !== id));
      toast.success("Davetiye silindi");
      setConfirming(null);
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  if (designs.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-6">
      <StatsBar stats={stats} />

      <div className="flex items-center gap-3 flex-wrap">
        <FilterChip
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="Tümü"
          count={stats.total}
        />
        <FilterChip
          active={filter === "published"}
          onClick={() => setFilter("published")}
          label="Yayında"
          count={stats.published}
        />
        <FilterChip
          active={filter === "draft"}
          onClick={() => setFilter("draft")}
          label="Taslak"
          count={stats.draft}
        />

        <div className="ml-auto relative">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Çift, mekân, slug ara…"
            className="w-64 max-w-full rounded-full border border-border pl-8 pr-3 py-2 text-xs bg-background focus:outline-none focus:border-foreground/40 transition-colors"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Bu filtreyle eşleşen davetiye yok.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filtered.map((d) => (
            <DesignCard
              key={d.id}
              design={d}
              locale={locale}
              publicBase={publicBase}
              onDelete={() => setConfirming(d.id)}
            />
          ))}
        </div>
      )}

      {confirming
        ? (() => {
            const target = designs.find((d) => d.id === confirming);
            if (!target) return null;
            return (
              <ConfirmDelete
                slug={target.vanityPath ?? target.slug}
                coupleName={target.coupleName ?? null}
                guestCount={target.guestCount}
                memoryCount={target.memoryCount}
                busy={busy === target.id}
                onCancel={() => setConfirming(null)}
                onConfirm={() => handleDelete(target.id)}
              />
            );
          })()
        : null}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-10 sm:p-14 text-center">
      <div className="mx-auto mb-4 size-14 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center">
        <Heart className="size-6" />
      </div>
      <h2 className="font-display text-xl mb-2">İlk davetiyeni oluştur</h2>
      <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
        Bir şablon seç, çiftin adını gir, dakikalar içinde davetiyen yayında
        olsun.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground text-xs px-5 py-2.5 font-chakra uppercase tracking-[0.15em] hover:opacity-90"
      >
        + Yeni Davetiye
      </Link>
    </div>
  );
}

function StatsBar({
  stats,
}: {
  stats: {
    total: number;
    published: number;
    draft: number;
    guests: number;
    rsvpHeads: number;
    memories: number;
  };
}) {
  const items = [
    { label: "Davetiye", value: stats.total, sub: `${stats.published} yayında` },
    { label: "Misafir", value: stats.guests, sub: "kayıtlı" },
    { label: "Katılım", value: stats.rsvpHeads, sub: "kişi gelecek" },
    { label: "Hatıra", value: stats.memories, sub: "yazı" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-xl border border-border bg-card px-4 py-3"
        >
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {it.label}
          </div>
          <div className="mt-1 font-display text-2xl leading-none">
            {it.value}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">{it.sub}</div>
        </div>
      ))}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs cursor-pointer transition-colors ${
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-background text-foreground border-border hover:border-foreground/40"
      }`}
    >
      <span>{label}</span>
      <span
        className={`rounded-full px-1.5 text-[10px] ${
          active ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function DesignCard({
  design: d,
  locale,
  publicBase,
  onDelete,
}: {
  design: DashboardDesign;
  locale: string;
  publicBase: string;
  onDelete: () => void;
}) {
  // Router was missing in this component, onClick paywalls in the
  // QuickAction grid below need it to navigate to the upgrade screen.
  const router = useRouter();
  const handle = d.vanityPath ?? d.slug;
  const publicUrl = `${publicBase}/davetiyem/${handle}`;
  const isPublished = d.status === "published";

  // weddingIso parent'tan stable string; her render'da new Date()
  // çağırmak gerekmez, useMemo ile cache. (rerender-derived-state)
  const validWedding = useMemo(() => {
    if (!d.weddingIso) return null;
    const w = new Date(d.weddingIso);
    return Number.isNaN(w.getTime()) ? null : w;
  }, [d.weddingIso]);
  const countdown = useMemo(
    () => (validWedding ? countdownLabel(validWedding) : null),
    [validWedding],
  );
  // updatedAt formatlanmış string memoize; locale değişmedikçe
  // tekrar Date alloc + format yok.
  const updatedRelative = useMemo(
    () => relativeTime(new Date(d.updatedAt), locale),
    [d.updatedAt, locale],
  );

  const bgSwatch = d.bgColor ?? "#f5f6f3";
  const accentSwatch = d.accentColor ?? "#252224";
  const pageSwatch = d.pageBgColor ?? "#252224";

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Bağlantı kopyalandı");
    } catch {
      toast.error("Kopyalanamadı");
    }
  }

  return (
    <article className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-foreground/20 transition-colors">
      {/* Top meta strip, tier badge + status + theme swatches in a single
          neutral row. Önceden kafa karıştıran tema-renk gradyanı vardı;
          kullanıcılar bunun ne olduğunu anlamadı, kaldırdık. Tema renkleri
          artık küçük noktalar olarak göründüğü için karta hala bakışta
          tematik kimlik veriyor ama "ne bu büyük renkli alan" sorusunu
          tetiklemiyor. */}
      {/* Üst strip: tier + yükselt solda, status badge sağda. Tema
           renkleri çakışmasın diye bir alt satıra alındı. */}
      <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <TierBadge tier={d.tier} />
          <UpgradeButton designId={d.id} tier={d.tier} />
        </div>
        <StatusBadge published={isPublished} />
      </div>
      {/* Tema renkleri ayrı satırda, status badge'in altında. Daha
          fazla yer var, üç nokta da çakışmadan sığıyor. */}
      <div className="flex items-center px-4 pb-2 border-b border-border/60">
        <div className="flex gap-1 shrink-0" title="Tema renkleri">
          <ColorChip color={bgSwatch} />
          <ColorChip color={accentSwatch} />
          <ColorChip color={pageSwatch} />
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-3">
        <div>
          <h3
            className="font-display text-lg leading-tight truncate"
            title={d.coupleName ?? handle}
          >
            {d.coupleName ?? handle}
          </h3>
          {d.templateLabel ? (
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {d.templateLabel}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
          {validWedding ? (
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5 shrink-0" />
              <span>
                {formatDate(validWedding, locale)}
                {countdown ? (
                  <span className="ml-1.5 text-foreground/70">
                    · {countdown}
                  </span>
                ) : null}
              </span>
            </div>
          ) : null}
          {d.venueName ? (
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate" title={d.venueName}>
                {d.venueName}
              </span>
            </div>
          ) : null}
          <button
            onClick={copyUrl}
            className="flex items-center gap-1.5 text-left hover:text-foreground transition-colors cursor-pointer min-w-0"
            title="Bağlantıyı kopyala"
          >
            <Copy className="size-3.5 shrink-0" />
            <span className="truncate font-mono">/davetiyem/{handle}</span>
          </button>
        </div>

        {/* Sayılar her zaman görünür, paywall sadece detay sayfasında.
             Free tier kullanıcı kaç kişinin geleceğini özet olarak görsün
             ama tek tek listeyi görmek için upgrade etmesi gereksin. */}
        <div className="grid grid-cols-3 gap-2 mt-1">
          <Stat icon={Users} value={d.guestCount} label="Misafir" />
          <Stat
            icon={Check}
            value={d.rsvpYesHeads}
            label="Gelecek"
            tone="emerald"
          />
          <Stat icon={MessageCircle} value={d.memoryCount} label="Hatıra" />
        </div>

        <div className="mt-auto pt-3 flex flex-col gap-2">
          <Link
            href={`/design/invitations/${d.id}/editor` as never}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary text-primary-foreground text-xs px-3 py-2.5 font-chakra uppercase tracking-[0.15em] hover:opacity-90 transition-opacity"
          >
            <Pencil className="size-3.5" /> Düzenle
          </Link>
          {/* Yayınlanmış davetiyelerde "Paylaş" butonu, /save ekranına
              yönlendiriyor — QR, link kopyala, WhatsApp/Telegram/SMS
              paylaşım, paket yükselt akışı hep orada. Eskiden bu
              ekrana sadece ilk yayında erişilebiliyordu, kullanıcı
              geri dönmek isteyince yolunu bulamıyordu. */}
          {isPublished ? (
            <Link
              href={`/design/invitations/${d.id}/save` as never}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-card text-foreground text-xs px-3 py-2.5 font-chakra uppercase tracking-[0.15em] hover:bg-muted transition-colors"
            >
              <Share2 className="size-3.5" /> Paylaş & QR
            </Link>
          ) : null}
          <div className="grid grid-cols-4 gap-1.5">
            {isPublished ? (
              <QuickAction
                icon={ExternalLink}
                label="Yayını Aç"
                href={publicUrl}
                external
              />
            ) : (
              <QuickAction
                icon={Eye}
                label="Yayınla"
                href={`/design/invitations/${d.id}/save`}
              />
            )}
            {/* Misafir / Hatıra detay sayfaları premium feature. Free
                kullanıcı sayıyı kart üstünde görüyor ama listeyi
                açabilmek için Klasik+ paketine geçmek zorunda. */}
            {planLimitsFor(d.tier).rsvpReadEnabled ? (
              <QuickAction
                icon={Users}
                label="Misafir"
                href={`/dashboard/${d.id}/guests`}
              />
            ) : (
              <QuickAction
                icon={Lock}
                label="Misafir"
                onClick={() => {
                  // Otomatik /save'a yönlendirme yapmıyoruz. Toast'ta
                  // Yükselt aksiyonu var, kullanıcı tıklarsa gider.
                  // Önceden tıklayınca hem toast çıkıp hem yönlenince
                  // kullanıcı kafası karışıyordu.
                  toast.warning(
                    `Misafir listesi ${nextTierLabel(d.tier)} paketinde açılır.`,
                    {
                      action: {
                        label: "Yükselt",
                        onClick: () =>
                          router.push(
                            `/design/invitations/${d.id}/save` as never
                          ),
                      },
                    }
                  );
                }}
                locked
              />
            )}
            {planLimitsFor(d.tier).memoryBookEnabled ? (
              <QuickAction
                icon={MessageCircle}
                label="Hatıra"
                href={`/dashboard/${d.id}/memories`}
              />
            ) : (
              <QuickAction
                icon={Lock}
                label="Hatıra"
                onClick={() => {
                  toast.warning(
                    `Hatıra defteri ${nextTierLabel(d.tier)} paketinde açılır.`,
                    {
                      action: {
                        label: "Yükselt",
                        onClick: () =>
                          router.push(
                            `/design/invitations/${d.id}/save` as never
                          ),
                      },
                    }
                  );
                }}
                locked
              />
            )}
            <QuickAction
              icon={Trash2}
              label="Sil"
              onClick={onDelete}
              destructive
            />
          </div>
        </div>

        <div className="text-[10px] text-muted-foreground/70">
          Son güncelleme: {updatedRelative}
        </div>
      </div>
    </article>
  );
}

function ColorChip({ color }: { color: string }) {
  return (
    <span
      className="size-4 rounded-full border border-white/60 shadow-sm"
      style={{ background: color }}
    />
  );
}

function StatusBadge({ published }: { published: boolean }) {
  if (published) {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-500/90 text-white text-[10px] px-2.5 py-0.5 font-medium uppercase tracking-wider">
        Yayında
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-amber-500/90 text-white text-[10px] px-2.5 py-0.5 font-medium uppercase tracking-wider">
      Taslak
    </span>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: typeof Users;
  value: number;
  label: string;
  tone?: "emerald";
}) {
  return (
    <div className="rounded-lg bg-muted/50 px-2 py-1.5">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" /> {label}
      </div>
      <div
        className={`mt-0.5 text-base font-semibold leading-none ${
          tone === "emerald" ? "text-emerald-600" : "text-foreground"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

/**
 * Stat slot that hides the actual number behind a paywall. Free-tier
 * users see this where the RSVP "Gelecek" count would normally be.
 * Clicking it routes to the publish/save screen where they can pick a
 * higher tier, that's the existing upgrade entry point so we don't
 * fork the upgrade flow per surface.
 */
/**
 * Tier rozeti, kullanıcı kart üstünde davetiyenin hangi paketle
 * yayınlandığını/oluşturulduğunu görüyor. Davetiye-bazlı satış
 * yaptığımız için her kart kendi tier'ını gösteriyor (kullanıcının
 * global "üyelik" durumu yok).
 */
/**
 * Tier badge'in yanına oturan kompakt "Paketi Yükselt" butonu. Premium
 * dışındaki her tier'da görünür ve davetiye-bazlı save/publish ekranına
 * yönlendirir; orada zaten tier picker var, ayrı upgrade flow yaratmıyoruz.
 *
 * Görsel: amber-pill + arrow-up-right ikon, dikkat çeker ama TierBadge'in
 * yanında orantılı kalır.
 */
function UpgradeButton({
  designId,
  tier,
}: {
  designId: string;
  tier: PlanTier | undefined | null;
}) {
  const t = tier ?? "free";
  if (t === "premium") return null;
  const next = nextTierLabel(tier);
  return (
    <Link
      href={`/design/invitations/${designId}/save` as never}
      title={`${next} paketine yükselt`}
      className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 text-amber-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider hover:bg-amber-100 hover:border-amber-400 transition-colors cursor-pointer shrink-0"
    >
      <Sparkles className="size-2.5" />
      <span>Yükselt</span>
      <ArrowUpRight className="size-2.5" />
    </Link>
  );
}

// Module-level constant; eskiden her TierBadge render'ında 4 entry'lik
// Record yeniden allocate ediliyordu. (rendering-hoist-jsx)
const TIER_BADGE_META: Record<PlanTier, { label: string; cls: string }> = {
  free: { label: "Free", cls: "bg-muted text-foreground/70 border-border" },
  basic: { label: "Klasik", cls: "bg-sky-50 text-sky-700 border-sky-200" },
  pro: { label: "Pro", cls: "bg-violet-50 text-violet-700 border-violet-200" },
  premium: {
    label: "Premium",
    cls: "bg-amber-50 text-amber-800 border-amber-300",
  },
};

function TierBadge({ tier }: { tier: PlanTier | undefined | null }) {
  const m = TIER_BADGE_META[tier ?? "free"];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${m.cls}`}
      title={`Bu davetiye ${m.label} paketinde`}
    >
      {m.label}
    </span>
  );
}

function QuickAction({
  icon: Icon,
  label,
  href,
  external,
  onClick,
  destructive,
  locked,
}: {
  icon: LucideIcon;
  label: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  destructive?: boolean;
  /** Premium feature, buton görsel olarak kilitli görünür ve onClick
   *  upgrade sayfasına yönlendirir. */
  locked?: boolean;
}) {
  const base =
    "inline-flex flex-col items-center justify-center gap-1 rounded-lg border py-2 px-1 text-[10px] font-medium uppercase tracking-wider cursor-pointer transition-colors";
  const tone = destructive
    ? "border-border text-destructive hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
    : locked
    ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground hover:border-foreground/30";
  const className = `${base} ${tone}`;
  const inner = (
    <>
      <Icon className="size-3.5" />
      <span className="leading-none">{label}</span>
    </>
  );

  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        title={label}
      >
        {inner}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href as never} className={className} title={label}>
        {inner}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={className} title={label} type="button">
      {inner}
    </button>
  );
}

function ConfirmDelete({
  slug,
  coupleName,
  guestCount,
  memoryCount,
  busy,
  onCancel,
  onConfirm,
}: {
  slug: string;
  coupleName: string | null;
  guestCount: number;
  memoryCount: number;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={busy ? undefined : onCancel}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-xl mb-2">Davetiyeyi sil</h3>
        <p className="text-sm text-muted-foreground mb-4">
          <span className="font-medium text-foreground">
            {coupleName ?? slug}
          </span>{" "}
          adlı davetiye kalıcı olarak silinecek. Bu işlem geri alınamaz.
        </p>
        {guestCount + memoryCount > 0 ? (
          <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs px-3 py-2 mb-5">
            Birlikte silinecekler: <strong>{guestCount}</strong> misafir kaydı,{" "}
            <strong>{memoryCount}</strong> hatıra yazısı.
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            disabled={busy}
            className="flex-1 px-4 py-2.5 rounded-full border border-border bg-white text-sm hover:border-foreground/40 cursor-pointer disabled:opacity-50"
          >
            Vazgeç
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 px-4 py-2.5 rounded-full bg-destructive text-destructive-foreground text-sm hover:opacity-90 cursor-pointer disabled:opacity-70"
          >
            {busy ? "Siliniyor..." : "Evet, Sil"}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(d: Date, locale: string): string {
  return d.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function countdownLabel(target: Date): string {
  const now = Date.now();
  const diff = target.getTime() - now;
  const days = Math.round(diff / (24 * 60 * 60 * 1000));
  if (days > 1) return `${days} gün kaldı`;
  if (days === 1) return "Yarın";
  if (days === 0) return "Bugün";
  if (days === -1) return "Dün";
  return `${Math.abs(days)} gün önce`;
}

function relativeTime(d: Date, locale: string): string {
  const diffMs = Date.now() - d.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "az önce";
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} sa önce`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} gün önce`;
  return formatDate(d, locale);
}
