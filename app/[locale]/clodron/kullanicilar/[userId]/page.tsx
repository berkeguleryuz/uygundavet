"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Mail,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Ban,
  KeyRound,
  LogOut,
  LogIn,
  Package,
  User as UserIcon,
  Globe,
  Smartphone,
  ExternalLink,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UserDetail {
  _id: string;
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  locale: string | null;
  disabled: boolean;
  disabledAt: string | null;
  adminNotes: string;
  createdAt: string | null;
  updatedAt: string | null;
}

interface OrderRow {
  _id: string;
  selectedPackage: string;
  paymentStatus: string;
  totalAmount: number;
  paidAmount: number;
  createdAt: string;
}

interface CustomerRow {
  _id: string;
  customDomain?: string;
  inviteCode?: string;
  weddingDate?: string;
  bride?: { firstName?: string; lastName?: string };
  groom?: { firstName?: string; lastName?: string };
}

interface SessionRow {
  _id: string;
  token: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: string | null;
  createdAt: string | null;
}

interface AccountRow {
  providerId: string;
  accountId: string;
  createdAt: string | null;
}

const packageLabel = (p: string) =>
  p === "starter" ? "Başlangıç" : p === "pro" ? "Pro" : p === "business" ? "Elit" : p;

const statusLabel = (s: string) =>
  s === "pending" ? "Bekliyor" : s === "deposit_paid" ? "Kapora Ödendi" : s === "fully_paid" ? "Tam Ödendi" : s;

const statusTone = (s: string) =>
  s === "fully_paid"
    ? "text-emerald-300 bg-emerald-500/15 border-emerald-500/30"
    : s === "deposit_paid"
      ? "text-orange-300 bg-orange-500/15 border-orange-500/30"
      : "text-white/50 bg-white/5 border-white/10";

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [customer, setCustomer] = useState<CustomerRow | null>(null);
  const [guestCount, setGuestCount] = useState(0);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [adminNotes, setAdminNotes] = useState("");

  const reload = () => {
    setLoading(true);
    fetch(`/api/admin/users/${userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setAdminNotes(data.user.adminNotes || "");
          setOrders(data.orders || []);
          setCustomer(data.customer || null);
          setGuestCount(data.guestCount || 0);
          setSessions(data.sessions || []);
          setAccounts(data.accounts || []);
        }
      })
      .catch(() => toast.error("Veri alınamadı"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const toggleDisabled = async () => {
    if (!user) return;
    const next = !user.disabled;
    if (next && !confirm("Bu kullanıcıyı deaktif etmek istediğine emin misin? Aktif oturumları kapatılacak.")) return;
    setWorking("disable");
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disabled: next }),
      });
      if (res.ok) {
        toast.success(next ? "Kullanıcı deaktif edildi" : "Kullanıcı tekrar aktif");
        reload();
      } else {
        toast.error("İşlem başarısız");
      }
    } finally {
      setWorking(null);
    }
  };

  const impersonate = async () => {
    if (!user) return;
    if (!confirm(`${user.email} olarak giriş yapılacak. Admin oturumun saklanacak; dashboard'da çıkış yapınca admin'e döneceksin.`)) return;
    setWorking("impersonate");
    try {
      const res = await fetch(`/api/admin/users/${userId}/impersonate`, { method: "POST" });
      if (res.ok) {
        toast.success("Giriş yapılıyor...");
        window.location.href = "/dashboard";
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Giriş yapılamadı");
      }
    } finally {
      setWorking(null);
    }
  };

  const sendResetPassword = async () => {
    if (!user) return;
    if (!confirm(`${user.email} adresine şifre sıfırlama maili gönderilsin mi?`)) return;
    setWorking("reset");
    try {
      const res = await fetch(`/api/admin/users/${userId}/reset-password`, { method: "POST" });
      if (res.ok) {
        toast.success("Şifre sıfırlama maili gönderildi");
      } else {
        toast.error("Mail gönderilemedi");
      }
    } finally {
      setWorking(null);
    }
  };

  const revokeSessions = async () => {
    if (!confirm("Tüm aktif oturumlar kapatılsın mı?")) return;
    setWorking("revoke");
    try {
      const res = await fetch(`/api/admin/users/${userId}/sessions`, { method: "DELETE" });
      if (res.ok) {
        const data = await res.json();
        toast.success(`${data.deleted ?? 0} oturum kapatıldı`);
        reload();
      } else {
        toast.error("İşlem başarısız");
      }
    } finally {
      setWorking(null);
    }
  };

  const saveNotes = async () => {
    setWorking("notes");
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });
      if (res.ok) toast.success("Notlar kaydedildi");
      else toast.error("Kaydedilemedi");
    } finally {
      setWorking(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <p className="text-center text-white/40 font-sans py-12">Kullanıcı bulunamadı.</p>;
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <button
        onClick={() => router.push("/clodron/kullanicilar")}
        className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors font-sans cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Kullanıcılara Dön
      </button>

      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
            <UserIcon className="w-6 h-6 text-white/50" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-chakra font-semibold text-white uppercase tracking-tight">
                {user.name || "İsimsiz Kullanıcı"}
              </h2>
              {user.disabled ? (
                <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-red-300 bg-red-500/15 border border-red-500/30 rounded-full px-2 py-0.5 font-sans">
                  <Ban className="w-3 h-3" /> Deaktif
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-2 py-0.5 font-sans">
                  <ShieldCheck className="w-3 h-3" /> Aktif
                </span>
              )}
              {user.emailVerified ? (
                <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-blue-300 bg-blue-500/15 border border-blue-500/30 rounded-full px-2 py-0.5 font-sans">
                  Doğrulanmış
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-amber-300 bg-amber-500/15 border border-amber-500/30 rounded-full px-2 py-0.5 font-sans">
                  <ShieldAlert className="w-3 h-3" /> Doğrulanmamış
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Mail className="w-3 h-3 text-white/30" />
              <span className="text-sm text-white/50 font-sans">{user.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={impersonate}
            disabled={!!working || user.disabled}
            title={user.disabled ? "Deaktif kullanıcı olarak giriş yapılamaz" : "Bu kullanıcı olarak dashboard'a gir"}
            className="h-10 px-4 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-200 hover:bg-blue-500/25 text-sm font-sans transition-colors disabled:opacity-30 cursor-pointer flex items-center gap-2"
          >
            {working === "impersonate" ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            Bu Kullanıcı Olarak Gir
          </button>
          <button
            onClick={sendResetPassword}
            disabled={!!working}
            className="h-10 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white/80 font-sans transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {working === "reset" ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            Şifre Sıfırlama Maili
          </button>
          <button
            onClick={revokeSessions}
            disabled={!!working || sessions.length === 0}
            className="h-10 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white/80 font-sans transition-colors disabled:opacity-30 cursor-pointer flex items-center gap-2"
          >
            {working === "revoke" ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            Oturumları Kapat ({sessions.length})
          </button>
          <button
            onClick={toggleDisabled}
            disabled={!!working}
            className={cn(
              "h-10 px-4 rounded-xl border text-sm font-sans transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2",
              user.disabled
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25"
                : "bg-red-500/15 border-red-500/30 text-red-300 hover:bg-red-500/25"
            )}
          >
            {working === "disable" ? <Loader2 className="w-4 h-4 animate-spin" /> : user.disabled ? <ShieldCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
            {user.disabled ? "Tekrar Aktif Et" : "Deaktif Et"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-300 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-200/80 font-sans leading-relaxed">
          Şifreler bcrypt ile hash&apos;lenmiş halde saklanır, bu yüzden açık metin olarak görüntülenemez. Kullanıcı şifresini unutmuşsa
          <span className="font-semibold"> Şifre Sıfırlama Maili </span>
          butonuyla mail gönderebilirsin. Acil müdahale gerekirse <span className="font-semibold">Deaktif Et</span> kullanıcının tüm oturumlarını anında kapatır.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <UserIcon className="w-4 h-4 text-white/50" />
            <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70">Hesap Bilgisi</h3>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-white/50 font-sans">Kullanıcı ID</span>
            <span className="text-xs text-white/70 font-mono break-all max-w-[60%] text-right">{user._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-white/50 font-sans">İsim</span>
            <span className="text-sm text-white font-sans">{user.name || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-white/50 font-sans">E-posta</span>
            <span className="text-sm text-white font-sans">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-white/50 font-sans">Dil</span>
            <span className="text-sm text-white font-sans">{user.locale || "tr"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-white/50 font-sans">Kayıt Tarihi</span>
            <span className="text-sm text-white font-sans flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {user.createdAt ? new Date(user.createdAt).toLocaleString("tr-TR") : "—"}
            </span>
          </div>
          {user.disabled && user.disabledAt && (
            <div className="flex justify-between">
              <span className="text-sm text-white/50 font-sans">Deaktif Edildi</span>
              <span className="text-sm text-red-300 font-sans">
                {new Date(user.disabledAt).toLocaleString("tr-TR")}
              </span>
            </div>
          )}
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-white/50" />
            <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70">
              Bağlı Hesaplar ({accounts.length})
            </h3>
          </div>
          {accounts.length === 0 ? (
            <p className="text-sm text-white/40 font-sans">Bağlı hesap yok.</p>
          ) : (
            accounts.map((a, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm text-white/70 font-sans capitalize">
                  {a.providerId === "credential" ? "E-posta + Şifre" : a.providerId}
                </span>
                <span className="text-xs text-white/40 font-sans">
                  {a.createdAt ? new Date(a.createdAt).toLocaleDateString("tr-TR") : "—"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-white/50" />
            <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70">
              Siparişler ({orders.length})
            </h3>
          </div>
          {customer && (
            <div className="flex items-center gap-2 text-[11px] text-white/40 font-sans">
              <span>Misafir: {guestCount}</span>
              {customer.customDomain && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3" /> {customer.customDomain}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {orders.length === 0 ? (
          <p className="text-sm text-white/40 font-sans">Sipariş yok.</p>
        ) : (
          <div className="space-y-2">
            {orders.map((o) => (
              <button
                key={o._id}
                onClick={() => router.push(`/clodron/siparisler/${o._id}`)}
                className="w-full flex items-center justify-between gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-chakra uppercase tracking-wider text-white font-semibold">
                    {packageLabel(o.selectedPackage)}
                  </span>
                  <span className={cn("text-[10px] uppercase tracking-wider rounded-full border px-1.5 py-0.5 font-sans", statusTone(o.paymentStatus))}>
                    {statusLabel(o.paymentStatus)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/50 font-sans">
                    {o.paidAmount.toLocaleString("tr-TR")}₺ / {o.totalAmount.toLocaleString("tr-TR")}₺
                  </span>
                  <span className="text-[10px] text-white/30 font-sans">
                    {new Date(o.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                  <ExternalLink className="w-3 h-3 text-white/30" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {customer && (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-white/50" />
              <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70">Davet Sitesi</h3>
            </div>
            <button
              onClick={() => router.push(`/clodron/websiteleri/${customer._id}`)}
              className="text-xs text-white/60 hover:text-white font-sans flex items-center gap-1 cursor-pointer"
            >
              Detay <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            {customer.bride && (
              <div className="flex justify-between">
                <span className="text-sm text-white/50 font-sans">Gelin</span>
                <span className="text-sm text-white font-sans">
                  {customer.bride.firstName} {customer.bride.lastName}
                </span>
              </div>
            )}
            {customer.groom && (
              <div className="flex justify-between">
                <span className="text-sm text-white/50 font-sans">Damat</span>
                <span className="text-sm text-white font-sans">
                  {customer.groom.firstName} {customer.groom.lastName}
                </span>
              </div>
            )}
            {customer.weddingDate && (
              <div className="flex justify-between">
                <span className="text-sm text-white/50 font-sans">Düğün</span>
                <span className="text-sm text-white font-sans">
                  {new Date(customer.weddingDate).toLocaleDateString("tr-TR")}
                </span>
              </div>
            )}
            {customer.inviteCode && (
              <div className="flex justify-between">
                <span className="text-sm text-white/50 font-sans">Davet Kodu</span>
                <span className="text-sm text-white font-mono">{customer.inviteCode}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Smartphone className="w-4 h-4 text-white/50" />
          <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70">
            Aktif Oturumlar ({sessions.length})
          </h3>
        </div>
        {sessions.length === 0 ? (
          <p className="text-sm text-white/40 font-sans">Aktif oturum yok.</p>
        ) : (
          <div className="space-y-2">
            {sessions.map((s) => (
              <div
                key={s._id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-white/70 font-sans truncate">
                    {s.userAgent || "Bilinmeyen istemci"}
                  </p>
                  <p className="text-[10px] text-white/40 font-mono mt-0.5">
                    {s.ipAddress || "—"} {s.token ? `· ${s.token}` : ""}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-white/40 font-sans">
                    Başlangıç: {s.createdAt ? new Date(s.createdAt).toLocaleDateString("tr-TR") : "—"}
                  </p>
                  <p className="text-[10px] text-white/40 font-sans">
                    Bitiş: {s.expiresAt ? new Date(s.expiresAt).toLocaleDateString("tr-TR") : "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
        <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70 mb-3">Admin Notları</h3>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Bu kullanıcı hakkında not ekle..."
          className="w-full h-24 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-hidden transition-all font-sans resize-none"
        />
        <button
          onClick={saveNotes}
          disabled={!!working}
          className="mt-3 h-9 px-6 rounded-lg bg-white/10 text-white text-sm font-sans hover:bg-white/20 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
        >
          {working === "notes" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Kaydet"}
        </button>
      </div>
    </div>
  );
}
