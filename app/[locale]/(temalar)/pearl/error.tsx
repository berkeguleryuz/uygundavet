"use client";

export default function PearlError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-[#f7f4ef] px-6 text-center">
      <h2 className="font-merienda text-2xl text-[#1c1917] mb-4">Bir şeyler ters gitti</h2>
      <p className="font-sans text-sm text-[#1c1917]/50 mb-8">Sayfa yüklenirken bir hata oluştu.</p>
      <button
        onClick={reset}
        className="font-sans text-sm font-medium tracking-wide bg-gradient-to-r from-[#b8a088] to-[#c4a296] text-white rounded-full px-8 py-3 hover:opacity-90 transition-opacity"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
