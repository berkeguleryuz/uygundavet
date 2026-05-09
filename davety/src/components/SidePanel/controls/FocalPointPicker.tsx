"use client";

import { useRef } from "react";
import { RotateCcw } from "lucide-react";

interface Props {
  imageUrl: string;
  focalX: number;
  focalY: number;
  onChange: (x: number, y: number) => void;
}

/**
 * 2B fotoğraf focal point picker. Kullanıcı resim üstünde tıklayıp
 * sürükleyerek "kırpıldığında ne tarafı görünmeli" noktasını seçer.
 * x/y 0-100 yüzde olarak yayılır, render tarafında CSS object-position
 * ile uygulanır.
 *
 * Tasarım: küçük preview (180px yükseklik), tam genişlik. Üstte
 * sürüklenebilir nokta, altta küçük "Sıfırla" butonu (50/50'ye geri).
 */
export function FocalPointPicker({
  imageUrl,
  focalX,
  focalY,
  onChange,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // dragging sadece pointer event handler'larında okunuyor, JSX'e
  // girmiyor; useState her toggle'da tüm component subtree'sini yeniden
  // render ettiriyordu, useRef ile aynı işlev render maliyeti olmadan.
  const draggingRef = useRef(false);

  const updateFromPointer = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    const cx = Math.max(0, Math.min(100, x));
    const cy = Math.max(0, Math.min(100, y));
    onChange(cx, cy);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-[11px] text-muted-foreground">
        Görselin nerede ortalansın? Tıklayıp sürükle.
      </div>
      <div
        ref={ref}
        className="relative w-full overflow-hidden rounded-md border border-border cursor-crosshair select-none"
        style={{ aspectRatio: "4 / 3" }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          draggingRef.current = true;
          updateFromPointer(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (!draggingRef.current) return;
          updateFromPointer(e.clientX, e.clientY);
        }}
        onPointerUp={(e) => {
          e.currentTarget.releasePointerCapture(e.pointerId);
          draggingRef.current = false;
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          draggable={false}
          className="w-full h-full object-contain bg-muted/40 pointer-events-none"
        />
        {/* Crop yönlendirme overlay'i, kullanıcıya gerçek frame'in
            nerede olacağını gösterir. Cover yapıldığında bu noktanın
            etrafı kırpılır. */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${focalX}%`,
            top: `${focalY}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="w-6 h-6 rounded-full border-2 border-white bg-foreground/40 ring-2 ring-foreground shadow-lg" />
        </div>
        {/* Crosshair */}
        <div
          className="absolute pointer-events-none top-0 bottom-0 border-l border-white/50"
          style={{ left: `${focalX}%` }}
        />
        <div
          className="absolute pointer-events-none left-0 right-0 border-t border-white/50"
          style={{ top: `${focalY}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>
          X: <span className="font-mono">{Math.round(focalX)}%</span> · Y:{" "}
          <span className="font-mono">{Math.round(focalY)}%</span>
        </span>
        <button
          type="button"
          onClick={() => onChange(50, 50)}
          className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 hover:bg-muted cursor-pointer"
        >
          <RotateCcw className="size-3" /> Sıfırla
        </button>
      </div>
    </div>
  );
}
