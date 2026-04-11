"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Heart, Trash2, Upload, LayoutGrid, List, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const photos = [
  { id: "1", name: "Gelin Buketi", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", uploader: "Fotoğrafçı", date: "10 Nis 2026", size: "2.4 MB", liked: true },
  { id: "2", name: "Masa Düzeni", url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80", uploader: "Fotoğrafçı", date: "10 Nis 2026", size: "3.1 MB", liked: false },
  { id: "3", name: "Yüzükler", url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80", uploader: "Elif Yıldız", date: "9 Nis 2026", size: "1.8 MB", liked: true },
  { id: "4", name: "Dekorasyon", url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80", uploader: "Fotoğrafçı", date: "9 Nis 2026", size: "4.2 MB", liked: false },
  { id: "5", name: "Tören Alanı", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", uploader: "Ahmet Kara", date: "8 Nis 2026", size: "2.9 MB", liked: false },
  { id: "6", name: "Pasta Kesimi", url: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&q=80", uploader: "Fotoğrafçı", date: "8 Nis 2026", size: "3.5 MB", liked: true },
  { id: "7", name: "İlk Dans", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80", uploader: "Selin Demir", date: "7 Nis 2026", size: "2.1 MB", liked: false },
  { id: "8", name: "Gün Batımı", url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80", uploader: "Fotoğrafçı", date: "7 Nis 2026", size: "5.0 MB", liked: true },
  { id: "9", name: "Davet Kartı", url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80", uploader: "Merve Çelik", date: "6 Nis 2026", size: "1.5 MB", liked: false },
  { id: "10", name: "Çiçek Aranjman", url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80", uploader: "Fotoğrafçı", date: "6 Nis 2026", size: "2.7 MB", liked: false },
  { id: "11", name: "Nikah Anı", url: "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=800&q=80", uploader: "Burak Özdemir", date: "5 Nis 2026", size: "3.3 MB", liked: true },
  { id: "12", name: "Aile Fotoğrafı", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80", uploader: "Fotoğrafçı", date: "5 Nis 2026", size: "4.8 MB", liked: false },
];

export function GaleriContent({ isDemo }: { isDemo?: boolean }) {
  const t = useTranslations("Dashboard");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(
    new Set(photos.filter((p) => p.liked).map((p) => p.id))
  );

  const toggleLike = (id: string) => {
    setLikedPhotos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ImageIcon className="size-5 text-muted-foreground" />
          <h1 className="text-xl font-semibold tracking-tight">{t("gallery")}</h1>
          <Badge variant="secondary">{photos.length} {t("totalPhotos", { count: photos.length }).split(" ").slice(1).join(" ")}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${viewMode === "list" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="size-4" />
            </button>
          </div>
          <Button
            disabled={isDemo}
            className="gap-2 bg-white text-black hover:bg-white/90 rounded-xl"
          >
            <Upload className="size-4" />
            <span className="hidden sm:inline">{t("uploadPhoto")}</span>
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="rounded-xl border bg-card overflow-hidden group hover:ring-2 hover:ring-ring/20 transition-all"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src={photo.url}
                  alt={photo.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <button
                  onClick={() => toggleLike(photo.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart
                    className={`size-4 ${likedPhotos.has(photo.id) ? "fill-red-500 text-red-500" : "text-white"}`}
                  />
                </button>
                {!isDemo && (
                  <button className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="size-4 text-white" />
                  </button>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{photo.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {photo.uploader} · {photo.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border bg-card divide-y">
          <div className="hidden sm:grid grid-cols-[1fr_120px_100px_80px_70px] gap-4 px-4 py-2.5 text-xs text-muted-foreground font-medium uppercase tracking-wider">
            <span>{t("photoName")}</span>
            <span>{t("uploadedBy")}</span>
            <span>{t("date")}</span>
            <span>{t("size")}</span>
            <span />
          </div>
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_120px_100px_80px_70px] gap-4 px-4 py-3 items-center group hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-12 rounded-lg overflow-hidden relative shrink-0">
                  <Image
                    src={photo.url}
                    alt={photo.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{photo.name}</p>
                  <p className="text-xs text-muted-foreground sm:hidden">
                    {photo.uploader} · {photo.date} · {photo.size}
                  </p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground hidden sm:block truncate">{photo.uploader}</span>
              <span className="text-sm text-muted-foreground hidden sm:block">{photo.date}</span>
              <span className="text-sm text-muted-foreground hidden sm:block">{photo.size}</span>
              <div className="flex items-center gap-1 justify-end">
                <button
                  onClick={() => toggleLike(photo.id)}
                  className="p-1.5 rounded-md hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Heart
                    className={`size-4 ${likedPhotos.has(photo.id) ? "fill-red-500 text-red-500 opacity-100" : "text-muted-foreground"}`}
                  />
                </button>
                {!isDemo && (
                  <button className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="size-4 text-destructive" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground text-center">
        {t("totalPhotos", { count: photos.length })}
      </p>
    </>
  );
}
