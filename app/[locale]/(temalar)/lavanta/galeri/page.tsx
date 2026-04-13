import type { Metadata } from "next";
import { GalleryGrid } from "../_components/GalleryGrid";

export const metadata: Metadata = {
  title: "Galeri",
};

export default function GaleriPage() {
  return (
    <div className="min-h-svh pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <GalleryGrid />
      </div>
    </div>
  );
}
