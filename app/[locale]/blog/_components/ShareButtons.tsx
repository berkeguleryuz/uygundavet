"use client";

import { toast } from "sonner";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;

  async function copy() {
    await navigator.clipboard.writeText(url);
    toast.success("Link kopyalandı");
  }

  return (
    <div className="flex gap-2">
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm">
        X
      </a>
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm">
        WhatsApp
      </a>
      <button onClick={copy} className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm">
        Linki Kopyala
      </button>
    </div>
  );
}
