import dynamic from "next/dynamic";
import { SectionHero } from "./_sections/SectionHero";

const SectionCountdown = dynamic(() =>
  import("./_sections/SectionCountdown").then((m) => ({
    default: m.SectionCountdown,
  }))
);
const SectionStoryPreview = dynamic(() =>
  import("./_sections/SectionStoryPreview").then((m) => ({
    default: m.SectionStoryPreview,
  }))
);
const SectionVenuePreview = dynamic(() =>
  import("./_sections/SectionVenuePreview").then((m) => ({
    default: m.SectionVenuePreview,
  }))
);
const SectionGalleryPreview = dynamic(() =>
  import("./_sections/SectionGalleryPreview").then((m) => ({
    default: m.SectionGalleryPreview,
  }))
);
const SectionCTA = dynamic(() =>
  import("./_sections/SectionCTA").then((m) => ({
    default: m.SectionCTA,
  }))
);

export default function PearlHome() {
  return (
    <>
      <SectionHero />
      <SectionCountdown />
      <SectionStoryPreview />
      <SectionVenuePreview />
      <SectionGalleryPreview />
      <SectionCTA />
    </>
  );
}
