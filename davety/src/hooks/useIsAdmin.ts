"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/src/lib/auth-client";

/**
 * Client-side admin tespiti. /api/admin/whoami'a tek istek atar,
 * sonucu modül-içi cache'te tutar (sayfada birden fazla bileşen
 * çağırırsa tekrar fetch etmesin diye). Yetki kontrolünün asıl yeri
 * server endpoint'leri (isAdminSession), bu hook sadece UI'yı şartlı
 * göstermek için.
 *
 * Cache user session'a bağlı; logout/login yapan kullanıcı için
 * invalidate edilmeli, aksi halde non-admin'e admin UI gösterilir.
 * resetAdminCache export'lu — auth flow'lar logout sırasında
 * çağırabilir, ya da useEffect içinde session.user.id değiştiğinde
 * cache temizlenir.
 */
let cached: boolean | null = null;
let inflight: Promise<boolean> | null = null;
let cachedUserId: string | null = null;

async function fetchAdminFlag(currentUserId: string | null): Promise<boolean> {
  // User değiştiyse cache geçersiz.
  if (currentUserId !== cachedUserId) {
    cached = null;
    inflight = null;
    cachedUserId = currentUserId;
  }
  if (cached !== null) return cached;
  if (!inflight) {
    inflight = fetch("/api/admin/whoami", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { isAdmin: false }))
      .then((j: { isAdmin?: boolean }) => {
        cached = !!j.isAdmin;
        inflight = null;
        return cached;
      })
      .catch(() => {
        cached = false;
        inflight = null;
        return false;
      });
  }
  return inflight;
}

export function resetAdminCache() {
  cached = null;
  inflight = null;
  cachedUserId = null;
}

export function useIsAdmin() {
  const session = useSession();
  const userId = session?.data?.user?.id ?? null;
  const [isAdmin, setIsAdmin] = useState<boolean | null>(
    userId === cachedUserId ? cached : null,
  );
  useEffect(() => {
    let alive = true;
    fetchAdminFlag(userId).then((v) => {
      if (alive) setIsAdmin(v);
    });
    return () => {
      alive = false;
    };
  }, [userId]);
  return isAdmin;
}
