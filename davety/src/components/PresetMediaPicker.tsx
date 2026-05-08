"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImageIcon } from "lucide-react";
import type { MediaRef } from "@davety/schema";

/**
 * /public/template-images/manifest.json'dan curated görsel havuzunu
 * çeker, modal içinde kategori sekmeleri ile gösterir. Kullanıcı bir
 * görseli seçtiğinde MediaRef döner (URL /public altından statik
 * servis edilir, R2'ye yüklenmez). Sadece resim, video desteklemiyor.
 */

interface ManifestItem {
  url: string;
  label?: string;
  width?: number;
  height?: number;
}

interface ManifestCategory {
  id: string;
  label: string;
  items: ManifestItem[];
}

interface Manifest {
  version: number;
  categories: ManifestCategory[];
}

interface Props {
  onClose: () => void;
  onPick: (media: MediaRef) => void;
}

// "Tümü" sentinel — özel kategori id, manifest'te bulunmaz; aktif
// olduğunda tüm kategorilerden gelen item'lar tek grid'de gösterilir.
const ALL_TAB_ID = "__all__";

export function PresetMediaPicker({ onClose, onPick }: Props) {
  const [open, setOpen] = useState(true);
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [loading, setLoading] = useState(true);
  // Default sekme "Tümü", kullanıcı arama yapmak yerine hepsine bakmak
  // isterse bu hızlı tarama deneyimini verir.
  const [activeTab, setActiveTab] = useState<string>(ALL_TAB_ID);

  useEffect(() => {
    fetch("/template-images/manifest.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((m: Manifest | null) => {
        setManifest(m);
      })
      .catch(() => setManifest(null))
      .finally(() => setLoading(false));
  }, []);

  function close() {
    setOpen(false);
  }

  function pick(item: ManifestItem) {
    onPick({
      url: item.url,
      width: item.width,
      height: item.height,
      mediaType: "image",
    });
    close();
  }

  // Aktif sekmenin gösterilecek item listesi: "Tümü" ise tüm kategorileri
  // birleştir, yoksa o kategorinin item'ları. Toplam ve label da burada
  // hesaplanıyor ki render kısmı tek bir yapıyla çalışsın.
  const totalItems =
    manifest?.categories.reduce((acc, c) => acc + c.items.length, 0) ?? 0;
  const activeItems: ManifestItem[] =
    activeTab === ALL_TAB_ID
      ? (manifest?.categories.flatMap((c) => c.items) ?? [])
      : (manifest?.categories.find((c) => c.id === activeTab)?.items ?? []);
  const activeLabel =
    activeTab === ALL_TAB_ID
      ? "Tümü"
      : (manifest?.categories.find((c) => c.id === activeTab)?.label ?? "");

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
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4"
              >
                <div className="w-full max-w-3xl max-h-[85vh] rounded-2xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden">
                  <header className="flex items-start justify-between gap-3 p-4 border-b border-border">
                    <div className="flex items-start gap-2">
                      <div className="size-9 rounded-full bg-muted inline-flex items-center justify-center text-muted-foreground shrink-0">
                        <ImageIcon className="size-4" />
                      </div>
                      <div>
                        <Dialog.Title className="font-display text-base leading-tight">
                          Hazır Görseller
                        </Dialog.Title>
                        <Dialog.Description className="mt-0.5 text-xs text-muted-foreground leading-snug">
                          Curated görsel havuzu. Kendi görselini yüklemek
                          istemiyorsan buradan seçebilirsin.
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

                  {manifest && manifest.categories.length > 0 ? (
                    /* Yatay scroll'lu tab şeridi. Her tab whitespace-nowrap,
                       container overflow-x-auto + scrollbar-thin. Sığmayanlar
                       için kullanıcı yatay kaydırabilir veya touchpad ile
                       gezebilir. İlk tab "Tümü" (ALL_TAB_ID), diğerleri
                       manifest sırasında. */
                    <div className="border-b border-border">
                      <div className="flex items-center gap-1 px-4 pt-3 overflow-x-auto scrollbar-thin">
                        <TabButton
                          active={activeTab === ALL_TAB_ID}
                          onClick={() => setActiveTab(ALL_TAB_ID)}
                          label="Tümü"
                          count={totalItems}
                        />
                        {manifest.categories.map((c) => (
                          <TabButton
                            key={c.id}
                            active={activeTab === c.id}
                            onClick={() => setActiveTab(c.id)}
                            label={c.label}
                            count={c.items.length}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                      <div className="text-center text-sm text-muted-foreground py-12">
                        Yükleniyor...
                      </div>
                    ) : !manifest ? (
                      <div className="text-center text-sm text-muted-foreground py-12">
                        Görsel havuzu yüklenemedi.
                      </div>
                    ) : activeItems.length === 0 ? (
                      <EmptyState category={activeLabel} />
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {activeItems.map((item) => (
                          <button
                            key={item.url}
                            type="button"
                            onClick={() => pick(item)}
                            className="group relative aspect-[3/4] overflow-hidden rounded-lg border border-border hover:border-primary transition cursor-pointer"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.url}
                              alt={item.label ?? ""}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              loading="lazy"
                            />
                            {item.label ? (
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                <span className="text-[10px] text-white font-medium">
                                  {item.label}
                                </span>
                              </div>
                            ) : null}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}

/**
 * Yatay scroll'lu tab şeridi içinde tek bir tab. Whitespace-nowrap ile
 * şeride sığmazsa kaydırılır, kompakt padding ile çok kategorili
 * setup'larda yer kazanır. Sayım rozeti label'ın yanında küçük
 * mute renkte.
 */
function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap text-xs font-chakra uppercase tracking-[0.12em] px-3 py-2 border-b-2 transition cursor-pointer ${
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
      {count > 0 ? (
        <span className="ml-1.5 text-[10px] opacity-60">{count}</span>
      ) : null}
    </button>
  );
}

function EmptyState({ category }: { category: string }) {
  return (
    <div className="text-center py-12 px-4">
      <div className="size-12 mx-auto rounded-full bg-muted inline-flex items-center justify-center mb-3">
        <ImageIcon className="size-5 text-muted-foreground" />
      </div>
      <div className="text-sm font-medium mb-1">
        {category} için henüz görsel yok
      </div>
      <div className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
        Görseller <code className="font-mono bg-muted px-1.5 py-0.5 rounded">public/template-images/</code>{" "}
        klasörüne eklenir, sonra{" "}
        <code className="font-mono bg-muted px-1.5 py-0.5 rounded">
          manifest.json
        </code>{" "}
        içine kayıt edilir. Yeni görsel eklemek istersen Claude&apos;a yolla,
        ekleyecektir.
      </div>
    </div>
  );
}
