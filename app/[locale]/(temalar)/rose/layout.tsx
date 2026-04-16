import { cache } from "react";
import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { Order } from "@/models/Order";
import { canAccess } from "@/lib/package-gating";
import type { SelectedPackage } from "@/models/Order";
import { WeddingProvider } from "./_lib/context";
import type { WeddingData } from "./_lib/types";
import { RoseNav } from "./_components/RoseNav";
import { RoseFooter } from "./_components/RoseFooter";

const INVITE_CODE = process.env.ROSE_INVITE_CODE || process.env.LAVANTA_INVITE_CODE || "";

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

export default async function RoseLayout({ children }: { children: React.ReactNode }) {
  let data: WeddingData | null = null;
  try {
    data = await getWeddingData();
  } catch {
    return (
      <div className="min-h-svh flex flex-col items-center justify-center bg-[#0f0b09] px-6 text-center">
        <h2 className="font-merienda text-2xl text-[#f0e4dc] mb-4">Bir şeyler ters gitti</h2>
        <p className="font-sans text-sm text-[#f0e4dc]/50 mb-8">Sayfa yüklenirken bir hata oluştu.</p>
        <a href="" className="font-sans text-sm font-medium tracking-wide bg-gradient-to-r from-[#c75050] to-[#d4898a] text-white rounded-full px-8 py-3 hover:opacity-90 transition-opacity">
          Tekrar Dene
        </a>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-svh flex flex-col items-center justify-center bg-[#0f0b09] px-6 text-center">
        <h2 className="font-merienda text-2xl text-[#f0e4dc] mb-4">Davetiye bulunamadı</h2>
        <p className="font-sans text-sm text-[#f0e4dc]/50">Bu davetiye artık mevcut değil veya bağlantı geçersiz.</p>
      </div>
    );
  }
  Customer.updateOne({ inviteCode: INVITE_CODE }, { $inc: { invitationViews: 1 } }).catch(() => {});
  return (
    <WeddingProvider data={data}>
      <div className="relative min-h-screen bg-white text-[#1a1210] overflow-x-hidden">
        <RoseNav />
        <main>{children}</main>
        <RoseFooter />
      </div>
    </WeddingProvider>
  );
}
