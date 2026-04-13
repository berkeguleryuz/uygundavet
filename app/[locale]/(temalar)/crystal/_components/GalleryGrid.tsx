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
      toast.error(t("memoryNameRequired"));
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
        <div className="w-6 h-6 border-2 border-[#b49a7c]/30 border-t-[#b49a7c] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Left-aligned page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-12 h-px bg-[#b49a7c] mb-6" />
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#a09ba6] mb-3">
          {t("galleryLabel")}
        </p>
        <h1 className="font-merienda text-3xl md:text-4xl text-[#1a1a2e]">
          {t("galleryHeading")}
        </h1>
      </motion.div>

      {/* Compact inline upload bar */}
      {wedding.hasGallery && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-lg"
        >
          <div className="bg-white rounded-xl border border-[#1a1a2e]/[0.06] shadow-sm p-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                placeholder={t("galleryUploadNamePlaceholder")}
                className="flex-1 h-10 rounded-lg border border-[#1a1a2e]/10 bg-transparent px-3 text-sm text-[#1a1a2e] placeholder:text-[#a09ba6] focus:border-[#b49a7c] focus:outline-none focus:ring-1 focus:ring-[#b49a7c]/20 transition-all font-sans"
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
                  "h-10 px-5 rounded-lg font-sans text-xs font-medium tracking-wide flex items-center justify-center gap-2 transition-all shrink-0",
                  isUploading
                    ? "bg-[#b49a7c]/20 text-[#b49a7c]/50 cursor-not-allowed"
                    : "bg-[#1a1a2e] text-white hover:bg-[#1a1a2e]/90 cursor-pointer"
                )}
              >
                {isUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#b49a7c]/30 border-t-[#b49a7c] rounded-full animate-spin" />
                    {uploadProgress.current}/{uploadProgress.total} {t("galleryUploading")}
                  </>
                ) : (
                  <>
                    <CameraIcon className="size-3.5" size={14} />
                    {t("galleryUploadHeading")}
                  </>
                )}
              </button>
            </div>
            <p className="font-sans text-[10px] text-[#a09ba6] mt-2">
              {t("galleryUploadInfo")}
            </p>
          </div>
        </motion.div>
      )}

      {/* Photo Grid — tight gap, sharp edges (editorial magazine style) */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-1.5">
          {photos.map((photo, index) => (
            <motion.div
              key={photo._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="group relative aspect-[4/3] overflow-hidden cursor-pointer border border-[#1a1a2e]/[0.04] bg-[#eee9e2]"
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={photo.thumbnailUrl || photo.url}
                alt={photo.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1536px) 16vw, 12vw"
              />
              {/* Uploader name always visible at bottom */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent pt-6 pb-2 px-2.5">
                <p className="font-sans text-[10px] text-white/90 truncate">
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
            <div className="w-14 h-14 rounded-full bg-[#b49a7c]/5 border border-[#b49a7c]/10 flex items-center justify-center mx-auto mb-4">
              <CameraIcon className="size-6 text-[#a09ba6]" size={24} />
            </div>
            <p className="font-sans text-sm text-[#6d6a75]">
              {t("galleryEmpty")}
            </p>
            <p className="font-sans text-xs text-[#a09ba6]">
              {t("galleryEmptySubtitle")}
            </p>
          </div>
        </motion.div>
      )}

      {/* Lightbox — deep ink bg */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#1a1a2e]/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-colors z-10"
            >
              <CloseIcon className="size-5" size={20} />
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
