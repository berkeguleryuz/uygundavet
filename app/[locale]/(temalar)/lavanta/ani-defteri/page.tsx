import type { Metadata } from "next";
import { MemoryForm } from "../_components/MemoryForm";

export const metadata: Metadata = {
  title: "Ani Defteri",
};

export default function AniDefteriPage() {
  return (
    <div className="min-h-svh pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <MemoryForm />
      </div>
    </div>
  );
}
