"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/app/components/Logo";
import { LayoutDashboard, ShoppingBag, Users } from "lucide-react";

const navItems = [
  { key: "overview", icon: LayoutDashboard, href: "/clodron" },
  { key: "orders", icon: ShoppingBag, href: "/clodron/siparisler" },
  { key: "users", icon: Users, href: "/clodron/kullanicilar" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/clodron") {
      return pathname.endsWith("/clodron");
    }
    return pathname.includes(href);
  };

  return (
    <div className="w-60 border-r border-white/10 flex flex-col shrink-0">
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/clodron" className="flex items-center gap-2.5">
          <Logo className="w-7 h-7" />
          <span className="font-merienda font-bold text-lg text-white">
            Clodron
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>
                {item.key === "overview" && "Genel Bakış"}
                {item.key === "orders" && "Siparişler"}
                {item.key === "users" && "Kullanıcılar"}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-white/10">
        <Link
          href="/"
          className="text-xs text-white/30 hover:text-white/60 font-sans transition-colors"
        >
          ← Ana Siteye Dön
        </Link>
      </div>
    </div>
  );
}
