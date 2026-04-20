"use client";

import { useId } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSalesStore } from "@/store/sales-store";

function ChatSmileGlyph({ className }: { className?: string }) {
  const maskId = useId();
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="white" />
          <circle cx="8" cy="10" r="1" fill="black">
            <animate attributeName="r" values="0.6;1.4;0.6" keyTimes="0;0.5;1" dur="1.2s" begin="0s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;1;0.6" keyTimes="0;0.5;1" dur="1.2s" begin="0s" repeatCount="indefinite" />
          </circle>
          <circle cx="12" cy="10" r="1" fill="black">
            <animate attributeName="r" values="0.6;1.4;0.6" keyTimes="0;0.5;1" dur="1.2s" begin="0.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;1;0.6" keyTimes="0;0.5;1" dur="1.2s" begin="0.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="16" cy="10" r="1" fill="black">
            <animate attributeName="r" values="0.6;1.4;0.6" keyTimes="0;0.5;1" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;1;0.6" keyTimes="0;0.5;1" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
          </circle>
        </mask>
      </defs>
      <path
        mask={`url(#${maskId})`}
        d="M6 3.5A2.5 2.5 0 0 0 3.5 6v8A2.5 2.5 0 0 0 6 16.5h1.3v2.6c0 .57.68.87 1.1.48l3.4-3.08H18a2.5 2.5 0 0 0 2.5-2.5V6A2.5 2.5 0 0 0 18 3.5H6Z"
      />
    </svg>
  );
}

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
  const toggleSales = useSalesStore((s) => s.toggle);
  const salesOpen = useSalesStore((s) => s.isOpen);

  return (
    <nav
      aria-label="Mobil gezinme"
      className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[55] w-[calc(100%-1rem)]"
    >
      <div
        className={cn(
          "flex items-center justify-between rounded-full bg-[#1c1a1b]/90 backdrop-blur-md border border-white/10 p-1 shadow-[0_10px_40px_-8px_rgba(0,0,0,0.7)]",
          barClassName
        )}
      >
        <Link
          href={"https://www.uygundavet.com"}
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
                "shrink-0 rounded-xl py-1 px-2.5 flex items-center justify-center text-center font-chakra text-[10px] tracking-[0.08em] uppercase font-semibold transition-colors",
                active
                  ? cn(
                      "bg-white text-[#1c1a1b] border-white",
                      activePillClassName
                    )
                  : cn(
                      "text-white/80 px-2.5 border-white/15 hover:text-white hover:border-white/30",
                      pillClassName
                    )
              )}
            >
              {item.label}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={toggleSales}
          aria-label="Bilgi al"
          aria-expanded={salesOpen}
          className="relative shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-[#d5d1ad] text-[#1c1a1b] hover:bg-[#c9c39b] transition-colors cursor-pointer"
        >
          <ChatSmileGlyph className="w-5 h-5" />
          {!salesOpen && (
            <span
              className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#ef4444]"
              style={{ boxShadow: "0 0 0 2px #d5d1ad" }}
            />
          )}
        </button>
      </div>
    </nav>
  );
}
