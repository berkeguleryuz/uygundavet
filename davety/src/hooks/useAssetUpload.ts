"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import type { MediaRef } from "@davety/schema";

interface UploadResult {
  id: string;
  url: string;
  key: string;
  width?: number | null;
  height?: number | null;
  mediaType: "image" | "video" | "audio";
  variants?: Partial<Record<"thumb" | "md" | "lg" | "original", string>>;
}

async function uploadOne(
  file: File,
  designId: string | null
): Promise<MediaRef | null> {
  const fd = new FormData();
  fd.append("file", file);
  if (designId) fd.append("designId", designId);
  const res = await fetch("/api/design/assets/upload", {
    method: "POST",
    body: fd,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    toast.error(body.error ?? "Yüklenemedi");
    return null;
  }
  const data = (await res.json()) as UploadResult;
  return {
    url: data.url,
    key: data.key,
    width: data.width ?? undefined,
    height: data.height ?? undefined,
    mediaType: data.mediaType,
    variants: data.variants,
  };
}

export function useAssetUpload(designId: string | null) {
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement | null>(null);

  const pick = useCallback(
    async (accept = "image/*,video/*"): Promise<MediaRef | null> => {
      if (!input.current) {
        const el = document.createElement("input");
        el.type = "file";
        el.accept = accept;
        input.current = el;
      }
      input.current.accept = accept;
      input.current.multiple = false;

      return new Promise((resolve) => {
        const onChange = async () => {
          const file = input.current!.files?.[0];
          input.current!.value = "";
          if (!file) {
            resolve(null);
            return;
          }
          setBusy(true);
          try {
            resolve(await uploadOne(file, designId));
          } finally {
            setBusy(false);
          }
        };
        input.current!.addEventListener("change", onChange, { once: true });
        input.current!.click();
      });
    },
    [designId]
  );

  /**
   * Multi-select variant. Opens the OS file picker with multiple-mode
   * enabled and uploads each selected file in parallel. Returns only the
   * successful uploads, failed ones are skipped (per-file toast already
   * fired). Useful for gallery where users want to add 5–10 photos at
   * once instead of clicking the upload button every time.
   */
  const pickMany = useCallback(
    async (
      accept = "image/*,video/*",
      max?: number
    ): Promise<MediaRef[]> => {
      if (!input.current) {
        const el = document.createElement("input");
        el.type = "file";
        el.accept = accept;
        input.current = el;
      }
      input.current.accept = accept;
      input.current.multiple = true;

      return new Promise((resolve) => {
        const onChange = async () => {
          const list = Array.from(input.current!.files ?? []);
          input.current!.value = "";
          if (list.length === 0) {
            resolve([]);
            return;
          }
          const files = typeof max === "number" ? list.slice(0, max) : list;
          if (typeof max === "number" && list.length > max) {
            toast.warning(
              `Sadece ilk ${max} dosya yüklendi (paket sınırı).`
            );
          }
          setBusy(true);
          try {
            const results = await Promise.all(
              files.map((f) => uploadOne(f, designId))
            );
            resolve(results.filter((r): r is MediaRef => r !== null));
          } finally {
            setBusy(false);
          }
        };
        input.current!.addEventListener("change", onChange, { once: true });
        input.current!.click();
      });
    },
    [designId]
  );

  return { pick, pickMany, busy };
}
