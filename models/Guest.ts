import mongoose, { Schema, type Document, type Model } from "mongoose";

export type RsvpStatus = "confirmed" | "declined" | "pending" | "guest";
export type GuestSource = "whatsapp" | "manual" | "qr-code" | "website";

export interface IGuest extends Document {
  userId: string;
  name: string;
  phone: string;
  email: string;
  rsvpStatus: RsvpStatus;
  guestCount: number;
  note: string;
  source: GuestSource;
  createdAt: Date;
  updatedAt: Date;
}

const GuestSchema = new Schema<IGuest>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },
    rsvpStatus: {
      type: String,
      enum: ["confirmed", "declined", "pending", "guest"],
      default: "pending",
    },
    guestCount: { type: Number, default: 1, min: 0 },
    note: { type: String, trim: true, default: "" },
    source: {
      type: String,
      enum: ["whatsapp", "manual", "qr-code", "website"],
      default: "manual",
    },
  },
  {
    timestamps: true,
    collection: "guests",
  }
);

GuestSchema.index({ userId: 1, createdAt: -1 });

// Delete cached model to ensure schema changes are picked up
if (mongoose.models.Guest) {
  delete mongoose.models.Guest;
}
export const Guest: Model<IGuest> = mongoose.model<IGuest>("Guest", GuestSchema);
