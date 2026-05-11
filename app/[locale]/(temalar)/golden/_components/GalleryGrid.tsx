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
import { UserIcon } from "../_icons/UserIcon";

interface Photo {
  _id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  uploader: string;
  createdAt: string;
}


const TARGET_BYTES = 4 * 1024 * 1024;
const COMPRESS_STEPS: Array<{ maxDim: number; quality: number }> = [
  { maxDim: 1920, quality: 0.85 },
  { maxDim: 1600, quality: 0.8 },
  { maxDim: 1280, quality: 0.75 },
  { maxDim: 1024, quality: 0.7 },
  { maxDim: 800, quality: 0.65 },
];

function reportToServer(inviteCode: string, payload: Record<string, unknown>) {
  try {
    const body = JSON.stringify({ ts: new Date().toISOString(), ...payload });
    fetch(`/api/public/rsvp/${inviteCode}/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // best effort
  }
}

async function compressOnce(
  source: File | Blob,
  baseName: string,
  maxDim: number,
  quality: number
): Promise<File> {
  const bitmap = await createImageBitmap(source, {
    imageOrientation: "from-image",
  });
  let { width, height } = bitmap;
  if (width > maxDim || height > maxDim) {
    const ratio = Math.min(maxDim / width, maxDim / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("canvas-unavailable");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality)
  );
  if (!blob) throw new Error("encode-failed");
  return new File([blob], `${baseName}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

type StepFailure = { maxDim: number; error: string };

async function prepareForUpload(
  file: File,
  stepFailures: StepFailure[]
): Promise<{ file: File; hitTarget: boolean }> {
  const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
  let best: File | null = null;
  for (const step of COMPRESS_STEPS) {
    try {
      const compressed = await compressOnce(file, baseName, step.maxDim, step.quality);
      if (compressed.size <= TARGET_BYTES) return { file: compressed, hitTarget: true };
      if (!best || compressed.size < best.size) best = compressed;
    } catch (err) {
      stepFailures.push({
        maxDim: step.maxDim,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
  if (best) return { file: best, hitTarget: false };
  return { file, hitTarget: false };
}

type AttemptInfo = {
  try: number;
  status?: number;
  body?: string;
  error?: string;
  sizeMB: number;
};

async function uploadWithRetry(
  url: string,
  initialFile: File,
  uploader: string,
  attempts: AttemptInfo[],
  maxAttempts = 3
): Promise<boolean> {
  let current = initialFile;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const attemptInfo: AttemptInfo = {
      try: attempt + 1,
      sizeMB: +(current.size / 1024 / 1024).toFixed(2),
    };
    try {
      const formData = new FormData();
      formData.append("file", current);
      formData.append("uploader", uploader);
      const res = await fetch(url, { method: "POST", body: formData });
      if (res.ok) return true;
      attemptInfo.status = res.status;
      attemptInfo.body = (await res.text().catch(() => "")).slice(0, 200);
      attempts.push(attemptInfo);
      if (res.status === 413 || res.status === 502) {
        try {
          const baseName = current.name.replace(/\.[^.]+$/, "") || "photo";
          current = await compressOnce(current, baseName, 1024, 0.65);
        } catch {
          // can't shrink further
        }
      } else if (res.status >= 400 && res.status < 500) {
        return false;
      }
    } catch (err) {
      attemptInfo.error = err instanceof Error ? err.message : String(err);
      attempts.push(attemptInfo);
    }
    if (attempt < maxAttempts - 1) {
      await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
    }
  }
  return false;
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

    setIsUploading(true);
    setUploadProgress({ current: 0, total: fileArray.length });

    const uploader = uploaderName.trim();
    const inviteCode = wedding.inviteCode;
    const url = `/api/public/rsvp/${inviteCode}/gallery`;
    const queue = [...fileArray];
    let completed = 0;
    let successCount = 0;
    let failCount = 0;
    const failures: Record<string, unknown>[] = [];

    const startedAt = performance.now();

    const worker = async () => {
      while (queue.length > 0) {
        const file = queue.shift();
        if (!file) break;

        const stepFailures: StepFailure[] = [];
        const originalInfo = {
          name: file.name,
          type: file.type || "unknown",
          sizeMB: +(file.size / 1024 / 1024).toFixed(2),
        };

        let prepared: File;
        let hitTarget = false;
        let prepareThrew: string | undefined;
        try {
          const result = await prepareForUpload(file, stepFailures);
          prepared = result.file;
          hitTarget = result.hitTarget;
        } catch (err) {
          prepareThrew = err instanceof Error ? err.message : String(err);
          prepared = file;
        }

        const attempts: AttemptInfo[] = [];
        const ok = await uploadWithRetry(url, prepared, uploader, attempts);

        if (ok) {
          successCount++;
        } else {
          failCount++;
          failures.push({
            file: originalInfo,
            prepared: {
              sizeMB: +(prepared.size / 1024 / 1024).toFixed(2),
              hitTarget,
              prepareThrew,
              stepFailures,
            },
            attempts,
          });
        }
        completed++;
        setUploadProgress({ current: completed, total: fileArray.length });
      }
    };

    const concurrency = Math.min(3, fileArray.length);
    await Promise.all(Array.from({ length: concurrency }, () => worker()));

    const elapsedMs = Math.round(performance.now() - startedAt);

    if (failCount > 0) {
      reportToServer(inviteCode, {
        kind: "batch-failure",
        uploader,
        total: fileArray.length,
        successCount,
        failCount,
        elapsedMs,
        failures,
      });
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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="relative flex-1">
                <UserIcon
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c1666b]/55"
                />
                <input
                  type="text"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  placeholder={t("galleryUploadNamePlaceholder")}
                  aria-label={t("galleryUploadNamePlaceholder")}
                  className="w-full h-11 rounded-xl border border-[#c1666b]/25 bg-white pl-9 pr-4 text-base sm:text-sm text-[#4a403a] placeholder:text-[#4a403a]/40 focus:border-[#c1666b] focus:outline-none focus:ring-2 focus:ring-[#c1666b]/20 transition-all font-sans"
                />
              </div>

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
                  "h-11 px-5 rounded-xl font-sans text-xs font-bold tracking-[0.12em] uppercase flex items-center justify-center gap-2 transition-all shrink-0",
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
