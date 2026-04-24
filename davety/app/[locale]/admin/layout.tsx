import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { isAdminSession } from "@/src/lib/admin";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await isAdminSession();
  if (!session) {
    notFound();
  }

  return (
    <div className="min-h-dvh grid grid-rows-[56px_1fr]">
      <header className="border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-display text-xl">
            davety admin
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin/templates" className="hover:text-foreground text-muted-foreground">
              Templateler
            </Link>
            <Link href="/admin/designs" className="hover:text-foreground text-muted-foreground">
              Davetiyeler
            </Link>
            <Link href="/admin/users" className="hover:text-foreground text-muted-foreground">
              Kullanıcılar
            </Link>
          </nav>
        </div>
        <div className="text-xs text-muted-foreground">
          {session.user.email}
        </div>
      </header>
      <div className="overflow-y-auto">{children}</div>
    </div>
  );
}
