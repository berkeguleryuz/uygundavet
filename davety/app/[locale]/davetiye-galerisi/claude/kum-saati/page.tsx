import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { getClaudeScene } from "@/app/components/three-claude/sceneRegistry";
import { KumSaatiScene } from "./Scene";

export default async function KumSaatiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  void locale;
  const meta = getClaudeScene("kum-saati")!;

  return (
    <main
      className="min-h-dvh px-6 py-10"
      style={{ background: meta.palette.bg, color: meta.palette.ink }}
    >
      <header className="mx-auto mb-6 max-w-5xl">
        <Link
          href="/davetiye-galerisi"
          className="font-mono text-[11px] uppercase tracking-[0.28em] opacity-60 hover:opacity-100"
        >
          ← /davetiye-galerisi
        </Link>
        <h1
          className="mt-3 text-3xl md:text-4xl"
          style={{ fontFamily: "Merienda, serif" }}
        >
          {String(meta.index).padStart(2, "0")} · {meta.title}
        </h1>
        <p
          className="mt-2 max-w-2xl text-sm opacity-80"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          {meta.physics} <span className="opacity-60">·</span> {meta.exit}
        </p>
      </header>

      <KumSaatiScene palette={meta.palette} />
    </main>
  );
}
