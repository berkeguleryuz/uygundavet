"use client";

export default function RoseError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-[#0f0b09] px-6 text-center">
      <h2 className="font-merienda text-2xl text-[#f0e4dc] mb-4">Bir şeyler ters gitti</h2>
      <p className="font-sans text-sm text-[#f0e4dc]/50 mb-8">Sayfa yüklenirken bir hata oluştu.</p>
      <button
        onClick={reset}
        className="font-sans text-sm font-medium tracking-wide bg-gradient-to-r from-[#c75050] to-[#d4898a] text-white rounded-full px-8 py-3 hover:opacity-90 transition-opacity"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
