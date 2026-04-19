"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface ThemeBottomBarItem {
  label: string;
  href: string;
}

interface Props {
  base: string;
  items: ThemeBottomBarItem[];
  logoSrc?: string;
  barClassName?: string;
  pillClassName?: string;
  activePillClassName?: string;
}

export function ThemeBottomBar({
  base,
  items,
  logoSrc = "/logo-gold-transparent.png",
  barClassName,
  pillClassName,
  activePillClassName,
}: Props) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobil gezinme"
      className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[55] w-[calc(100%-1rem)]"
    >
      <div
        className={cn(
          "flex items-center gap-1.5 rounded-2xl bg-[#1c1a1b]/90 backdrop-blur-md border border-white/10 p-1.5 shadow-[0_10px_40px_-8px_rgba(0,0,0,0.7)]",
          barClassName
        )}
      >
        <Link
          href={base}
          aria-label="Ana sayfa"
          className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Image
            src={logoSrc}
            alt=""
            width={28}
            height={28}
            className="object-contain"
          />
        </Link>

        {items.map((item) => {
          const active =
            pathname === item.href || pathname.endsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 min-w-0 rounded-xl h-11 px-2 flex items-center justify-center text-center font-chakra text-[10px] tracking-[0.08em] uppercase font-semibold border transition-colors",
                active
                  ? cn(
                      "bg-white text-[#1c1a1b] border-white",
                      activePillClassName
                    )
                  : cn(
                      "text-white/80 border-white/15 hover:text-white hover:border-white/30",
                      pillClassName
                    )
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
