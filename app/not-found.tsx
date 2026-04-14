import Link from "next/link";
import { routing } from "@/i18n/routing";

export default function RootNotFound() {
  return (
    <html lang={routing.defaultLocale} className="dark">
      <body className="min-h-screen bg-[#252224] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p
            className="text-[10rem] md:text-[14rem] font-bold leading-none select-none"
            style={{
              fontFamily: "system-ui, sans-serif",
              background:
                "linear-gradient(135deg, #d5d1ad 0%, #b49a7c 50%, #d5d1ad 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              opacity: 0.15,
            }}
          >
            404
          </p>

          <div className="-mt-20 md:-mt-24 relative z-10">
            <h1
              className="text-2xl md:text-3xl font-semibold text-[#d5d1ad] mb-4 tracking-tight"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Sayfa Bulunamadı
            </h1>

            <p
              className="text-sm text-white/40 mb-10 leading-relaxed"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Aradığınız sayfa mevcut değil veya taşınmış olabilir.
            </p>

            <Link
              href="/"
              className="inline-flex items-center justify-center text-sm font-medium tracking-wider uppercase border border-[#d5d1ad]/30 text-[#d5d1ad] rounded-full px-8 py-3.5 hover:bg-[#d5d1ad] hover:text-[#252224] transition-all duration-500"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
