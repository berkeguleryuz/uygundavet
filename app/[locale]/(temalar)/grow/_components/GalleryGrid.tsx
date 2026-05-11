"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, ImagePlus, X, User } from "lucide-react";
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
      <ScrollReveal className="text-center">
        <OrnamentalDivider className="mb-6" />
        <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#d5d1ad]/50 mb-3">
          Galeri
        </p>
        <h1 className="font-merienda text-3xl md:text-4xl text-[#d5d1ad]">
          {brideFirst} & {groomFirst}
        </h1>
      </ScrollReveal>

      {wedding.hasGallery && (
        <ScrollReveal className="max-w-xl mx-auto">
          <div className="liquid-glass rounded-2xl border border-white/15 p-5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="relative flex-1">
                <User
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d5d1ad]/70"
                  strokeWidth={1.6}
                />
                <input
                  type="text"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  placeholder="Adınız Soyadınız"
                  aria-label="Adınız Soyadınız"
                  className="w-full h-11 rounded-lg border border-white/15 bg-white/5 pl-9 pr-3 text-base sm:text-sm text-white placeholder:text-white/50 focus:border-[#d5d1ad]/50 focus:outline-none transition-all font-sans"
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
                    toast.error("Lütfen önce adınızı girin.");
                    return;
                  }
                  fileInputRef.current?.click();
                }}
                disabled={isUploading}
                className={cn(
                  "h-11 px-5 rounded-lg font-sans text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shrink-0",
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
