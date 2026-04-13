"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { ScrollReveal } from "./ScrollReveal";
import { OrnamentalDivider } from "./OrnamentalDivider";

interface Photo {
  _id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  uploader: string;
  createdAt: string;
}

export function GalleryGrid() {
  const wedding = useWedding();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploaderName, setUploaderName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/public/rsvp/${wedding.inviteCode}/gallery`
      );
      if (!res.ok) return;
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, [wedding.inviteCode]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!uploaderName.trim()) {
      toast.error("Lütfen adınızı girin.");
      return;
    }

    const fileArray = Array.from(files).slice(0, 25);

    const oversized = fileArray.filter((f) => f.size > 10 * 1024 * 1024);
    if (oversized.length > 0) {
      toast.error(`${oversized.length} dosya 10MB sınırını aşıyor.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress({ current: 0, total: fileArray.length });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < fileArray.length; i++) {
      setUploadProgress({ current: i + 1, total: fileArray.length });
      try {
        const formData = new FormData();
        formData.append("file", fileArray[i]);
        formData.append("uploader", uploaderName.trim());

        const res = await fetch(
          `/api/public/rsvp/${wedding.inviteCode}/gallery`,
          { method: "POST", body: formData }
        );

        if (!res.ok) throw new Error();
        successCount++;
      } catch {
        failCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} fotoğraf başarıyla yüklendi!`);
      await fetchPhotos();
    }
    if (failCount > 0) {
      toast.error(`${failCount} fotoğraf yüklenemedi.`);
    }

    setIsUploading(false);
    setUploadProgress({ current: 0, total: 0 });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 text-[#d5d1ad]/50 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <ScrollReveal className="text-center">
        <OrnamentalDivider className="mb-6" />
        <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#d5d1ad]/50 mb-3">
          Galeri
        </p>
        <h1 className="font-merienda text-3xl md:text-4xl text-[#d5d1ad]">
          {brideFirst} & {groomFirst}
        </h1>
      </ScrollReveal>

      {/* Upload — compact inline */}
      {wedding.hasGallery && (
        <ScrollReveal className="max-w-xl mx-auto">
          <div className="liquid-glass rounded-2xl border border-white/15 p-5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                placeholder="Adınız Soyadınız"
                className="flex-1 h-10 rounded-lg border border-white/15 bg-white/5 px-3 text-sm text-white placeholder:text-white/45 focus:border-[#d5d1ad]/50 focus:outline-none transition-all font-sans"
              />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => {
                  if (!uploaderName.trim()) {
                    toast.error("Lütfen önce adınızı girin.");
                    return;
                  }
                  fileInputRef.current?.click();
                }}
                disabled={isUploading}
                className={cn(
                  "h-10 px-5 rounded-lg font-sans text-xs font-medium tracking-wide flex items-center justify-center gap-2 transition-all shrink-0",
                  isUploading
                    ? "bg-[#d5d1ad]/20 text-[#d5d1ad]/50 cursor-not-allowed"
                    : "bg-[#d5d1ad] text-[#252224] hover:bg-[#d5d1ad]/90 cursor-pointer"
                )}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    {uploadProgress.current}/{uploadProgress.total} yükleniyor...
                  </>
                ) : (
                  <>
                    <Upload className="size-3.5" />
                    Fotoğraf Yükle
                  </>
                )}
              </button>
            </div>
            <p className="font-sans text-[10px] text-white/35 mt-2.5">
              Tek seferde en fazla 25 fotoğraf · Maks. 10MB · JPG, PNG
            </p>
          </div>
        </ScrollReveal>
      )}

      {/* Photo Grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-2 sm:gap-3">
          {photos.map((photo, index) => (
            <motion.div
              key={photo._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border border-white/15 bg-white/5"
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={photo.thumbnailUrl || photo.url}
                alt={photo.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1536px) 16vw, 12vw"
              />
              {/* Always-visible uploader name */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent pt-6 pb-2.5 px-3">
                <p className="font-sans text-[11px] text-white/80 truncate">
                  {photo.uploader}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <ScrollReveal>
          <div className="text-center py-16 space-y-3">
            <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/15 flex items-center justify-center mx-auto mb-4">
              <ImagePlus className="size-6 text-white/20" />
            </div>
            <p className="font-sans text-sm text-white/45">
              Henüz fotoğraf yüklenmedi
            </p>
            <p className="font-sans text-xs text-white/30">
              İlk fotoğrafı yükleyen siz olun!
            </p>
          </div>
        </ScrollReveal>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-colors z-10"
            >
              <X className="size-5" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[80vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.name}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>

            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="font-sans text-sm text-white/70">
                {selectedPhoto.uploader}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
