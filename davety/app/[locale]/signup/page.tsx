import { setRequestLocale } from "next-intl/server";
import { SignupForm } from "@/src/components/auth/SignupForm";

export default async function SignupPage({
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
        <SignupForm />
      </div>
    </main>
  );
}
