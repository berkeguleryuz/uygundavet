import { cache } from "react";
import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { Order } from "@/models/Order";
import { canAccess } from "@/lib/package-gating";
import type { SelectedPackage } from "@/models/Order";
import { WeddingProvider } from "./_lib/context";
import { LavantaNav } from "./_components/LavantaNav";
import { LavantaFooter } from "./_components/LavantaFooter";
import type { WeddingData } from "./_lib/types";

const INVITE_CODE = process.env.GROW_INVITE_CODE || process.env.LAVANTA_INVITE_CODE || "";

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
      selectedTheme: order?.selectedTheme || "rose",
      inviteCode: customer.inviteCode,
      groomFamily: customer.groomFamily || null,
      brideFamily: customer.brideFamily || null,
      eventSchedule: customer.eventSchedule || [],
      storyMilestones: (customer.storyMilestones || []).map((m: { date?: string; title?: string; description?: string; imageUrl?: string; imagePublicId?: string }) => ({
        date: m.date || "",
        title: m.title || "",
        description: m.description || "",
        imageUrl: m.imageUrl || "",
        imagePublicId: m.imagePublicId || "",
      })),
    };
  } catch (error) {
    console.error("Failed to fetch wedding data:", error);
    throw error;
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const data = await getWeddingData();

  if (!data) {
    return { title: "Davetiye" };
  }

  const brideFirst = data.brideName.split(" ")[0];
  const groomFirst = data.groomName.split(" ")[0];
  const dateStr = data.weddingDate
    ? new Date(data.weddingDate).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return {
    title: {
      default: `${brideFirst} & ${groomFirst}${dateStr ? ` — ${dateStr}` : ""}`,
      template: `%s | ${brideFirst} & ${groomFirst}`,
    },
    description: `${brideFirst} ve ${groomFirst} dugun davetiyesi.${dateStr ? ` ${dateStr}` : ""}${data.venueName ? `, ${data.venueName}` : ""}`,
    robots: { index: false, follow: false },
  };
}

export default async function LavantaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getWeddingData();

  if (!data) {
    return (
      <div className="min-h-svh flex flex-col items-center justify-center bg-[#252224] px-6 text-center">
        <h2 className="font-merienda text-2xl text-white mb-4">Davetiye bulunamadı</h2>
        <p className="font-sans text-sm text-white/50">Bu davetiye artık mevcut değil veya bağlantı geçersiz.</p>
      </div>
    );
  }

  Customer.updateOne({ inviteCode: INVITE_CODE }, { $inc: { invitationViews: 1 } }).catch(() => {});

  return (
    <WeddingProvider data={data}>
      <div className="relative min-h-screen bg-[#252224] text-white overflow-x-hidden">
        <LavantaNav />
        <main>{children}</main>
        <LavantaFooter />
      </div>
    </WeddingProvider>
  );
}
