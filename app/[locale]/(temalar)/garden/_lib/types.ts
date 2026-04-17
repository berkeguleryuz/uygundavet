export interface WeddingData {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  address: string;
  hasGallery: boolean;
  hasMemoryBook: boolean;
  selectedTheme: string;
  inviteCode: string;
  groomFamily: {
    father: { firstName: string; lastName: string };
    mother: { firstName: string; lastName: string };
  } | null;
  brideFamily: {
    father: { firstName: string; lastName: string };
    mother: { firstName: string; lastName: string };
  } | null;
  eventSchedule: { time: string; label: string }[];
  storyMilestones: {
    date: string;
    title: string;
    description: string;
    imageUrl: string;
    imagePublicId: string;
  }[];
}
