"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useSession, signOut } from "@/src/lib/auth-client";

const TABS = [
  { key: "designs", href: "/", label: "Tasarımlar" },
  { key: "invitations", href: "/dashboard", label: "Davetiyelerim" },
  { key: "pricing", href: "/pricing", label: "Fiyatlandırma" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function activeKeyFromPath(pathname: string): TabKey | null {
  if (pathname.startsWith("/dashboard")) return "invitations";
  if (pathname.startsWith("/pricing")) return "pricing";
  if (pathname === "/" || pathname === "") return "designs";
  return null;
}

/** Routes that manage their own full-page chrome — Nav shouldn't render there. */
const HIDDEN_ON = [
  "/login",
  "/signup",
  "/design/invitations/", // editor + save screens own the viewport
  "/admin",
  "/i/", // public invitation view
];

export function Nav() {
  const session = useSession();
  const pathname = usePathname();
  const activeKey = activeKeyFromPath(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  const user = session.data?.user;
  const initial =
    user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?";
  const displayName =
    user?.name ?? user?.email?.split("@")[0] ?? "Hesabım";

  return (
    <header
      className="sticky top-3 z-40 w-full px-3 md:px-6 pointer-events-none"
      style={{ fontFamily: "Space Grotesk, sans-serif" }}
    >
      <div className="pointer-events-auto mx-auto flex items-center gap-2 h-14 pl-3 pr-2 rounded-full bg-white/90 backdrop-blur-md border border-border shadow-[0_4px_20px_-6px_rgba(0,0,0,0.08)]">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 flex items-center gap-1.5 pr-2 text-lg md:text-xl font-semibold tracking-tight text-foreground"
          style={{ fontFamily: "Merienda, serif" }}
        >
          davety
          <span className="text-muted-foreground text-[11px]">.com</span>
        </Link>

        <span className="hidden md:block w-px h-6 bg-border" aria-hidden />

        {/* Desktop tabs — pills inside the pill nav */}
        <nav className="hidden md:flex items-center gap-1">
          {TABS.map((tab) => {
            const active = tab.key === activeKey;
            return (
              <Link
                key={tab.key}
                href={tab.href as "/"}
                className={`px-4 h-10 inline-flex items-center rounded-full text-sm transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* User pill (auth-aware) */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex items-center gap-2 h-10 pl-1 pr-3 rounded-full bg-white border border-border hover:border-foreground/40 transition-colors cursor-pointer"
            >
              <span
                className="size-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-medium"
                aria-hidden
              >
                {initial}
              </span>
              <span className="hidden sm:block text-sm max-w-[8rem] truncate">
                {displayName}
              </span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            {menuOpen ? (
              <>
                <button
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Kapat"
                />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-border shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <div className="text-sm font-medium truncate">
                      {displayName}
                    </div>
                    {user.email ? (
                      <div className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </div>
                    ) : null}
                  </div>
                  <MenuLink href="/dashboard" onClick={() => setMenuOpen(false)}>
                    Davetiyelerim
                  </MenuLink>
                  <MenuLink href="/envelopes" onClick={() => setMenuOpen(false)}>
                    Zarf Galerisi
                  </MenuLink>
                  <MenuLink href="/" onClick={() => setMenuOpen(false)}>
                    Tasarımlar
                  </MenuLink>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-muted cursor-pointer"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </>
            ) : null}
          </div>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-foreground text-background text-sm hover:bg-foreground/90 transition-colors"
          >
            Giriş Yap
          </Link>
        )}
      </div>

      {/* Mobile tabs row — also pills, below the nav pill */}
      <div className="pointer-events-auto md:hidden mt-2 flex items-center gap-1.5 overflow-x-auto px-1">
        {TABS.map((tab) => {
          const active = tab.key === activeKey;
          return (
            <Link
              key={tab.key}
              href={tab.href as "/"}
              className={`shrink-0 px-3.5 h-8 inline-flex items-center rounded-full text-xs transition-colors ${
                active
                  ? "bg-foreground text-background"
                  : "bg-white border border-border text-muted-foreground"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}

function MenuLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href as "/"}
      onClick={onClick}
      className="block px-4 py-2.5 text-sm hover:bg-muted"
    >
      {children}
    </Link>
  );
}
