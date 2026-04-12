import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IGalleryPhoto extends Document {
  userId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  publicId: string;
  uploader: string;
  size: number;
  liked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryPhotoSchema = new Schema<IGalleryPhoto>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    thumbnailUrl: { type: String, default: "" },
    publicId: { type: String, required: true },
    uploader: { type: String, trim: true, default: "" },
    size: { type: Number, default: 0 },
    liked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "gallery_photos",
  }
);

export const GalleryPhoto: Model<IGalleryPhoto> =
  mongoose.models.GalleryPhoto ||
  mongoose.model<IGalleryPhoto>("GalleryPhoto", GalleryPhotoSchema);
