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
import { LeafIcon } from "../_icons/LeafIcon";

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
        <div className="w-6 h-6 border-2 border-[#4a7c59]/30 border-t-[#4a7c59] rounded-full animate-spin" />
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
        <div className="inline-flex items-center gap-2 mb-3">
          <LeafIcon size={14} className="text-[#4a7c59] rotate-[-20deg]" />
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#4a7c59]">
            {t("galleryLabel")}
          </p>
          <LeafIcon size={14} className="text-[#4a7c59] rotate-[20deg] -scale-x-100" />
        </div>
        <h1 className="font-merienda text-3xl md:text-4xl text-[#2b3628]">
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
          <div className="bg-[#f5f3ed] rounded-[1.5rem] border border-[#4a7c59]/20 shadow-sm p-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                placeholder={t("galleryUploadNamePlaceholder")}
                aria-label={t("galleryUploadNamePlaceholder")}
                className="flex-1 h-10 rounded-2xl border border-[#4a7c59]/20 bg-white px-4 text-sm text-[#2b3628] placeholder:text-[#2b3628]/35 focus:border-[#4a7c59] focus:outline-none focus:ring-2 focus:ring-[#4a7c59]/20 transition-all font-sans"
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
                  "h-10 px-5 rounded-2xl font-sans text-xs font-semibold tracking-[0.1em] uppercase flex items-center justify-center gap-2 transition-all shrink-0",
                  isUploading
                    ? "bg-[#4a7c59]/20 text-[#4a7c59]/50 cursor-not-allowed"
                    : "bg-[#4a7c59] text-[#f5f3ed] hover:bg-[#3a6447] cursor-pointer"
                )}
              >
                {isUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#4a7c59]/30 border-t-[#4a7c59] rounded-full animate-spin" />
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
            <p className="font-sans text-[10px] text-[#2b3628]/35 mt-2 text-center">
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
              className="group relative aspect-[4/3] overflow-hidden rounded-[1.25rem] cursor-pointer bg-[#e9eae1] hover:shadow-[0_10px_30px_-10px_rgba(74,124,89,0.35)] transition-shadow duration-300"
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
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1f2a22]/70 to-transparent pt-6 pb-2 px-2.5">
                <p className="font-sans text-[10px] text-[#f5f3ed]/90 truncate">
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
            <div className="w-14 h-14 rounded-full bg-[#4a7c59]/10 border border-[#4a7c59]/25 flex items-center justify-center mx-auto mb-4">
              <CameraIcon size={24} className="text-[#4a7c59]/60" />
            </div>
            <p className="font-sans text-sm text-[#2b3628]/55">
              {t("galleryEmpty")}
            </p>
            <p className="font-sans text-xs text-[#2b3628]/35">
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
            className="fixed inset-0 z-[100] bg-[#1f2a22]/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              aria-label="Kapat"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#f9a620]/15 border border-[#f9a620]/30 flex items-center justify-center text-[#f5f3ed]/80 hover:text-[#f9a620] transition-colors z-10"
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
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.name}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>

            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="font-sans text-sm text-[#f5f3ed]/75">
                {selectedPhoto.uploader}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
