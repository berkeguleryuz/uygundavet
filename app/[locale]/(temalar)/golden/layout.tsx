import { cache } from "react";
import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { Order } from "@/models/Order";
import { canAccess } from "@/lib/package-gating";
import type { SelectedPackage } from "@/models/Order";
import { WeddingProvider } from "./_lib/context";
import type { WeddingData } from "./_lib/types";
import { GoldenNav } from "./_components/GoldenNav";
import { GoldenFooter } from "./_components/GoldenFooter";

const INVITE_CODE = process.env.GOLDEN_INVITE_CODE || process.env.Grow_INVITE_CODE || "";

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
      selectedTheme: order?.selectedTheme || "golden",
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

export default async function GoldenLayout({ children }: { children: React.ReactNode }) {
  let data: WeddingData | null = null;
  try {
    data = await getWeddingData();
  } catch {
    return (
      <div className="min-h-svh flex flex-col items-center justify-center bg-[#2d2620] px-6 text-center">
        <h2 className="font-merienda text-2xl text-[#f4a900] mb-4">Bir şeyler ters gitti</h2>
        <p className="font-sans text-sm text-[#d4b896]/60 mb-8">Sayfa yüklenirken bir hata oluştu.</p>
        <a href="" className="font-sans text-sm font-bold tracking-[0.15em] uppercase bg-[#f4a900] text-[#2d2620] rounded-full px-8 py-3 hover:bg-[#ffc13d] transition-colors">
          Tekrar Dene
        </a>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-svh flex flex-col items-center justify-center bg-[#2d2620] px-6 text-center">
        <h2 className="font-merienda text-2xl text-[#f4a900] mb-4">Davetiye bulunamadı</h2>
        <p className="font-sans text-sm text-[#d4b896]/60">Bu davetiye artık mevcut değil veya bağlantı geçersiz.</p>
      </div>
    );
  }

  Customer.updateOne({ inviteCode: INVITE_CODE }, { $inc: { invitationViews: 1 } }).catch(() => {});

  return (
    <WeddingProvider data={data}>
      <div className="relative min-h-screen bg-[#faf5ec] text-[#4a403a] overflow-x-hidden">
        <GoldenNav />
        <main>{children}</main>
        <GoldenFooter />
      </div>
    </WeddingProvider>
  );
}
