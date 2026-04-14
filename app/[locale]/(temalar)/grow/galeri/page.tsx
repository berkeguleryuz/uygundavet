import type { Metadata } from "next";
import { GalleryGrid } from "../_components/GalleryGrid";

export const metadata: Metadata = {
  title: "Galeri",
};

export default function GaleriPage() {
  return (
    <div className="pt-24 pb-12 px-3 sm:px-5 md:px-8">
      <GalleryGrid />
    </div>
  );
}
