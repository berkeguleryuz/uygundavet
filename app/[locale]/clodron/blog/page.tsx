import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { BlogTable } from "./_components/BlogTable";

export default async function ClodronBlogPage() {
  const t = await getTranslations("Blog");
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-orbitron">{t("adminTitle")}</h1>
        <Link
          href="/clodron/blog/yeni"
          className="px-6 py-3 rounded-tl-[1.5rem] bg-[#d5d1ad] text-[#252224] font-orbitron tracking-[0.1em] hover:opacity-90"
        >
          {t("newPost")}
        </Link>
      </div>
      <BlogTable />
    </div>
  );
}
