"use client";

export default function GardenError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-[#1f2a22] px-6 text-center">
      <h2 className="font-merienda text-2xl text-[#f9a620] mb-4">Bir şeyler ters gitti</h2>
      <p className="font-sans text-sm text-[#f5f3ed]/50 mb-8">Sayfa yüklenirken bir hata oluştu.</p>
      <button
        onClick={reset}
        className="font-sans text-sm font-semibold tracking-[0.15em] uppercase bg-[#f9a620] text-[#1f2a22] rounded-full px-8 py-3 hover:bg-[#fdb94a] transition-colors"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
