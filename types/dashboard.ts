export type RsvpStatus = "confirmed" | "declined" | "pending" | "guest";

export type GuestSource = "whatsapp" | "manual" | "qr-code" | "website";

export interface DashboardStat {
  title: string;
  value: string;
  trend?: { value: number; isPositive: boolean };
  subtitle?: string;
}

export interface GuestData {
  _id: string;
  name: string;
  phone: string;
  email: string;
  rsvpStatus: RsvpStatus;
  guestCount: number;
  note: string;
  source: GuestSource;
  createdAt: string;
  updatedAt: string;
}

export interface ChartDataPoint {
  date: string;
  confirmed: number;
  declined: number;
  pending: number;
}

export interface ActivityData {
  _id: string;
  name: string;
  action: string;
  time: string;
}

export interface CustomerData {
  _id: string;
  userId: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  groom: { firstName: string; lastName: string };
  bride: { firstName: string; lastName: string };
  groomFamily: {
    father: { firstName: string; lastName: string };
    mother: { firstName: string; lastName: string };
  };
  brideFamily: {
    father: { firstName: string; lastName: string };
    mother: { firstName: string; lastName: string };
  };
  inviteCode?: string;
  invitationViews: number;
  eventSchedule: { time: string; label: string }[];
  storyMilestones: {
    date: string;
    title: string;
    description: string;
    imageUrl: string;
    imagePublicId: string;
  }[];
}
