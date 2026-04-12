"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  MoreHorizontal, Check, Trash2, BookHeart, Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface MemoryEntry {
  _id: string;
  authorName: string;
  message: string;
  approved: boolean;
  createdAt: string;
}

const demoEntries: MemoryEntry[] = [
  { _id: "1", authorName: "Elif Yıldız", createdAt: "2026-04-10T12:00:00Z", message: "Mutluluğunuz daim olsun! Düğününüzü sabırsızlıkla bekliyoruz.", approved: true },
  { _id: "2", authorName: "Burak Özdemir", createdAt: "2026-04-10T09:00:00Z", message: "Harika bir çift olacaksınız, iyi ki varsınız!", approved: true },
  { _id: "3", authorName: "Zeynep Aksoy", createdAt: "2026-04-09T12:00:00Z", message: "Düğün davetiyeniz çok güzelmiş, tebrikler! Sizlerle birlikte olmayı çok istiyoruz.", approved: true },
  { _id: "4", authorName: "Ahmet Kara", createdAt: "2026-04-09T10:00:00Z", message: "Ömür boyu mutluluklar diliyoruz, sevgiyle kalın.", approved: true },
  { _id: "5", authorName: "Selin Demir", createdAt: "2026-04-08T12:00:00Z", message: "En güzel günleriniz başlıyor, çok heyecanlıyız! Ömür boyu mutluluklar.", approved: true },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function AniDefteriContent({ isDemo }: { isDemo?: boolean }) {
  const t = useTranslations("Dashboard");
  const [entries, setEntries] = useState<MemoryEntry[]>(isDemo ? demoEntries : []);
  const [loading, setLoading] = useState(!isDemo);

  useEffect(() => {
    if (isDemo) return;
    fetch("/api/dashboard/memory")
      .then((r) => r.json())
      .then((data) => setEntries(data.entries || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isDemo]);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/memory/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEntries((prev) => prev.map((e) => (e._id === id ? data.entry : e)));
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/memory/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch {
      toast.error(t("deleteError"));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <BookHeart className="size-5 text-muted-foreground" />
        <h1 className="text-xl font-semibold tracking-tight">{t("memoryBook")}</h1>
        <Badge variant="secondary">{t("messagesCount", { count: entries.length })}</Badge>
      </div>

      <p className="text-sm text-muted-foreground">{t("memoryBookDescription")}</p>

      {entries.length === 0 ? (
        <div className="text-center py-20">
          <BookHeart className="size-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">{t("noMessages")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry._id} className="bg-card rounded-xl border p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback>{entry.authorName.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{entry.authorName}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</p>
                  </div>
                </div>
                {!isDemo && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground">
                        <MoreHorizontal className="size-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleApprove(entry._id)}>
                        <Check className="size-4" />
                        <span>{entry.approved ? t("unapprove") : t("approve")}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(entry._id)}>
                        <Trash2 className="size-4" />
                        <span>{t("delete")}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <p className="text-sm leading-relaxed mt-3 text-muted-foreground">{entry.message}</p>
              {!entry.approved && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-amber-400 border-amber-500/40 text-xs">{t("pendingApproval")}</Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
