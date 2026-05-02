"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  slug: string;
}

export function PasswordGate({ slug }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/public/design/${slug}/unlock`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.status === 429) {
        setError("Çok fazla deneme, biraz bekle.");
        return;
      }
      if (!res.ok) {
        setError("Şifre yanlış.");
        return;
      }
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center bg-[#252224] px-6 text-[#d5d1ad]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#1c1a1c] border border-[#d5d1ad]/20 rounded-2xl p-6 flex flex-col gap-4"
      >
        <div>
          <h1
            className="text-2xl"
            style={{ fontFamily: "Merienda, serif" }}
          >
            Davetiye Korumalı
          </h1>
          <p className="text-sm opacity-70 mt-1">
            Bu davetiye şifre ile korunuyor. Davet eden tarafından sana
            verilen şifreyi gir.
          </p>
        </div>
        <input
          type="password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifre"
          className="w-full rounded-md border border-[#d5d1ad]/30 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-[#d5d1ad]"
        />
        {error ? (
          <div className="text-xs text-red-400">{error}</div>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-md bg-[#d5d1ad] text-[#252224] py-2 text-xs uppercase tracking-[0.2em] disabled:opacity-50 cursor-pointer"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          {busy ? "Kontrol ediliyor..." : "Davetiyeyi Aç"}
        </button>
      </form>
    </main>
  );
}
