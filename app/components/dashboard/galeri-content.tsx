"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Heart, Trash2, Upload, LayoutGrid, List, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Photo {
  _id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  publicId: string;
  uploader: string;
  size: number;
  liked: boolean;
  createdAt: string;
}

const demoPhotos: Photo[] = [
  { _id: "1", name: "Gelin Buketi", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", thumbnailUrl: "", publicId: "", uploader: "Fotoğrafçı", size: 2400000, liked: true, createdAt: "2026-04-10" },
  { _id: "2", name: "Masa Düzeni", url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80", thumbnailUrl: "", publicId: "", uploader: "Fotoğrafçı", size: 3100000, liked: false, createdAt: "2026-04-10" },
  { _id: "3", name: "Yüzükler", url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80", thumbnailUrl: "", publicId: "", uploader: "Elif Yıldız", size: 1800000, liked: true, createdAt: "2026-04-09" },
  { _id: "4", name: "Dekorasyon", url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80", thumbnailUrl: "", publicId: "", uploader: "Fotoğrafçı", size: 4200000, liked: false, createdAt: "2026-04-09" },
];

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

export function GaleriContent({ isDemo }: { isDemo?: boolean }) {
  const t = useTranslations("Dashboard");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [photos, setPhotos] = useState<Photo[]>(isDemo ? demoPhotos : []);
  const [loading, setLoading] = useState(!isDemo);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isDemo) return;
    fetch("/api/dashboard/gallery")
      .then((r) => r.json())
      .then((data) => setPhotos(data.photos || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isDemo]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name.replace(/\.[^.]+$/, ""));
    try {
      const res = await fetch("/api/dashboard/gallery", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPhotos((prev) => [data.photo, ...prev]);
      toast.success(t("uploadSuccess"));
    } catch {
      toast.error(t("uploadError"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPhotos((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error(t("deleteError"));
    }
  };

  const handleLike = async (id: string) => {
    if (isDemo) {
      setPhotos((prev) => prev.map((p) => p._id === id ? { ...p, liked: !p.liked } : p));
      return;
    }
    try {
      const res = await fetch(`/api/dashboard/gallery/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPhotos((prev) => prev.map((p) => p._id === id ? data.photo : p));
    } catch {}
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
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ImageIcon className="size-5 text-muted-foreground" />
          <h1 className="text-xl font-semibold tracking-tight">{t("gallery")}</h1>
          <Badge variant="secondary">{t("totalPhotos", { count: photos.length })}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <LayoutGrid className="size-4" />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-2 transition-colors ${viewMode === "list" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <List className="size-4" />
            </button>
          </div>
          <Button disabled={isDemo || uploading} onClick={() => fileInputRef.current?.click()} className="gap-2 bg-white text-black hover:bg-white/90 rounded-xl">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            <span className="hidden sm:inline">{t("uploadPhoto")}</span>
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{t("galleryDescription")}</p>

      {photos.length === 0 ? (
        <div className="text-center py-20">
          <ImageIcon className="size-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">{t("noPhotos")}</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div key={photo._id} className="rounded-xl border bg-card overflow-hidden group hover:ring-2 hover:ring-ring/20 transition-all">
              <div className="aspect-[4/3] relative">
                <Image src={photo.thumbnailUrl || photo.url} alt={photo.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <button onClick={() => handleLike(photo._id)} className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className={`size-4 ${photo.liked ? "fill-red-500 text-red-500" : "text-white"}`} />
                </button>
                {!isDemo && (
                  <button onClick={() => handleDelete(photo._id)} className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="size-4 text-white" />
                  </button>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{photo.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{photo.uploader} · {formatDate(photo.createdAt)}</p>
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
            <div key={photo._id} className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_120px_100px_80px_70px] gap-4 px-4 py-3 items-center group hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-12 rounded-lg overflow-hidden relative shrink-0">
                  <Image src={photo.thumbnailUrl || photo.url} alt={photo.name} fill className="object-cover" sizes="48px" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{photo.name}</p>
                  <p className="text-xs text-muted-foreground sm:hidden">{photo.uploader} · {formatDate(photo.createdAt)} · {formatSize(photo.size)}</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground hidden sm:block truncate">{photo.uploader}</span>
              <span className="text-sm text-muted-foreground hidden sm:block">{formatDate(photo.createdAt)}</span>
              <span className="text-sm text-muted-foreground hidden sm:block">{formatSize(photo.size)}</span>
              <div className="flex items-center gap-1 justify-end">
                <button onClick={() => handleLike(photo._id)} className="p-1.5 rounded-md hover:bg-accent transition-colors opacity-0 group-hover:opacity-100">
                  <Heart className={`size-4 ${photo.liked ? "fill-red-500 text-red-500 opacity-100" : "text-muted-foreground"}`} />
                </button>
                {!isDemo && (
                  <button onClick={() => handleDelete(photo._id)} className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="size-4 text-destructive" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
