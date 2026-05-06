"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { ArrowUpRight, Heart, Mail, MessageCircle } from "lucide-react";

/**
 * lucide-react v1.7'de Instagram icon yok, custom inline SVG ile
 * çözüyoruz. Resmi Instagram glyph'i (kare + daire + sağ üst nokta).
 */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

/**
 * Davetiye sayfaları (envelope animation), editor canvas'ı ve auth
 * sayfaları kendi tam-ekran chrome'larını yönetir, footer oralarda
 * görünmez. Diğer her sayfada (anasayfa, dashboard, gallery, pricing,
 * vb.) altta render edilir.
 */
const HIDDEN_ON = [
  "/login",
  "/signup",
  "/design/invitations/",
  "/admin",
  "/i/",
];

const PRODUCT_LINKS: { label: string; href: string }[] = [
  { label: "Tasarımlar", href: "/" },
  { label: "Galeri", href: "/davetiye-galerisi" },
  { label: "Davetiyelerim", href: "/dashboard" },
  { label: "Fiyatlandırma", href: "/pricing" },
];

const RESOURCE_LINKS: { label: string; href: string }[] = [
  { label: "Şablonlar", href: "/davetiye-galerisi" },
  { label: "3D Zarflar", href: "/zarf" },
  { label: "Yardım Merkezi", href: "/pricing" },
];

const LEGAL_LINKS: { label: string; href: string }[] = [
  { label: "Gizlilik Politikası", href: "/privacy" },
  { label: "Kullanım Şartları", href: "/terms" },
  { label: "Çerez Politikası", href: "/cookies" },
  { label: "Veri Silme", href: "/data-deletion" },
];

const SOCIAL_LINKS: {
  label: string;
  href: string;
  Icon: (props: { className?: string }) => React.ReactElement;
}[] = [
  {
    label: "Instagram",
    href: "https://instagram.com/davetyolla",
    Icon: InstagramIcon,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/905546789780",
    Icon: MessageCircle,
  },
  {
    label: "E-posta",
    href: "mailto:hello@davetyolla.com",
    Icon: Mail,
  },
];

export function Footer() {
  const pathname = usePathname() ?? "";
  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  const year = new Date().getFullYear();

  return (
    <footer
      className="relative w-full mt-24 overflow-hidden border-t border-white/5"
      style={{ background: "#252224", color: "#f5f6f3" }}
    >
      {/* Üst dekoratif altın gradient çizgi, sayfa ile footer arasında
          görsel bir kapanış sağlar. */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #d5d1ad 50%, transparent 100%)",
        }}
      />

      {/* Hero brand block, logo çok belirgin */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div className="flex items-center gap-5">
            <Image
              src="/davetyolla.webp"
              alt="DavetYolla"
              width={120}
              height={120}
              className="rounded-2xl object-contain w-24 h-24 md:w-28 md:h-28 shadow-[0_18px_50px_-12px_rgba(213,209,173,0.35)]"
            />
            <div className="flex flex-col gap-2">
              <span
                className="text-3xl md:text-5xl font-black tracking-tight leading-[0.95]"
                style={{
                  fontFamily: "var(--font-chakra), Chakra Petch, sans-serif",
                  color: "#d5d1ad",
                }}
              >
                DavetYolla
              </span>
              <span
                className="text-sm md:text-base opacity-70 max-w-md leading-relaxed"
                style={{
                  fontFamily:
                    "var(--font-space-grotesk), Space Grotesk, sans-serif",
                }}
              >
                Düğün, nişan, doğum günü, sünnet ve kurumsal etkinlikleriniz
                için modern dijital davetiye platformu.
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="self-start md:self-auto inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs uppercase tracking-[0.22em] font-semibold transition-transform hover:scale-105 cursor-pointer"
            style={{
              background: "#d5d1ad",
              color: "#252224",
              fontFamily: "var(--font-chakra), Chakra Petch, sans-serif",
            }}
          >
            Davetiyeni Yarat
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* Link kolonları + sosyal ikonlar */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <FooterColumn title="Ürün" links={PRODUCT_LINKS} />
          <FooterColumn title="Kaynaklar" links={RESOURCE_LINKS} />
          <FooterColumn title="Yasal" links={LEGAL_LINKS} />

          <div className="col-span-2 md:col-span-1">
            <h3
              className="text-[11px] uppercase tracking-[0.25em] mb-4 opacity-60"
              style={{
                fontFamily: "var(--font-chakra), Chakra Petch, sans-serif",
              }}
            >
              Sosyal
            </h3>
            <div className="flex flex-wrap gap-2">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="size-10 inline-flex items-center justify-center rounded-full border border-white/15 hover:border-[#d5d1ad] hover:bg-[#d5d1ad]/10 transition-colors cursor-pointer"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
            <p
              className="text-xs mt-5 opacity-70 leading-relaxed"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), Space Grotesk, sans-serif",
              }}
            >
              Sorun mu var? Sağ alttaki sohbet butonundan veya{" "}
              <a
                href="mailto:hello@davetyolla.com"
                className="underline hover:text-[#d5d1ad] transition-colors"
              >
                hello@davetyolla.com
              </a>{" "}
              adresinden bize ulaşabilirsin.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar, copyright + made with */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span
            className="text-xs opacity-60"
            style={{
              fontFamily:
                "var(--font-space-grotesk), Space Grotesk, sans-serif",
            }}
          >
            © {year} DavetYolla. Tüm hakları saklıdır.
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-xs opacity-60"
            style={{
              fontFamily:
                "var(--font-space-grotesk), Space Grotesk, sans-serif",
            }}
          >
            Türkiye&apos;de
            <Heart className="size-3 fill-[#d5d1ad] text-[#d5d1ad]" />
            ile yapıldı
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3
        className="text-[11px] uppercase tracking-[0.25em] mb-4 opacity-60"
        style={{
          fontFamily: "var(--font-chakra), Chakra Petch, sans-serif",
        }}
      >
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href as never}
              className="text-sm opacity-85 hover:opacity-100 hover:text-[#d5d1ad] transition-colors cursor-pointer inline-flex items-center gap-1"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), Space Grotesk, sans-serif",
              }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
