"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Loader2,
  Heart,
  Calendar,
  MapPin,
  Eye,
  Hash,
  Users,
  ListChecks,
  ExternalLink,
  Globe,
  Save,
  Trash2,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  BookOpen,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface PersonName {
  firstName: string;
  lastName: string;
}
interface FamilyInfo {
  father: PersonName;
  mother: PersonName;
}
interface CustomerData {
  _id: string;
  userId: string;
  bride: PersonName;
  groom: PersonName;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  inviteCode: string;
  invitationViews: number;
  customDomain: string;
  brideFamily: FamilyInfo;
  groomFamily: FamilyInfo;
  eventSchedule: { time: string; label: string }[];
  storyMilestones: {
    date: string;
    title: string;
    description: string;
    imageUrl: string;
    imagePublicId: string;
  }[];
}
interface OrderData {
  selectedTheme: string;
  selectedPackage: string;
  userEmail: string;
  userPhone: string;
}
interface PhotoData {
  _id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  uploader: string;
  size: number;
  createdAt: string;
}
interface MemoryData {
  _id: string;
  authorName: string;
  message: string;
  approved: boolean;
  createdAt: string;
}
interface GuestData {
  _id: string;
  name: string;
  phone: string;
  rsvpStatus: "confirmed" | "declined" | "pending" | "guest";
  guestCount: number;
  source: string;
  note: string;
}

type Tab = "genel" | "galeri" | "ani" | "misafirler";

const tabs: { key: Tab; label: string }[] = [
  { key: "genel", label: "Genel" },
  { key: "galeri", label: "Galeri" },
  { key: "ani", label: "Anı Defteri" },
  { key: "misafirler", label: "Misafirler" },
];

const rsvpLabels: Record<
  string,
  { label: string; color: string }
> = {
  confirmed: { label: "Katılacak", color: "bg-green-500/20 text-green-300" },
  declined: { label: "Katılmayacak", color: "bg-red-500/20 text-red-300" },
  pending: { label: "Bekliyor", color: "bg-amber-500/20 text-amber-300" },
  guest: { label: "Misafir", color: "bg-blue-500/20 text-blue-300" },
};

const sourceLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  manual: "Manuel",
  "qr-code": "QR Kod",
  website: "Website",
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function WebsiteDetailPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("genel");

  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [memories, setMemories] = useState<MemoryData[]>([]);
  const [guests, setGuests] = useState<GuestData[]>([]);

  const [customDomain, setCustomDomain] = useState("");
  const [savingDomain, setSavingDomain] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/websites/${customerId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.customer) {
          setCustomer(data.customer);
          setCustomDomain(data.customer.customDomain || "");
        }
        if (data.order) setOrder(data.order);
        if (data.photos) setPhotos(data.photos);
        if (data.memories) setMemories(data.memories);
        if (data.guests) setGuests(data.guests);
      })
      .catch(() => toast.error("Veriler yüklenemedi"))
      .finally(() => setLoading(false));
  }, [customerId]);

  const saveDomain = async () => {
    setSavingDomain(true);
    try {
      const res = await fetch(`/api/admin/websites/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customDomain }),
      });
      if (res.ok) {
        toast.success("Domain kaydedildi");
        setCustomer((prev) =>
          prev ? { ...prev, customDomain } : null
        );
      } else {
        toast.error("Hata oluştu");
      }
    } catch {
      toast.error("Hata oluştu");
    } finally {
      setSavingDomain(false);
    }
  };

  const deletePhoto = async (photoId: string) => {
    if (!window.confirm("Bu fotoğrafı silmek istediğinize emin misiniz?"))
      return;
    try {
      const res = await fetch(
        `/api/admin/websites/${customerId}/gallery/${photoId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p._id !== photoId));
        toast.success("Fotoğraf silindi");
      } else {
        toast.error("Silinemedi");
      }
    } catch {
      toast.error("Hata oluştu");
    }
  };

  const toggleMemoryApproval = async (entry: MemoryData) => {
    try {
      const res = await fetch(
        `/api/admin/websites/${customerId}/memories/${entry._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approved: !entry.approved }),
        }
      );
      if (res.ok) {
        setMemories((prev) =>
          prev.map((m) =>
            m._id === entry._id ? { ...m, approved: !m.approved } : m
          )
        );
        toast.success(entry.approved ? "Onay kaldırıldı" : "Onaylandı");
      } else {
        toast.error("Hata oluştu");
      }
    } catch {
      toast.error("Hata oluştu");
    }
  };

  const deleteMemory = async (entryId: string) => {
    if (!window.confirm("Bu anıyı silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(
        `/api/admin/websites/${customerId}/memories/${entryId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setMemories((prev) => prev.filter((m) => m._id !== entryId));
        toast.success("Anı silindi");
      } else {
        toast.error("Silinemedi");
      }
    } catch {
      toast.error("Hata oluştu");
    }
  };

  const deleteGuest = async (guestId: string) => {
    if (!window.confirm("Bu misafiri silmek istediğinize emin misiniz?"))
      return;
    try {
      const res = await fetch(
        `/api/admin/websites/${customerId}/guests/${guestId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setGuests((prev) => prev.filter((g) => g._id !== guestId));
        toast.success("Misafir silindi");
      } else {
        toast.error("Silinemedi");
      }
    } catch {
      toast.error("Hata oluştu");
    }
  };

  const copyInviteCode = async () => {
    if (!customer?.inviteCode) return;
    try {
      await navigator.clipboard.writeText(customer.inviteCode);
      setCopiedCode(true);
      toast.success("Davet kodu kopyalandı");
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      toast.error("Kopyalanamadı");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <p className="text-center text-white/40 font-sans py-12">
        Website bulunamadı.
      </p>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <button
        onClick={() => router.push("/clodron/websiteleri")}
        className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors font-sans cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Websitelerine Dön
      </button>

      <h2 className="text-2xl font-chakra font-semibold text-white uppercase tracking-tight">
        {customer.bride.firstName} & {customer.groom.firstName}
      </h2>

      <div className="flex items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-sans transition-colors cursor-pointer",
              activeTab === tab.key
                ? "bg-white/10 text-white font-medium"
                : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "genel" && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-white/50" />
                <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70">
                  Çift Bilgileri
                </h3>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-white/50 font-sans">Gelin</span>
                <span className="text-sm text-white font-sans">
                  {customer.bride.firstName} {customer.bride.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-white/50 font-sans">Damat</span>
                <span className="text-sm text-white font-sans">
                  {customer.groom.firstName} {customer.groom.lastName}
                </span>
              </div>
              <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/50 font-sans flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Tarih
                  </span>
                  <span className="text-sm text-white font-sans">
                    {new Date(customer.weddingDate).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {customer.weddingTime && (
                  <div className="flex justify-between">
                    <span className="text-sm text-white/50 font-sans">
                      Saat
                    </span>
                    <span className="text-sm text-white font-sans">
                      {customer.weddingTime}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-white/50" />
                <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70">
                  Mekan & Kod
                </h3>
              </div>
              {customer.venueName && (
                <div className="flex justify-between">
                  <span className="text-sm text-white/50 font-sans">Mekan</span>
                  <span className="text-sm text-white font-sans">
                    {customer.venueName}
                  </span>
                </div>
              )}
              {customer.venueAddress && (
                <div className="flex justify-between">
                  <span className="text-sm text-white/50 font-sans">Adres</span>
                  <span className="text-sm text-white font-sans text-right max-w-[60%]">
                    {customer.venueAddress}
                  </span>
                </div>
              )}
              <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/50 font-sans flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" /> Davet Kodu
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-mono font-sans">
                      {customer.inviteCode || "—"}
                    </span>
                    {customer.inviteCode && (
                      <button
                        onClick={copyInviteCode}
                        className="text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                      >
                        {copiedCode ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/50 font-sans flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Görüntülenme
                  </span>
                  <span className="text-sm text-white font-sans">
                    {customer.invitationViews}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {order && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-white/50" />
                <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70">
                  Sipariş Veren
                </h3>
              </div>
              {order.userEmail && (
                <div className="flex justify-between">
                  <span className="text-sm text-white/50 font-sans">E-posta</span>
                  <span className="text-sm text-white font-sans">
                    {order.userEmail}
                  </span>
                </div>
              )}
              {order.userPhone && (
                <div className="flex justify-between">
                  <span className="text-sm text-white/50 font-sans">Telefon</span>
                  <span className="text-sm text-white font-sans">
                    {order.userPhone}
                  </span>
                </div>
              )}
              <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-white/50 font-sans">Tema</span>
                  <span className="text-sm text-white font-sans capitalize">
                    {order.selectedTheme}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/50 font-sans">Paket</span>
                  <span className="text-sm text-white font-sans font-semibold font-chakra uppercase">
                    {order.selectedPackage === "starter"
                      ? "Başlangıç"
                      : order.selectedPackage === "pro"
                      ? "Pro"
                      : "Elit"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {(customer.brideFamily || customer.groomFamily) && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-white/50" />
                <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70">
                  Aile Bilgileri
                </h3>
              </div>
              {customer.brideFamily && (
                <div>
                  <p className="text-xs text-white/40 font-sans mb-1">
                    Gelin Ailesi
                  </p>
                  <p className="text-sm text-white/70 font-sans">
                    {customer.brideFamily.father.firstName}{" "}
                    {customer.brideFamily.father.lastName} &{" "}
                    {customer.brideFamily.mother.firstName}{" "}
                    {customer.brideFamily.mother.lastName}
                  </p>
                </div>
              )}
              {customer.groomFamily && (
                <div>
                  <p className="text-xs text-white/40 font-sans mb-1">
                    Damat Ailesi
                  </p>
                  <p className="text-sm text-white/70 font-sans">
                    {customer.groomFamily.father.firstName}{" "}
                    {customer.groomFamily.father.lastName} &{" "}
                    {customer.groomFamily.mother.firstName}{" "}
                    {customer.groomFamily.mother.lastName}
                  </p>
                </div>
              )}
            </div>
          )}

          {customer.eventSchedule && customer.eventSchedule.length > 0 && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <ListChecks className="w-4 h-4 text-white/50" />
                <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70">
                  Etkinlik Programı
                </h3>
              </div>
              {customer.eventSchedule.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-sm text-white/50 font-sans">
                    {item.time}
                  </span>
                  <span className="text-sm text-white/70 font-sans">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-white/50" />
              <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70">
                Özel Domain
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="ornek.davetiye.com"
                className="flex-1 h-10 rounded-xl border border-white/10 bg-white/[0.02] px-4 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-hidden transition-all font-sans"
              />
              <button
                onClick={saveDomain}
                disabled={savingDomain}
                className="h-10 px-5 rounded-xl bg-white/10 text-white text-sm font-sans hover:bg-white/20 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {savingDomain ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Kaydet
              </button>
            </div>
          </div>

          <a
            href="/lavanta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors font-sans"
          >
            <ExternalLink className="w-4 h-4" />
            Websiteyi Önizle
          </a>
        </div>
      )}

      {activeTab === "galeri" && (
        <div>
          {photos.length === 0 ? (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-12 text-center">
              <ImageIcon className="w-8 h-8 text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/40 font-sans">
                Henüz fotoğraf yüklenmemiş.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {photos.map((photo) => (
                <div
                  key={photo._id}
                  className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden group"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={photo.thumbnailUrl || photo.url}
                      alt={photo.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-3 space-y-1.5">
                    <p className="text-xs text-white/70 font-sans truncate">
                      {photo.uploader || "Anonim"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/30 font-sans">
                        {new Date(photo.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                      <span className="text-[10px] text-white/30 font-sans">
                        {formatBytes(photo.size)}
                      </span>
                    </div>
                    <button
                      onClick={() => deletePhoto(photo._id)}
                      className="w-full mt-1 h-7 rounded-lg bg-red-500/10 text-red-400 text-xs font-sans hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "ani" && (
        <div>
          {memories.length === 0 ? (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-12 text-center">
              <BookOpen className="w-8 h-8 text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/40 font-sans">
                Henüz anı yazılmamış.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {memories.map((entry) => (
                <div
                  key={entry._id}
                  className="bg-white/[0.03] border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="text-sm font-medium text-white font-sans">
                          {entry.authorName}
                        </p>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-sans",
                            entry.approved
                              ? "bg-green-500/20 text-green-300"
                              : "bg-amber-500/20 text-amber-300"
                          )}
                        >
                          {entry.approved ? "Onaylı" : "Bekliyor"}
                        </span>
                      </div>
                      <p className="text-sm text-white/60 font-sans line-clamp-2">
                        {entry.message}
                      </p>
                      <p className="text-xs text-white/30 font-sans mt-1.5">
                        {new Date(entry.createdAt).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleMemoryApproval(entry)}
                        className={cn(
                          "h-8 px-3 rounded-lg text-xs font-sans transition-colors flex items-center gap-1.5 cursor-pointer",
                          entry.approved
                            ? "bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                            : "bg-green-500/10 text-green-300 hover:bg-green-500/20"
                        )}
                      >
                        {entry.approved ? (
                          <>
                            <XCircle className="w-3.5 h-3.5" /> Kaldır
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" /> Onayla
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => deleteMemory(entry._id)}
                        className="h-8 px-3 rounded-lg bg-red-500/10 text-red-400 text-xs font-sans hover:bg-red-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "misafirler" && (
        <div>
          {guests.length === 0 ? (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-12 text-center">
              <Users className="w-8 h-8 text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/40 font-sans">
                Henüz misafir eklenmemiş.
              </p>
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-xs text-white/40 font-sans font-medium px-4 py-3">
                        Ad Soyad
                      </th>
                      <th className="text-left text-xs text-white/40 font-sans font-medium px-4 py-3">
                        Telefon
                      </th>
                      <th className="text-left text-xs text-white/40 font-sans font-medium px-4 py-3">
                        LCV Durumu
                      </th>
                      <th className="text-center text-xs text-white/40 font-sans font-medium px-4 py-3">
                        Kişi
                      </th>
                      <th className="text-left text-xs text-white/40 font-sans font-medium px-4 py-3">
                        Kaynak
                      </th>
                      <th className="text-left text-xs text-white/40 font-sans font-medium px-4 py-3">
                        Not
                      </th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {guests.map((guest) => {
                      const rsvp =
                        rsvpLabels[guest.rsvpStatus] || rsvpLabels.pending;
                      return (
                        <tr
                          key={guest._id}
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-white font-sans">
                            {guest.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-white/60 font-sans">
                            {guest.phone || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "text-xs px-2.5 py-1 rounded-full font-sans",
                                rsvp.color
                              )}
                            >
                              {rsvp.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-white/60 font-sans text-center">
                            {guest.guestCount}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/50 font-sans">
                              {sourceLabels[guest.source] || guest.source}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-white/40 font-sans max-w-[150px] truncate">
                            {guest.note || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => deleteGuest(guest._id)}
                              className="h-7 px-2.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-sans hover:bg-red-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              Sil
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
