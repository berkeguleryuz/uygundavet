import { cache } from "react";
import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { Order } from "@/models/Order";
import { canAccess } from "@/lib/package-gating";
import type { SelectedPackage } from "@/models/Order";
import { WeddingProvider } from "./_lib/context";
import type { WeddingData } from "./_lib/types";
import { GardenNav } from "./_components/GardenNav";
import { GardenFooter } from "./_components/GardenFooter";

const INVITE_CODE = process.env.GARDEN_INVITE_CODE || process.env.Grow_INVITE_CODE || "";

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
      selectedTheme: order?.selectedTheme || "garden",
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
    throw error;
  }
});

export async function generateMetadata(): Promise<Metadata> {
  let data: WeddingData | null = null;
  try { data = await getWeddingData(); } catch { /* handled in layout */ }
  if (!data) return { title: "Davetiye" };
  const b = data.brideName.split(" ")[0];
  const g = data.groomName.split(" ")[0];
  return {
    title: { default: `${b} & ${g}`, template: `%s | ${b} & ${g}` },
    description: `${b} ve ${g} düğün davetiyesi.`,
    robots: { index: false, follow: false },
  };
}

export default async function GardenLayout({ children }: { children: React.ReactNode }) {
  let data: WeddingData | null = null;
  try {
    data = await getWeddingData();
  } catch {
    return (
      <div className="min-h-svh flex flex-col items-center justify-center bg-[#1f2a22] px-6 text-center">
        <h2 className="font-merienda text-2xl text-[#f9a620] mb-4">Bir şeyler ters gitti</h2>
        <p className="font-sans text-sm text-[#f5f3ed]/50 mb-8">Sayfa yüklenirken bir hata oluştu.</p>
        <a href="" className="font-sans text-sm font-semibold tracking-[0.15em] uppercase bg-[#f9a620] text-[#1f2a22] rounded-full px-8 py-3 hover:bg-[#fdb94a] transition-colors">
          Tekrar Dene
        </a>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-svh flex flex-col items-center justify-center bg-[#1f2a22] px-6 text-center">
        <h2 className="font-merienda text-2xl text-[#f9a620] mb-4">Davetiye bulunamadı</h2>
        <p className="font-sans text-sm text-[#f5f3ed]/50">Bu davetiye artık mevcut değil veya bağlantı geçersiz.</p>
      </div>
    );
  }

  Customer.updateOne({ inviteCode: INVITE_CODE }, { $inc: { invitationViews: 1 } }).catch(() => {});

  return (
    <WeddingProvider data={data}>
      <div className="relative min-h-screen bg-[#f5f3ed] text-[#2b3628] overflow-x-hidden">
        <GardenNav />
        <main>{children}</main>
        <GardenFooter />
      </div>
    </WeddingProvider>
  );
}
