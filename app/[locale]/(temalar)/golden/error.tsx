"use client";

export default function GoldenError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-[#2d2620] px-6 text-center">
      <h2 className="font-merienda text-2xl text-[#f4a900] mb-4">Bir şeyler ters gitti</h2>
      <p className="font-sans text-sm text-[#d4b896]/60 mb-8">Sayfa yüklenirken bir hata oluştu.</p>
      <button
        onClick={reset}
        className="font-sans text-sm font-bold tracking-[0.15em] uppercase bg-[#f4a900] text-[#2d2620] rounded-full px-8 py-3 hover:bg-[#ffc13d] transition-colors"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
