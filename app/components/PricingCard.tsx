"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { MorphButton } from "./MorphButton";

interface PricingCardProps {
  name: string;
  price: string;
  desc: string;
  cta: string;
  features: string[];
  badge?: string;
  highlighted?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  compact?: boolean;
}

export function PricingCard({
  name,
  price,
  desc,
  cta,
  features,
  badge,
  highlighted,
  selected,
  onSelect,
  compact,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-3xl border px-7 py-7 flex flex-col transition-all duration-300",
        highlighted
          ? "border-white/25 z-10 bg-white/[0.08] backdrop-blur-md"
          : "liquid-glass border-white/10",
        selected && "ring-2 ring-[#d5d1ad] border-[#d5d1ad]/50",
        compact && onSelect && "cursor-pointer hover:border-white/30",
        compact && "px-5 py-5"
      )}
      onClick={compact ? onSelect : undefined}
    >
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-[#252224] text-xs font-semibold font-sans px-4 py-1.5 rounded-full tracking-wide uppercase">
          {badge}
        </div>
      )}

      {selected && (
        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#d5d1ad] flex items-center justify-center">
          <Check className="w-3.5 h-3.5 text-[#252224]" strokeWidth={3} />
        </div>
      )}

      <h3 className={cn("font-chakra uppercase tracking-[0.15em] text-white mb-2", compact ? "text-base" : "text-lg")}>
        {name}
      </h3>

      <div className="flex items-baseline gap-1 mb-4">
        <span className={cn("font-chakra text-white font-bold", compact ? "text-2xl" : "text-4xl")}>
          {price}
        </span>
      </div>

      <p className={cn("font-sans text-white/60 leading-relaxed mb-6", compact ? "text-xs" : "text-sm")}>
        {desc}
      </p>

      <ul className={cn("flex flex-col gap-2 mb-6 flex-1", compact ? "gap-1.5" : "gap-2.5")}>
        {features.map((feature, idx) => (
          <li key={idx} className={cn("flex items-start gap-3 text-white/80 font-sans", compact ? "text-xs" : "text-sm")}>
            <Check className={cn("text-[#d5d1ad] shrink-0 mt-0.5", compact ? "w-3 h-3" : "w-4 h-4")} />
            <span>{feature.trim()}</span>
          </li>
        ))}
      </ul>

      {!compact && (
        <MorphButton
          variant={highlighted ? "filled" : "outline"}
          className="w-full"
          onClick={onSelect ? (e: React.MouseEvent) => { e.stopPropagation(); onSelect(); } : undefined}
        >
          {cta}
        </MorphButton>
      )}
    </div>
  );
}
