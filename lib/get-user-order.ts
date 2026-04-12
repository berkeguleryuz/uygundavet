import { connectDB } from "./mongodb";
import { Order, type OrderData } from "@/models/Order";

export async function getUserOrder(userId: string): Promise<OrderData | null> {
  await connectDB();
  const order = await Order.findOne({ userId }).lean();
  if (!order) return null;
  return { ...order, _id: String(order._id) } as OrderData;
}
