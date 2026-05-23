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

const CoverImageSchema = new Schema(
  {
    url: String,
    alt: String,
    width: Number,
    height: Number,
  },
  { _id: false }
);

const SeoSchema = new Schema(
  {
    title: String,
    description: String,
    ogImageUrl: String,
  },
  { _id: false }
);

const BlogPostSchema = new Schema<IBlogPost>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    excerpt: { type: String, required: true, trim: true, maxlength: 300 },
    content: { type: String, required: true },
    coverImage: {
      type: CoverImageSchema,
      default: null,
    },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: { type: Date, default: null, index: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true, trim: true },
    tags: { type: [{ type: String, trim: true }], default: [], index: true },
    seo: {
      type: SeoSchema,
      default: {},
    },
    aiGenerated: { type: Boolean, default: false },
    readingTimeMinutes: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: "blogPosts",
  }
);

BlogPostSchema.index({ status: 1, publishedAt: -1 });

export const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
