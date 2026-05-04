"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { ShieldAlert, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ImpersonationBanner() {
  const { data: session } = authClient.useSession();
  const [stopping, setStopping] = useState(false);

  const sess = session?.session as (typeof session extends infer S ? S : never) & {
    impersonatedBy?: string | null;
  };
  const impersonatedBy = (sess as { impersonatedBy?: string | null } | undefined)?.impersonatedBy;
  if (!impersonatedBy) return null;

  const stop = async () => {
    setStopping(true);
    try {
      const res = await fetch("/api/admin/stop-impersonate", { method: "POST" });
      if (res.ok) {
        toast.success("Admin oturumuna dönülüyor...");
        window.location.href = "/clodron/kullanicilar";
      } else {
        toast.error("Çıkış başarısız");
      }
    } finally {
      setStopping(false);
    }
  };

  return (
    <div className="sticky top-0 z-[60] bg-orange-500 text-black px-4 py-2 flex items-center justify-center gap-3 shadow-lg">
      <ShieldAlert className="w-4 h-4" />
      <span className="text-xs sm:text-sm font-sans font-semibold">
        Admin olarak <span className="font-mono">{session?.user?.email}</span> kullanıcısı görüntüleniyor
      </span>
      <button
        onClick={stop}
        disabled={stopping}
        className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-orange-400 hover:bg-black/80 text-xs font-sans font-semibold transition-colors disabled:opacity-50 cursor-pointer"
      >
        {stopping ? <Loader2 className="w-3 h-3 animate-spin" /> : <LogOut className="w-3 h-3" />}
        Admin&apos;e Dön
      </button>
    </div>
  );
}
