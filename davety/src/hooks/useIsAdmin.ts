"use client";

import { useEffect, useState } from "react";

/**
 * Client-side admin tespiti. /api/admin/whoami'a tek istek atar,
 * sonucu modül-içi cache'te tutar (sayfada birden fazla bileşen
 * çağırırsa tekrar fetch etmesin diye). Yetki kontrolünün asıl yeri
 * server endpoint'leri (isAdminSession), bu hook sadece UI'yı şartlı
 * göstermek için.
 */
let cached: boolean | null = null;
let inflight: Promise<boolean> | null = null;

async function fetchAdminFlag(): Promise<boolean> {
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

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(cached);
  useEffect(() => {
    let alive = true;
    fetchAdminFlag().then((v) => {
      if (alive) setIsAdmin(v);
    });
    return () => {
      alive = false;
    };
  }, []);
  return isAdmin;
}
