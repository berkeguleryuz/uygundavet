import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { Order } from "@/models/Order";
import { canAccess } from "@/lib/package-gating";
import type { SelectedPackage } from "@/models/Order";
import { WeddingProvider } from "./_lib/context";
import { SunsetNav } from "./_components/SunsetNav";
import { SunsetFooter } from "./_components/SunsetFooter";
import type { WeddingData } from "./_lib/types";

const INVITE_CODE = process.env.SUNSET_INVITE_CODE || process.env.LAVANTA_INVITE_CODE || "";

const getWeddingData = cache(async (): Promise<WeddingData | null> => {
  if (!INVITE_CODE) return null;
  try {
    await connectDB();
    const customer = await Customer.findOne({ inviteCode: INVITE_CODE }).lean();
    if (!customer) return null;
    const order = await Order.findOne({ userId: customer.userId }).lean();
    const pkg = (order?.selectedPackage || "starter") as SelectedPackage;
    return {
      groomName: `${customer.groom.firstName} ${customer.groom.lastName}`,
      brideName: `${customer.bride.firstName} ${customer.bride.lastName}`,
      weddingDate: customer.weddingDate?.toISOString() || "",
      weddingTime: customer.weddingTime || "",
      venueName: customer.venueName || "",
      venueAddress: customer.venueAddress || "",
      address: customer.address || "",
      hasGallery: canAccess("gallery", pkg),
      hasMemoryBook: canAccess("memoryBook", pkg),
      selectedTheme: order?.selectedTheme || "sunset",
      inviteCode: customer.inviteCode,
      groomFamily: customer.groomFamily || null,
      brideFamily: customer.brideFamily || null,
      eventSchedule: customer.eventSchedule || [],
      storyMilestones: (customer.storyMilestones || []).map((m: { date?: string; title?: string; description?: string; imageUrl?: string; imagePublicId?: string }) => ({
        date: m.date || "", title: m.title || "", description: m.description || "", imageUrl: m.imageUrl || "", imagePublicId: m.imagePublicId || "",
      })),
    };
  } catch (error) {
    console.error("Failed to fetch wedding data:", error);
    return null;
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const data = await getWeddingData();
  if (!data) return { title: "Davetiye" };
  const b = data.brideName.split(" ")[0];
  const g = data.groomName.split(" ")[0];
  return {
    title: { default: `${b} & ${g}`, template: `%s | ${b} & ${g}` },
    description: `${b} ve ${g} düğün davetiyesi.`,
    robots: { index: false, follow: false },
  };
}

export default async function SunsetLayout({ children }: { children: React.ReactNode }) {
  const data = await getWeddingData();
  if (!data) notFound();

  Customer.updateOne({ inviteCode: INVITE_CODE }, { $inc: { invitationViews: 1 } }).catch(() => {});

  return (
    <WeddingProvider data={data}>
      <div className="relative min-h-screen bg-[#1a0f0a] text-[#faf0e6] overflow-x-hidden">
        <SunsetNav />
        <main>{children}</main>
        <SunsetFooter />
      </div>
    </WeddingProvider>
  );
}
