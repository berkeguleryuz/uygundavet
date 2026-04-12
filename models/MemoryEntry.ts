import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IMemoryEntry extends Document {
  userId: string;
  authorName: string;
  message: string;
  approved: boolean;
  createdAt: Date;
}

const MemoryEntrySchema = new Schema<IMemoryEntry>(
  {
    userId: { type: String, required: true, index: true },
    authorName: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    approved: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "memory_entries",
  }
);

export const MemoryEntry: Model<IMemoryEntry> =
  mongoose.models.MemoryEntry ||
  mongoose.model<IMemoryEntry>("MemoryEntry", MemoryEntrySchema);
