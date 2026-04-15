"use client";

export default function CrystalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-[#f6f3ee] px-6 text-center">
      <h2 className="font-merienda text-2xl text-[#1a1a2e] mb-4">Bir şeyler ters gitti</h2>
      <p className="font-sans text-sm text-[#1a1a2e]/50 mb-8">Sayfa yüklenirken bir hata oluştu.</p>
      <button
        onClick={reset}
        className="font-sans text-sm font-medium tracking-wide bg-[#b49a7c] text-white rounded-full px-8 py-3 hover:opacity-90 transition-opacity cursor-pointer"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
