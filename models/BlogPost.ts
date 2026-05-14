import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IBlogPost extends Document {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: {
    url: string;
    alt: string;
    width: number;
    height: number;
  } | null;
  status: "draft" | "published";
  publishedAt: Date | null;
  authorId: string;
  authorName: string;
  tags: string[];
  seo: {
    title?: string;
    description?: string;
    ogImageUrl?: string;
  };
  aiGenerated: boolean;
  readingTimeMinutes: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, maxlength: 200 },
    excerpt: { type: String, required: true, maxlength: 300 },
    content: { type: String, required: true },
    coverImage: {
      type: {
        url: String,
        alt: String,
        width: Number,
        height: Number,
      },
      default: null,
    },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    publishedAt: { type: Date, default: null, index: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    tags: { type: [String], default: [], index: true },
    seo: {
      title: String,
      description: String,
      ogImageUrl: String,
    },
    aiGenerated: { type: Boolean, default: false },
    readingTimeMinutes: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

BlogPostSchema.index({ status: 1, publishedAt: -1 });

export const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
