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
              resolve(null);
              return;
            }
            const data = (await res.json()) as UploadResult;
            resolve({
              url: data.url,
              key: data.key,
              width: data.width ?? undefined,
              height: data.height ?? undefined,
              mediaType: data.mediaType,
              variants: data.variants,
            });
          } catch {
            toast.error("Yüklenemedi");
            resolve(null);
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

  return { pick, busy };
}
