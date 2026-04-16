"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ScrollReveal } from "../_components/ScrollReveal";
import { useWedding } from "../_lib/context";
import { MorphButton } from "@/app/components/MorphButton";

const BASE = "/Grow";

export function SectionCTA() {
  const wedding = useWedding();
  const router = useRouter();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  return (
    <section className="relative py-32 md:py-44 bg-[#252224] overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-[#d5d1ad]/8 to-transparent absolute top-0 inset-x-0" />

      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=60"
          alt=""
          fill
          className="object-cover opacity-[0.06]"
          sizes="100vw"
        />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#d5d1ad]/[0.02] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
        <ScrollReveal>
          <div className="w-14 h-14 rounded-full border border-[#d5d1ad]/15 flex items-center justify-center mx-auto mb-8">
            <span className="font-merienda text-sm text-[#d5d1ad]/40">
              {brideFirst[0]}&{groomFirst[0]}
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="font-merienda text-3xl md:text-4xl text-[#d5d1ad]/80 mb-5 leading-[1.3]">
            Sizi de Bekliyoruz
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="font-sans text-sm text-white/35 leading-[1.8] mb-12 max-w-sm mx-auto">
            Hayatımızın en güzel gününde sizi de aramızda görmekten büyük mutluluk duyacağız.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <MorphButton
            variant="filled"
            className="text-xs"
            onClick={() => router.push(`${BASE}/lcv`)}
          >
            Davetiyeyi Yanıtla
          </MorphButton>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <div className="flex items-center justify-center gap-6 mt-12 flex-wrap">
            {[
              { label: "Anı Bırak", href: `${BASE}/ani-defteri` },
              { label: "Galeri", href: `${BASE}/galeri` },
              { label: "İletişim", href: `${BASE}/iletisim` },
            ].map((link, i) => (
              <span key={link.label} className="flex items-center gap-6">
                {i > 0 && <span className="w-px h-3 bg-white/8" />}
                <Link
                  href={link.href}
                  className="font-sans text-[10px] text-white/25 hover:text-white/50 transition-colors tracking-[0.2em] uppercase"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
