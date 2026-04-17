import mongoose, { Schema, type Document, type Model } from "mongoose";

export type PaymentStatus = "pending" | "deposit_paid" | "fully_paid";
export type PaymentMethod = "deposit" | "full";
export type SelectedPackage = "starter" | "pro" | "business";
export type SelectedTheme = "rose" | "sunset" | "pearl" | "crystal" | "garden" | "ocean" | "golden" | "custom";

export interface OrderData {
  _id?: string;
  userId: string;
  userEmail: string;
  userPhone: string;
  selectedPackage: SelectedPackage;
  selectedTheme: SelectedTheme;
  customThemeRequest?: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  depositAmount: number;
  totalAmount: number;
  paidAmount: number;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder extends Document {
  userId: string;
  userEmail: string;
  userPhone: string;
  selectedPackage: SelectedPackage;
  selectedTheme: SelectedTheme;
  customThemeRequest?: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  depositAmount: number;
  totalAmount: number;
  paidAmount: number;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true, trim: true },
    userPhone: { type: String, required: true, trim: true },
    selectedPackage: {
      type: String,
      enum: ["starter", "pro", "business"],
      required: true,
    },
    selectedTheme: {
      type: String,
      enum: ["rose", "sunset", "pearl", "crystal", "garden", "ocean", "golden", "custom"],
      required: true,
    },
    customThemeRequest: { type: String, trim: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "deposit_paid", "fully_paid"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["deposit", "full"],
      required: true,
    },
    depositAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    adminNotes: { type: String, trim: true },
  },
  {
    timestamps: true,
    collection: "orders",
  }
);

OrderSchema.index({ paymentStatus: 1, createdAt: -1 });

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
