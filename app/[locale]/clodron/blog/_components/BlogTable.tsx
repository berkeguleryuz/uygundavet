"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type Post = {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
  aiGenerated: boolean;
};

export function BlogTable() {
  const t = useTranslations("Blog");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/clodron/blog");
      const data = await res.json();
      setPosts(data.items ?? []);
    } catch {
      toast.error("Yüklenemedi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm(t("confirmDelete"))) return;
    const res = await fetch(`/api/clodron/blog/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success(t("deleted"));
      load();
    } else {
      toast.error("Hata");
    }
  }

  if (loading) return <div className="p-6 text-sm opacity-60">...</div>;
  if (posts.length === 0)
    return <div className="p-6 text-sm opacity-60">{t("noPosts")}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left opacity-60">
          <tr>
            <th className="py-3">{t("title")}</th>
            <th className="py-3">{t("status")}</th>
            <th className="py-3">{t("date")}</th>
            <th className="py-3">{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p._id} className="border-t border-white/10">
              <td className="py-3">
                <div className="font-medium">{p.title}</div>
                <div className="text-xs opacity-60">/blog/{p.slug}</div>
              </td>
              <td className="py-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    p.status === "published"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {p.status === "published" ? t("published") : t("draft")}
                </span>
                {p.aiGenerated && (
                  <span className="ml-2 px-2 py-1 rounded text-xs bg-violet-500/20 text-violet-300">
                    {t("aiGenerated")}
                  </span>
                )}
              </td>
              <td className="py-3">
                {new Date(p.publishedAt ?? p.createdAt).toLocaleDateString(
                  "tr-TR"
                )}
              </td>
              <td className="py-3">
                <div className="flex gap-2">
                  <Link
                    href={`/clodron/blog/${p._id}/duzenle`}
                    className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
                  >
                    {t("edit")}
                  </Link>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300"
                  >
                    {t("delete")}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
