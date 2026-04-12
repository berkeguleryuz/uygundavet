import mongoose, { Schema, type Document, type Model } from "mongoose";

interface PersonName {
  firstName: string;
  lastName: string;
}

interface FamilyInfo {
  father: PersonName;
  mother: PersonName;
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
  createdAt: Date;
  updatedAt: Date;
}

const PersonNameSchema = new Schema<PersonName>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const FamilyInfoSchema = new Schema<FamilyInfo>(
  {
    father: { type: PersonNameSchema, required: true },
    mother: { type: PersonNameSchema, required: true },
  },
  { _id: false }
);

const CustomerSchema = new Schema<ICustomer>(
  {
    userId: { type: String, required: true },
    weddingDate: { type: Date, required: true },
    weddingTime: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    venueName: { type: String, trim: true, default: "" },
    venueAddress: { type: String, trim: true, default: "" },
    inviteCode: { type: String, unique: true, sparse: true },
    invitationViews: { type: Number, default: 0 },
    groom: { type: PersonNameSchema, required: true },
    bride: { type: PersonNameSchema, required: true },
    groomFamily: { type: FamilyInfoSchema, required: true },
    brideFamily: { type: FamilyInfoSchema, required: true },
  },
  {
    timestamps: true,
    collection: "customers",
  }
);

export const Customer: Model<ICustomer> =
  mongoose.models.Customer ||
  mongoose.model<ICustomer>("Customer", CustomerSchema);
