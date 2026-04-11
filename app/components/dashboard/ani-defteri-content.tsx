"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  MessageCircle,
  Send,
  MoreHorizontal,
  Check,
  Trash2,
  BookHeart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const entries = [
  { id: "1", name: "Elif Yıldız", date: "2 saat önce", message: "Mutluluğunuz daim olsun! Düğününüzü sabırsızlıkla bekliyoruz. 💕" },
  { id: "2", name: "Burak Özdemir", date: "5 saat önce", message: "Harika bir çift olacaksınız, iyi ki varsınız!" },
  { id: "3", name: "Zeynep Aksoy", date: "1 gün önce", message: "Düğün davetiyeniz çok güzelmiş, tebrikler! Sizlerle birlikte olmayı çok istiyoruz." },
  { id: "4", name: "Ahmet Kara", date: "1 gün önce", message: "Ömür boyu mutluluklar diliyoruz, sevgiyle kalın." },
  { id: "5", name: "Selin Demir", date: "2 gün önce", message: "En güzel günleriniz başlıyor, çok heyecanlıyız! Ömür boyu mutluluklar." },
  { id: "6", name: "Can Yılmaz", date: "3 gün önce", message: "Güzel ailenize sağlık mutluluk diliyorum. Düğünde görüşmek üzere!" },
  { id: "7", name: "Merve Çelik", date: "4 gün önce", message: "Düğününüze katılmaktan onur duyacağız! Her şey çok güzel olacak." },
  { id: "8", name: "Emre Güneş", date: "5 gün önce", message: "İkinize de ömür boyu sağlık ve mutluluk diliyorum. Güzel bir aile olacaksınız." },
];

export function AniDefteriContent({ isDemo }: { isDemo?: boolean }) {
  const t = useTranslations("Dashboard");
  const [showForm, setShowForm] = useState(false);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("");

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookHeart className="size-5 text-muted-foreground" />
          <h1 className="text-xl font-semibold tracking-tight">{t("memoryBook")}</h1>
          <Badge variant="secondary">{t("messagesCount", { count: entries.length })}</Badge>
        </div>
        <Button
          disabled={isDemo}
          onClick={() => setShowForm(!showForm)}
          className="gap-2 bg-white text-black hover:bg-white/90 rounded-xl"
        >
          <MessageCircle className="size-4" />
          <span className="hidden sm:inline">{t("addMessage")}</span>
        </Button>
      </div>

      {showForm && !isDemo && (
        <div className="bg-card rounded-xl border p-5 space-y-3">
          <textarea
            rows={3}
            placeholder={t("writeMessage")}
            className="w-full rounded-xl border border-border/50 bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/50 resize-none"
          />
          <div className="flex items-center justify-end">
            <Button size="sm" className="gap-1.5 rounded-lg bg-white text-black hover:bg-white/90">
              <Send className="size-4" />
              {t("send")}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-card rounded-xl border p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(entry.name)}`}
                    alt={entry.name}
                  />
                  <AvatarFallback>{getInitials(entry.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.date}</p>
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
                    <DropdownMenuItem>
                      <Check className="size-4" />
                      <span>{t("approve")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="size-4" />
                      <span>{t("delete")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <p className="text-sm leading-relaxed mt-3 text-muted-foreground">{entry.message}</p>
          </div>
        ))}
      </div>
    </>
  );
}
