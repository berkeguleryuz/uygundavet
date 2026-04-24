"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter, Link } from "@/i18n/navigation";
import { signIn } from "@/src/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await signIn.email({
      email,
      password,
      callbackURL: returnTo,
    });
    setBusy(false);
    if (res.error) {
      toast.error(res.error.message ?? "Giriş başarısız");
      return;
    }
    router.push(returnTo);
  }

  async function handleGoogle() {
    await signIn.social({ provider: "google", callbackURL: returnTo });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="email"
        required
        placeholder="E-posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
      <input
        type="password"
        required
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-primary text-primary-foreground py-2.5 font-chakra uppercase tracking-[0.2em] text-xs disabled:opacity-50 cursor-pointer"
      >
        {busy ? "..." : "Giriş Yap"}
      </button>

      {process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true" ? (
        <button
          type="button"
          onClick={handleGoogle}
          className="rounded-full border border-input bg-background py-2.5 text-xs cursor-pointer hover:bg-muted"
        >
          Google ile Giriş
        </button>
      ) : null}

      <p className="text-xs text-center text-muted-foreground mt-2">
        Hesabın yok mu?{" "}
        <Link href={`/signup?returnTo=${encodeURIComponent(returnTo)}`} className="underline">
          Kayıt ol
        </Link>
      </p>
    </form>
  );
}
