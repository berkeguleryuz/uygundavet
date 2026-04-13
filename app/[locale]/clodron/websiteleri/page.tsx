"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  Image as ImageIcon,
  BookOpen,
  Users,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

interface WebsiteItem {
  _id: string;
  userId: string;
  bride: { firstName: string; lastName: string };
  groom: { firstName: string; lastName: string };
  weddingDate: string;
  inviteCode: string;
  customDomain: string;
  invitationViews: number;
  selectedTheme: string;
  photoCount: number;
  memoryCount: number;
  guestCount: number;
}

export default function WebsiteleriPage() {
  const [websites, setWebsites] = useState<WebsiteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/websites")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setWebsites(data.websites || []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const copyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      toast.success("Davet kodu kopyalandı");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Kopyalanamadı");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-chakra font-semibold text-white uppercase tracking-tight">
          Websiteleri
        </h2>
        <span className="text-sm text-white/40 font-sans">
          {websites.length} website
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : websites.length === 0 ? (
        <p className="text-center text-white/40 font-sans py-12">
          Henüz website bulunamadı.
        </p>
      ) : (
        <div className="space-y-2">
          {websites.map((site) => (
            <div
              key={site._id}
              className="bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.06] transition-colors group"
            >
              <Link
                href={`/clodron/websiteleri/${site._id}`}
                className="flex items-center justify-between p-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-white font-sans truncate">
                      {site.bride.firstName} & {site.groom.firstName}
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/50 font-sans capitalize shrink-0">
                      {site.selectedTheme}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-white/40 font-sans">
                      {new Date(site.weddingDate).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    {site.customDomain && (
                      <span className="text-xs text-white/30 font-sans">
                        {site.customDomain}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex items-center gap-1 text-xs px-2 py-1 rounded-full font-sans",
                        "bg-blue-500/10 text-blue-300"
                      )}
                    >
                      <ImageIcon className="w-3 h-3" />
                      {site.photoCount}
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-1 text-xs px-2 py-1 rounded-full font-sans",
                        "bg-purple-500/10 text-purple-300"
                      )}
                    >
                      <BookOpen className="w-3 h-3" />
                      {site.memoryCount}
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-1 text-xs px-2 py-1 rounded-full font-sans",
                        "bg-emerald-500/10 text-emerald-300"
                      )}
                    >
                      <Users className="w-3 h-3" />
                      {site.guestCount}
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-1 text-xs px-2 py-1 rounded-full font-sans",
                        "bg-amber-500/10 text-amber-300"
                      )}
                    >
                      <Eye className="w-3 h-3" />
                      {site.invitationViews}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                </div>
              </Link>

              <div className="flex items-center gap-2 px-4 pb-3 -mt-1">
                <span className="text-xs text-white/30 font-sans font-mono">
                  {site.inviteCode || "—"}
                </span>
                {site.inviteCode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyCode(site.inviteCode, site._id);
                    }}
                    className="text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                  >
                    {copiedId === site._id ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
                <a
                  href="/lavanta"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="ml-auto flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Önizle
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
