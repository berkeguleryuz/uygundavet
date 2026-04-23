"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter, Link } from "@/i18n/navigation";
import { signUp } from "@/src/lib/auth-client";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await signUp.email({
      email,
      password,
      name,
      callbackURL: returnTo,
    });
    setBusy(false);
    if (res.error) {
      toast.error(res.error.message ?? "Kayıt başarısız");
      return;
    }
    toast.success("Hesabın oluşturuldu");
    router.push(returnTo);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        required
        placeholder="Ad Soyad"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
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
        minLength={8}
        placeholder="Şifre (en az 8)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-primary text-primary-foreground py-2.5 font-chakra uppercase tracking-[0.2em] text-xs disabled:opacity-50 cursor-pointer"
      >
        {busy ? "..." : "Kayıt Ol"}
      </button>

      <p className="text-xs text-center text-muted-foreground mt-2">
        Zaten hesabın var mı?{" "}
        <Link href={`/login?returnTo=${encodeURIComponent(returnTo)}`} className="underline">
          Giriş yap
        </Link>
      </p>
    </form>
  );
}
