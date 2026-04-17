"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { CameraIcon } from "../_icons/CameraIcon";
import { CloseIcon } from "../_icons/CloseIcon";
import { SunIcon } from "../_icons/SunIcon";

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

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploaderName, setUploaderName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch(`/api/public/rsvp/${wedding.inviteCode}/gallery`);
      if (!res.ok) return;
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch {
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
      toast.error(t("memoryNameRequired"));
      return;
    }

    const fileArray = Array.from(files).slice(0, 25);
    const oversized = fileArray.filter((f) => f.size > 10 * 1024 * 1024);
    if (oversized.length > 0) {
      toast.error(`${oversized.length} dosya 10MB sinirini asiyor.`);
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

        const res = await fetch(`/api/public/rsvp/${wedding.inviteCode}/gallery`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error();
        successCount++;
      } catch {
        failCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} ${t("galleryUploadSuccess")}`);
      await fetchPhotos();
    }
    if (failCount > 0) {
      toast.error(`${failCount} ${t("galleryUploadError")}`);
    }

    setIsUploading(false);
    setUploadProgress({ current: 0, total: 0 });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#c1666b]/30 border-t-[#c1666b] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 mb-3">
          <div className="h-px w-10 bg-[#c1666b]/50" />
          <SunIcon size={16} className="text-[#f4a900]" />
          <div className="h-px w-10 bg-[#c1666b]/50" />
        </div>
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#c1666b] mb-3 font-bold">
          {t("galleryLabel")}
        </p>
        <h1 className="font-merienda text-3xl md:text-4xl text-[#4a403a]">
          {t("galleryHeading")}
        </h1>
      </motion.div>

      {wedding.hasGallery && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-lg mx-auto"
        >
          <div className="bg-[#faf5ec] rounded-[1.25rem] border border-[#c1666b]/25 shadow-sm p-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                placeholder={t("galleryUploadNamePlaceholder")}
                aria-label={t("galleryUploadNamePlaceholder")}
                className="flex-1 h-10 rounded-xl border border-[#c1666b]/25 bg-white px-4 text-sm text-[#4a403a] placeholder:text-[#4a403a]/35 focus:border-[#c1666b] focus:outline-none focus:ring-2 focus:ring-[#c1666b]/20 transition-all font-sans"
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
                    toast.error(t("memoryNameRequired"));
                    return;
                  }
                  fileInputRef.current?.click();
                }}
                disabled={isUploading}
                className={cn(
                  "h-10 px-5 rounded-xl font-sans text-xs font-bold tracking-[0.12em] uppercase flex items-center justify-center gap-2 transition-all shrink-0",
                  isUploading
                    ? "bg-[#c1666b]/20 text-[#c1666b]/50 cursor-not-allowed"
                    : "bg-[#4a403a] text-[#faf5ec] hover:bg-[#c1666b] cursor-pointer"
                )}
              >
                {isUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#c1666b]/30 border-t-[#c1666b] rounded-full animate-spin" />
                    {uploadProgress.current}/{uploadProgress.total} {t("galleryUploading")}
                  </>
                ) : (
                  <>
                    <CameraIcon size={14} />
                    {t("galleryUploadHeading")}
                  </>
                )}
              </button>
            </div>
            <p className="font-sans text-[10px] text-[#4a403a]/40 mt-2 text-center">
              {t("galleryUploadInfo")}
            </p>
          </div>
        </motion.div>
      )}

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-2">
          {photos.map((photo, index) => (
            <motion.div
              key={photo._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-[1rem] cursor-pointer bg-[#d4b896]/30 hover:shadow-[0_12px_30px_-12px_rgba(74,64,58,0.4)] transition-shadow duration-300 border-2 border-[#faf5ec]"
              style={{ contentVisibility: "auto" }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={photo.thumbnailUrl || photo.url}
                alt={photo.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1536px) 16vw, 12vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2d2620]/70 to-transparent pt-6 pb-2 px-2.5">
                <p className="font-sans text-[10px] text-[#faf5ec]/90 truncate">
                  {photo.uploader}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center py-16 space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#c1666b]/10 border border-[#c1666b]/30 flex items-center justify-center mx-auto mb-4">
              <CameraIcon size={24} className="text-[#c1666b]/60" />
            </div>
            <p className="font-sans text-sm text-[#4a403a]/60">
              {t("galleryEmpty")}
            </p>
            <p className="font-sans text-xs text-[#4a403a]/40">
              {t("galleryEmptySubtitle")}
            </p>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#2d2620]/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              aria-label="Kapat"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#f4a900]/20 border border-[#f4a900]/40 flex items-center justify-center text-[#faf5ec]/85 hover:text-[#f4a900] transition-colors z-10"
            >
              <CloseIcon size={20} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[80vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={selectedPhoto.url} alt={selectedPhoto.name} fill className="object-contain" sizes="100vw" />
            </motion.div>

            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="font-sans text-sm text-[#faf5ec]/75">{selectedPhoto.uploader}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
