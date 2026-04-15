import mongoose, { Schema, type Document, type Model } from "mongoose";

interface PersonName {
  firstName: string;
  lastName: string;
}

interface FamilyInfo {
  father: PersonName;
  mother: PersonName;
}

interface EventScheduleItem {
  time: string;
  label: string;
}

interface StoryMilestone {
  date: string;
  title: string;
  description: string;
  imageUrl: string;
  imagePublicId: string;
}

export interface ICustomer extends Document {
  userId: string;
  weddingDate: Date;
  weddingTime: string;
  address: string;
  venueName: string;
  venueAddress: string;
  inviteCode: string;
  invitationViews: number;
  groom: PersonName;
  bride: PersonName;
  groomFamily: FamilyInfo;
  brideFamily: FamilyInfo;
  eventSchedule: EventScheduleItem[];
  storyMilestones: StoryMilestone[];
  customDomain: string;
  createdAt: Date;
  updatedAt: Date;
}

const PersonNameSchema = new Schema<PersonName>(
  {
    firstName: { type: String, trim: true, default: "" },
    lastName: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const FamilyInfoSchema = new Schema<FamilyInfo>(
  {
    father: { type: PersonNameSchema, default: () => ({ firstName: "", lastName: "" }) },
    mother: { type: PersonNameSchema, default: () => ({ firstName: "", lastName: "" }) },
  },
  { _id: false }
);

const CustomerSchema = new Schema<ICustomer>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    weddingDate: { type: Date, required: true, index: true },
    weddingTime: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    venueName: { type: String, trim: true, default: "" },
    venueAddress: { type: String, trim: true, default: "" },
    inviteCode: { type: String, unique: true, sparse: true },
    invitationViews: { type: Number, default: 0 },
    groom: { type: PersonNameSchema, required: true },
    bride: { type: PersonNameSchema, required: true },
    groomFamily: { type: FamilyInfoSchema, default: () => ({}) },
    brideFamily: { type: FamilyInfoSchema, default: () => ({}) },
    eventSchedule: {
      type: [
        {
          time: { type: String, trim: true },
          label: { type: String, trim: true },
          _id: false,
        },
      ],
      default: [],
    },
    storyMilestones: {
      type: [
        {
          date: { type: String, trim: true },
          title: { type: String, trim: true },
          description: { type: String, trim: true },
          imageUrl: { type: String, default: "" },
          imagePublicId: { type: String, default: "" },
          _id: false,
        },
      ],
      default: [],
    },
    customDomain: { type: String, trim: true, default: "" },
  },
  {
    timestamps: true,
    collection: "customers",
  }
);

export const Customer: Model<ICustomer> =
  mongoose.models.Customer ||
  mongoose.model<ICustomer>("Customer", CustomerSchema);
