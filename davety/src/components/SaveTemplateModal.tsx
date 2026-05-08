"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import type { InvitationDoc } from "@davety/schema";

interface Props {
  /** Modal açık olduğu süre boyunca mount edilir, parent open=false
   *  yaptığında unmount olur. State her açılışta fresh, useEffect
   *  reset gerekmez. */
  onClose: () => void;
  /** Mevcut editor doc'u, snapshot olarak template'e gönderilir. */
  doc: InvitationDoc;
}

/** Curated kategori havuzu. Yeni etkinlik tipi gerekirse buraya
 *  eklenir, dropdown'a hemen yansır. id alanı DB'ye yazılan değer,
 *  label kullanıcıya gösterilen Türkçe etiket. */
const CATEGORY_OPTIONS: { id: string; label: string }[] = [
  { id: "wedding", label: "Düğün" },
  { id: "engagement", label: "Nişan" },
  { id: "henna", label: "Kına" },
  { id: "betrothal", label: "Söz" },
  { id: "birthday", label: "Doğum Günü" },
  { id: "circumcision", label: "Sünnet" },
  { id: "baby-shower", label: "Baby Shower" },
  { id: "graduation", label: "Mezuniyet" },
  { id: "anniversary", label: "Yıl Dönümü" },
  { id: "general", label: "Genel" },
];

/** Doc'tan default başlık üret. Hero bloğundan gelin/damat adlarını
 *  bulur, "Aslı & Kaan Şablonu" gibi okunabilir bir başlık kurar.
 *  İki ad da varsa "X & Y Şablonu", sadece biri varsa "X Şablonu",
 *  hiçbiri yoksa "Yeni Şablon" döner. Kullanıcı modal'da serbestçe
 *  düzenleyebilir. */
function deriveDefaultTitle(doc: InvitationDoc): string {
  const hero = doc.blocks.find((b) => b.type === "hero");
  if (hero) {
    const data = hero.data as { brideName?: string; groomName?: string };
    const bride = (data.brideName ?? "").trim();
    const groom = (data.groomName ?? "").trim();
    // "Gelin" / "Damat" placeholder'lar default doc'tan gelir, boş
    // başlık demek.
    const isPlaceholder = (s: string) =>
      !s ||
      s === "Gelin" ||
      s === "Damat" ||
      s === "Bride" ||
      s === "Groom";
    const realBride = isPlaceholder(bride) ? "" : bride;
    const realGroom = isPlaceholder(groom) ? "" : groom;
    if (realBride && realGroom) return `${realBride} & ${realGroom} Şablonu`;
    if (realBride) return `${realBride} Şablonu`;
    if (realGroom) return `${realGroom} Şablonu`;
  }
  return "Yeni Şablon";
}

/**
 * Admin için "Şablon Olarak Kaydet" modalı. Mevcut editor doc'unu bir
 * DesignTemplate kaydına çevirir. POST /api/admin/templates ile
 * yetkilendirilen kullanıcı template oluşturur, daha sonra
 * /admin/templates ekranından preview görsel + yayınla toggle ile
 * canlıya alır. Kullanıcı tarafı /design/new sayfasında yayınlananları
 * görür.
 */
export function SaveTemplateModal({ onClose, doc }: Props) {
  const [title, setTitle] = useState(() => deriveDefaultTitle(doc));
  const [userSlug, setUserSlug] = useState("");
  const [description, setDescription] = useState("");
  // Default kategori "wedding". Çoğu davetiye düğün için, kullanıcı
  // farklı bir etkinlik için şablon kaydederse dropdown'dan değiştirir.
  const [category, setCategory] = useState<string>("wedding");
  const [busy, setBusy] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [open, setOpen] = useState(true);

  // Slug derived: kullanıcı slug alanına dokunduysa kendi yazdığı,
  // dokunmadıysa title'dan otomatik üretilen.
  const slug = slugTouched ? userSlug : slugify(title);

  function close() {
    setOpen(false);
  }

  async function handleSave() {
    if (!title.trim() || !slug.trim()) {
      toast.error("Başlık ve slug zorunlu");
      return;
    }
    setBusy(true);
    try {
      const r = await fetch("/api/admin/templates", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim().toLowerCase(),
          title: title.trim(),
          description: description.trim() || undefined,
          category: category.trim() || undefined,
          doc,
        }),
      });
      if (r.status === 409) {
        toast.error("Bu slug zaten kullanılıyor, farklı bir tane seç");
        return;
      }
      if (!r.ok) {
        const j = await r.json().catch(() => null);
        toast.error(j?.error ?? "Kaydedilemedi");
        return;
      }
      toast.success("Şablon kaydedildi", {
        description: "/admin/templates sayfasından görsel ekleyip yayınlayabilirsin",
      });
      close();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v) => {
        if (!v) close();
      }}
    >
      <AnimatePresence onExitComplete={onClose}>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4"
              >
                <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-5 flex flex-col gap-4">
                  <header className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <div className="size-9 rounded-full bg-amber-50 border border-amber-200 inline-flex items-center justify-center text-amber-600 shrink-0">
                        <Sparkles className="size-4" />
                      </div>
                      <div>
                        <Dialog.Title className="font-display text-lg leading-tight">
                          Şablon Olarak Kaydet
                        </Dialog.Title>
                        <Dialog.Description className="mt-1 text-xs text-muted-foreground leading-snug">
                          Mevcut tasarımı yeni bir şablon olarak kaydet.
                          Daha sonra /admin/templates&apos;den önizleme görseli
                          ekleyip yayınlayabilirsin.
                        </Dialog.Description>
                      </div>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        className="rounded-full p-1.5 hover:bg-muted shrink-0"
                        aria-label="Kapat"
                      >
                        <X className="size-4" />
                      </button>
                    </Dialog.Close>
                  </header>

                  <div className="flex flex-col gap-3">
                    <Field label="Başlık (zorunlu)">
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Romantik Bahar Düğünü"
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        autoFocus
                      />
                    </Field>

                    <Field label="Slug (zorunlu, küçük harf + tire)">
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => {
                          setUserSlug(e.target.value);
                          setSlugTouched(true);
                        }}
                        placeholder="romantik-bahar-dugunu"
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </Field>

                    <Field label="Kategori">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                      >
                        {CATEGORY_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Açıklama (opsiyonel)">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Çiçekli, pastel tonlarda romantik bir tasarım"
                        rows={2}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                      />
                    </Field>
                  </div>

                  <footer className="flex items-center justify-end gap-2 pt-2">
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        disabled={busy}
                        className="rounded-full border border-border px-4 py-2 text-xs font-chakra uppercase tracking-[0.15em] hover:bg-muted disabled:opacity-50"
                      >
                        Vazgeç
                      </button>
                    </Dialog.Close>
                    <button
                      type="button"
                      disabled={busy || !title.trim() || !slug.trim()}
                      onClick={handleSave}
                      className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-chakra uppercase tracking-[0.15em] hover:opacity-90 disabled:opacity-50"
                    >
                      {busy ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                  </footer>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </span>
      {children}
    </label>
  );
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
