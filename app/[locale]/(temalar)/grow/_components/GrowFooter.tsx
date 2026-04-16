"use client";

import Link from "next/link";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { Heart, ExternalLink, Sparkles } from "lucide-react";
import { MorphButton } from "@/app/components/MorphButton";

export function GrowFooter() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const weddingDate = new Date(wedding.weddingDate).toLocaleDateString(
    "tr-TR",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <footer className="bg-[#161415] border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-6 pt-14 pb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-8 bg-[#d5d1ad]/20" />
          <Heart className="size-3.5 text-[#d5d1ad]/40" />
          <div className="h-px w-8 bg-[#d5d1ad]/20" />
        </div>
        <p className="font-merienda text-xl text-[#d5d1ad]/80">
          {brideFirst} & {groomFirst}
        </p>
        <p className="font-sans text-xs text-white/35 mt-1.5 tracking-wide">
          {weddingDate}
        </p>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="bg-gradient-to-br from-[#d5d1ad]/[0.06] to-[#d5d1ad]/[0.02] border border-[#d5d1ad]/12 rounded-2xl px-6 py-7 md:px-10 md:py-8">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#d5d1ad]/10 border border-[#d5d1ad]/20 flex items-center justify-center">
                  <Image
                    src="/logo-gold-transparent.png"
                    alt="Uygun Davet"
                    width={24}
                    height={24}
                    className="opacity-80"
                  />
                </div>
                <div>
                  <p className="font-merienda text-sm text-[#d5d1ad]/90">
                    Uygun Davet
                  </p>
                  <p className="font-sans text-[10px] text-white/35">
                    uygundavet.com
                  </p>
                </div>
              </div>

              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-1.5 mb-1.5">
                  <Sparkles className="size-3 text-[#d5d1ad]/50" />
                  <p className="font-sans text-sm text-[#d5d1ad]/80 font-medium">
                    Siz de böyle bir davetiye ister misiniz?
                  </p>
                </div>
                <p className="font-sans text-xs text-white/40 leading-relaxed max-w-md">
                  Kendi düğün web sitenizi dakikalar içinde oluşturun. QR kodlu
                  davetiye, LCV takibi, fotoğraf galerisi ve çok daha fazlası.
                </p>
              </div>

              <Link
                href="https://uygundavet.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MorphButton variant="filled" className="text-[10px] px-8 py-3.5 whitespace-nowrap">
                  <span className="flex items-center gap-2">
                    Hemen Başla
                    <ExternalLink className="size-3" />
                  </span>
                </MorphButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-gold-transparent.png"
              alt="Uygun Davet"
              width={14}
              height={14}
              className="opacity-40"
            />
            <p className="font-sans text-[10px] text-white/30 tracking-wider">
              © {new Date().getFullYear()} Uygun Davet. Tüm hakları saklıdır.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="https://uygundavet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[10px] text-white/35 hover:text-white/60 transition-colors tracking-wider"
            >
              uygundavet.com
            </Link>
            <span className="w-px h-2.5 bg-white/15" />
            <Link
              href="https://uygundavet.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[10px] text-white/35 hover:text-white/60 transition-colors tracking-wider"
            >
              Gizlilik
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
