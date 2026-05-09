import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { LoginForm } from "@/src/components/auth/LoginForm";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-dvh flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl mb-6 text-center">davety</h1>
        {/* LoginForm useSearchParams kullanıyor; Next.js bunun için
            Suspense boundary istiyor (full client bail-out yerine
            streaming render). */}
        <Suspense fallback={<div className="h-40 animate-pulse bg-muted rounded-md" />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
