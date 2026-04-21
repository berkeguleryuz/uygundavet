"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface BottomBarItem {
  label: string;
  href: string;
}

interface Props {
  items: BottomBarItem[];
}

export function BottomBar({ items }: Props) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobil gezinme"
      className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[55] w-[calc(100%-1rem)]"
    >
      <div className="flex items-center justify-between rounded-full bg-[#1c1a1b]/90 backdrop-blur-md border border-white/10 p-1 shadow-[0_10px_40px_-8px_rgba(0,0,0,0.7)]">
        <Link
          href="/"
          aria-label="Ana sayfa"
          className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Image
            src="/logo-gold-transparent.png"
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
                "shrink-0 rounded-xl py-1 px-2.5 flex items-center justify-center text-center text-[10px] tracking-[0.08em] uppercase font-semibold transition-colors",
                active
                  ? "bg-white text-[#1c1a1b]"
                  : "text-white/80 hover:text-white"
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
