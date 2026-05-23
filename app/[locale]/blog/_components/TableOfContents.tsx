"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string; level: 2 | 3 };

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -70% 0px" }
    );
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24 hidden lg:block text-sm">
      <p className="font-orbitron text-xs uppercase tracking-widest opacity-60 mb-3">İçindekiler</p>
      <ul className="space-y-2 border-l border-white/10 pl-4">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
            <a
              href={`#${h.id}`}
              className={`block transition-colors ${
                activeId === h.id ? "text-[#d5d1ad]" : "opacity-70 hover:opacity-100"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
