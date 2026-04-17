"use client";

interface HaloIconProps { className?: string; size?: number; }

export function HaloIcon({ className, size = 24 }: HaloIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2 L12 6" strokeDasharray="1 2" />
      <path d="M12 18 L12 22" strokeDasharray="1 2" />
      <path d="M2 12 L6 12" strokeDasharray="1 2" />
      <path d="M18 12 L22 12" strokeDasharray="1 2" />
      <circle cx="12" cy="12" r="8" strokeDasharray="2 3" opacity="0.5" />
    </svg>
  );
}
