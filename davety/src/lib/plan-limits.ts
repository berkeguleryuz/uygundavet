/**
 * Tier-bazlı feature kuralları. Editor tarafında hiçbir kısıtlama
 * yapılmıyor (free kullanıcı her şeyi deneyip görsün), kurallar
 * SADECE publish anında `publishedDoc`'a uygulanır. Aktif kullanıcı
 * editor'de gallery'ye 30 foto eklerse Free pakette yayınladığında
 * yayın versiyonu 1 fotoğrafa trim edilir, ama editor'deki çalışma
 * dokümanı (`doc`) korunur (kullanıcı upgrade edince geri açılır).
 *
 * Tier'ı bir davetiye için satın alındıktan sonra DOWNGRADE edilemez.
 * Buradaki kurallar fiyatlandırma tablosundaki sözle birebir aynı
 * olmalı, kullanıcı ödediğinin eksiğini almasın.
 *
 * Kaynak: davetyolla.com fiyatlandırma sayfasındaki feature matrisi.
 */
import type { PlanTier } from "@davety/schema";

export interface PlanLimits {
  /** Galeri block'unda kalacak max medya sayısı. */
  galleryMaxItems: number;
  /** Misafirler galeri'ye fotoğraf ekleyebilir mi (Pro+ feature). */
  guestPhotoUploadEnabled: boolean;
  /** Hatıra defteri (memory_book) bloğu yayında kalır mı. */
  memoryBookEnabled: boolean;
  /** RSVP formu (rsvp_form) bloğu yayında kalır mı. */
  rsvpFormEnabled: boolean;
  /** Host RSVP cevap listesini dashboard'da görebilir mi. */
  rsvpReadEnabled: boolean;
  /** Özel bloklar (event_program, families, story_timeline,
   *  custom_section) yayında kalır mı. Free'de bu bloklar yayın
   *  versiyonundan çıkarılır, hero/countdown/venue gibi temel bloklar
   *  her tier'da kalır. */
  customBlocksEnabled: boolean;
  /** Davetiyede DavetYolla tanıtım bölümü gösterilir mi. */
  showsBranding: boolean;
  /** Vanity path (özel kısa link) kullanılabilir mi. */
  vanityPathEnabled: boolean;
  /** Arkaplan müziği yayında çalar mı.
   *  off = Free, bgMusicUrl temizlenir.
   *  preset-only = Klasik, sadece kütüphaneden seçilmiş 1 parça.
   *  full = Pro+, tüm kütüphane + custom URL serbest. */
  backgroundMusicMode: "off" | "preset-only" | "full";
  /** Custom domain kullanılabilir mi (Premium only). */
  customDomainEnabled: boolean;
  /** Çok sayfalı web sitesi (Premium only, ileri seviye scaffold). */
  multiPageEnabled: boolean;
}

const LIMITS: Record<PlanTier, PlanLimits> = {
  free: {
    galleryMaxItems: 1,
    guestPhotoUploadEnabled: false,
    memoryBookEnabled: false,
    rsvpFormEnabled: false,
    rsvpReadEnabled: false,
    customBlocksEnabled: false,
    showsBranding: true,
    vanityPathEnabled: false,
    backgroundMusicMode: "off",
    customDomainEnabled: false,
    multiPageEnabled: false,
  },
  basic: {
    galleryMaxItems: 20,
    guestPhotoUploadEnabled: false,
    memoryBookEnabled: false,
    rsvpFormEnabled: false,
    rsvpReadEnabled: false,
    customBlocksEnabled: true,
    showsBranding: false,
    vanityPathEnabled: true,
    backgroundMusicMode: "preset-only",
    customDomainEnabled: false,
    multiPageEnabled: false,
  },
  pro: {
    galleryMaxItems: 100,
    guestPhotoUploadEnabled: true,
    memoryBookEnabled: true,
    rsvpFormEnabled: true,
    rsvpReadEnabled: true,
    customBlocksEnabled: true,
    showsBranding: false,
    vanityPathEnabled: true,
    backgroundMusicMode: "full",
    customDomainEnabled: false,
    multiPageEnabled: false,
  },
  premium: {
    galleryMaxItems: 500,
    guestPhotoUploadEnabled: true,
    memoryBookEnabled: true,
    rsvpFormEnabled: true,
    rsvpReadEnabled: true,
    customBlocksEnabled: true,
    showsBranding: false,
    vanityPathEnabled: true,
    backgroundMusicMode: "full",
    customDomainEnabled: true,
    multiPageEnabled: true,
  },
};

/** "Özel" sayılan blok tipleri. Free pakette yayında çıkarılır. */
export const CUSTOM_BLOCK_TYPES: ReadonlySet<string> = new Set([
  "event_program",
  "families",
  "story_timeline",
  "custom_section",
]);

export function tierOrFree(tier: PlanTier | undefined | null): PlanTier {
  return tier ?? "free";
}

export function planLimitsFor(tier: PlanTier | undefined | null): PlanLimits {
  return LIMITS[tierOrFree(tier)];
}

/** Friendly label for upgrade prompts ("Klasik+", "Pro+"). */
export function nextTierLabel(tier: PlanTier | undefined | null): string {
  switch (tierOrFree(tier)) {
    case "free":
      return "Klasik+";
    case "basic":
      return "Pro+";
    case "pro":
      return "Premium";
    case "premium":
      return "Premium";
  }
}
