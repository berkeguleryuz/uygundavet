import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  note: string;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    note: { type: String, default: "" },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "contacts",
  }
);

export const Contact: Model<IContact> =
  mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);
