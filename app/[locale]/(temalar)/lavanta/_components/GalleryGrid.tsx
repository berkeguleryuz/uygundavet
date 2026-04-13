"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { ScrollReveal } from "./ScrollReveal";

interface Photo {
  _id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  uploader: string;
  createdAt: string;
}

const inputClass =
  "w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/20 focus:border-[#d5d1ad]/50 focus:outline-none transition-all font-sans";

export function GalleryGrid() {
  const wedding = useWedding();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploaderName, setUploaderName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
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
      // silently fail on fetch
    } finally {
      setIsLoading(false);
    }
  }, [wedding.inviteCode]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!uploaderName.trim()) {
      toast.error("Lütfen adınızı girin.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Dosya boyutu 10MB'dan küçük olmalıdır.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploader", uploaderName.trim());

      const res = await fetch(
        `/api/public/rsvp/${wedding.inviteCode}/gallery`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Yükleme başarısız");
      }

      toast.success("Fotoğraf başarıyla yüklendi!");
      await fetchPhotos();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Yükleme sırasında hata oluştu."
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
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
      {/* Upload Section */}
      {wedding.hasGallery && (
        <ScrollReveal>
          <div className="bg-[#1c1a1b] rounded-2xl border border-white/10 p-6 space-y-4">
            <h3 className="font-chakra text-xs uppercase tracking-wider text-[#d5d1ad]">
              Fotoğraf Yükle
            </h3>

            <input
              type="text"
              value={uploaderName}
              onChange={(e) => setUploaderName(e.target.value)}
              placeholder="Adınızı girin"
              className={inputClass}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
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
                "w-full h-32 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-2 transition-all",
                isUploading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-[#d5d1ad]/30 hover:bg-white/[0.04] cursor-pointer"
              )}
            >
              {isUploading ? (
                <>
                  <Loader2 className="size-6 text-[#d5d1ad]/50 animate-spin" />
                  <span className="font-sans text-xs text-white/30">
                    Yükleniyor...
                  </span>
                </>
              ) : (
                <>
                  <Upload className="size-6 text-white/20" />
                  <span className="font-sans text-xs text-white/30">
                    Fotoğraf seçmek için tıklayın
                  </span>
                  <span className="font-sans text-[10px] text-white/15">
                    Maks. 10MB
                  </span>
                </>
              )}
            </button>
          </div>
        </ScrollReveal>
      )}

      {/* Photo Grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo, index) => (
            <motion.div
              key={photo._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-white/5"
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={photo.thumbnailUrl || photo.url}
                alt={photo.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-sans text-xs text-white/80 truncate">
                  {photo.uploader}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <ScrollReveal>
          <div className="text-center py-16 space-y-3">
            <ImagePlus className="size-10 text-white/10 mx-auto" />
            <p className="font-sans text-sm text-white/30">
              Henüz fotoğraf yüklenmedi
            </p>
            <p className="font-sans text-xs text-white/15">
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
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors z-10"
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
              <p className="font-sans text-sm text-white/60">
                {selectedPhoto.uploader}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
