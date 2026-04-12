import { connectDB } from "./mongodb";
import { Order, type IOrder } from "@/models/Order";

export async function getUserOrder(userId: string): Promise<IOrder | null> {
  await connectDB();
  return Order.findOne({ userId }).lean();
}
