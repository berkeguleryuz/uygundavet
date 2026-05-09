"use client";

import { Download } from "lucide-react";

/**
 * Print sayfasının sağ üstündeki toolbar. Sadece ekranda görünür,
 * @media print kuralı butonu gizliyor (sadece kart yazdırılır).
 */
export function PrintToolbar() {
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2 print-toolbar">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-xs font-chakra uppercase tracking-[0.18em] hover:opacity-90 cursor-pointer shadow-lg"
      >
        <Download className="size-3.5" /> PDF Olarak Kaydet
      </button>
      <style>{`
        @media print {
          .print-toolbar { display: none !important; }
        }
      `}</style>
    </div>
  );
}
