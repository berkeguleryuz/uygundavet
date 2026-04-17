"use client";

export default function OceanError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-[#0d1620] px-6 text-center">
      <h2 className="font-merienda text-2xl text-[#a8dadc] mb-4">Bir şeyler ters gitti</h2>
      <p className="font-sans text-sm text-[#f1faee]/50 mb-8">Sayfa yüklenirken bir hata oluştu.</p>
      <button
        onClick={reset}
        className="font-sans text-sm font-bold tracking-[0.15em] uppercase bg-[#2d8b8b] text-[#f1faee] rounded-full px-8 py-3 hover:bg-[#3aa0a0] transition-colors"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
