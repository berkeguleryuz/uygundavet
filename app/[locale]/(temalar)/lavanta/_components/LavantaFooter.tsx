"use client";

import Link from "next/link";
import { useWedding } from "../_lib/context";

export function LavantaFooter() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const weddingDate = new Date(wedding.weddingDate).toLocaleDateString(
    "tr-TR",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <footer className="bg-[#1c1a1b] border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6 py-10 text-center space-y-4">
        <p className="font-merienda text-2xl text-[#d5d1ad]">
          {brideFirst} & {groomFirst}
        </p>
        <p className="font-sans text-sm text-white/40">{weddingDate}</p>
        <div className="h-px w-16 bg-[#d5d1ad]/20 mx-auto" />
        <p className="font-sans text-xs text-white/25">
          <Link
            href="https://uygundavet.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/40 transition-colors"
          >
            Uygun Davet
          </Link>{" "}
          ile oluşturuldu
        </p>
      </div>
    </footer>
  );
}
