import type { Metadata } from "next";
import { MemoryForm } from "../_components/MemoryForm";

export const metadata: Metadata = {
  title: "Ani Defteri",
};

export default function AniDefteriPage() {
  return (
    <div className="min-h-svh bg-[#1c1917] pt-24 pb-12 px-4 sm:px-6" data-section-dark>
      <div className="max-w-2xl mx-auto">
        <MemoryForm />
      </div>
    </div>
  );
}
