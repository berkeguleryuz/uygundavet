import dynamic from "next/dynamic";
import { SectionHero } from "./_sections/SectionHero";

const SectionCountdown = dynamic(() =>
  import("./_sections/SectionCountdown").then((m) => ({ default: m.SectionCountdown }))
);
const SectionStoryPreview = dynamic(() =>
  import("./_sections/SectionStoryPreview").then((m) => ({ default: m.SectionStoryPreview }))
);
const SectionVenue = dynamic(() =>
  import("./_sections/SectionVenue").then((m) => ({ default: m.SectionVenue }))
);
const SectionGalleryPreview = dynamic(() =>
  import("./_sections/SectionGalleryPreview").then((m) => ({ default: m.SectionGalleryPreview }))
);
const SectionCTA = dynamic(() =>
  import("./_sections/SectionCTA").then((m) => ({ default: m.SectionCTA }))
);

export default function GardenPage() {
  return (
    <>
      <SectionHero />
      <SectionCountdown />
      <SectionStoryPreview />
      <SectionVenue />
      <SectionGalleryPreview />
      <SectionCTA />
    </>
  );
}
