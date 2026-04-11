import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ISubscriber extends Document {
  email: string;
  createdAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "subscribers",
  }
);

export const Subscriber: Model<ISubscriber> =
  mongoose.models.Subscriber ||
  mongoose.model<ISubscriber>("Subscriber", SubscriberSchema);
