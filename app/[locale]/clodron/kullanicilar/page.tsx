"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Mail, Calendar, ChevronRight, Ban } from "lucide-react";

interface UserEntry {
  _id: string;
  name?: string;
  email: string;
  createdAt: string;
  disabled?: boolean;
}

export default function KullanicilarPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => setUsers(data.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-chakra font-semibold text-white uppercase tracking-tight">
          Kullanıcılar
        </h2>
        <span className="text-sm text-white/40 font-sans">
          Toplam: {users.length}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <p className="text-center text-white/40 font-sans py-12">Kullanıcı bulunamadı.</p>
      ) : (
        <div className="space-y-2">
          {users.map((user) => (
            <button
              key={user._id}
              onClick={() => router.push(`/clodron/kullanicilar/${user._id}`)}
              className="w-full flex items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.05] hover:border-white/20 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white/50" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white font-sans">
                      {user.name || "İsimsiz"}
                    </p>
                    {user.disabled && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-red-300 bg-red-500/15 border border-red-500/30 rounded-full px-1.5 py-0.5 font-sans">
                        <Ban className="w-2.5 h-2.5" />
                        Deaktif
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3 h-3 text-white/30" />
                    <span className="text-xs text-white/40 font-sans">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-white/30" />
                  <span className="text-xs text-white/40 font-sans">
                    {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
