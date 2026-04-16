"use client";

import { useWedding } from "../_lib/context";
import { OrnamentalDivider } from "../_components/OrnamentalDivider";
import { ScrollReveal } from "../_components/ScrollReveal";
import { MapPin, Heart } from "lucide-react";
import Link from "next/link";

const BASE = "/grow";

export default function IletisimPage() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  return (
    <div className="min-h-svh pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <ScrollReveal className="text-center mb-12">
          <OrnamentalDivider className="mb-6" />
          <p className="font-sans text-xs tracking-[3px] uppercase text-white/30">
            İletişim
          </p>
          <h1 className="font-merienda text-3xl md:text-4xl text-[#d5d1ad] mt-3">
            {brideFirst} & {groomFirst}
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="liquid-glass rounded-3xl border border-white/10 p-8 text-center space-y-6">
            <p className="font-sans text-sm text-white/60 leading-relaxed">
              Düğünümüzle ilgili sorularınız için bizimle iletişime
              geçebilirsiniz. Sizi aramızda görmekten mutluluk duyacağız.
            </p>

            {wedding.venueName && (
              <div className="flex items-center justify-center gap-2 text-white/50">
                <MapPin className="size-4 text-[#d5d1ad]/60" />
                <span className="font-sans text-sm">{wedding.venueName}</span>
              </div>
            )}

            <div className="h-px bg-white/10" />

            <div className="space-y-3">
              <Link
                href={`${BASE}/lcv`}
                className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#d5d1ad] text-[#252224] font-sans font-semibold text-sm hover:bg-[#d5d1ad]/90 transition-colors"
              >
                <Heart className="size-4" />
                LCV&apos;nizi Doldurun
              </Link>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="mt-8 text-center">
          <p className="font-sans text-xs text-white/20">
            <Link
              href="https://uygundavet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/30 transition-colors"
            >
              Uygun Davet
            </Link>{" "}
            ile oluşturuldu
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}
