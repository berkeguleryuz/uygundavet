import mongoose, { Schema, type Document, type Model } from "mongoose";

interface PersonName {
  firstName: string;
  lastName: string;
}

interface FamilyInfo {
  fatherName: string;
  motherName: string;
  lastName: string;
}

export interface ICustomer extends Document {
  userId: mongoose.Types.ObjectId;
  weddingDate: Date;
  address: string;
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
    fatherName: { type: String, required: true, trim: true },
    motherName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const CustomerSchema = new Schema<ICustomer>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    weddingDate: { type: Date, required: true },
    address: { type: String, required: true, trim: true },
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
