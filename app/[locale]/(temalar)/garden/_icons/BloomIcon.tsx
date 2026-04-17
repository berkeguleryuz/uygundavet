"use client";

interface BloomIconProps {
  className?: string;
  size?: number;
}

export function BloomIcon({ className, size = 24 }: BloomIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="2.4" />
      <path d="M12 2c1.8 2 1.8 5 0 7-1.8-2-1.8-5 0-7Z" />
      <path d="M22 12c-2 1.8-5 1.8-7 0 2-1.8 5-1.8 7 0Z" />
      <path d="M12 22c-1.8-2-1.8-5 0-7 1.8 2 1.8 5 0 7Z" />
      <path d="M2 12c2-1.8 5-1.8 7 0-2 1.8-5 1.8-7 0Z" />
      <path d="M19.07 4.93c.3 2.7-1.17 5.3-3.5 5.66.3-2.7 1.17-5.3 3.5-5.66Z" />
      <path d="M4.93 19.07c-.3-2.7 1.17-5.3 3.5-5.66-.3 2.7-1.17 5.3-3.5 5.66Z" />
      <path d="M19.07 19.07c-2.7.3-5.3-1.17-5.66-3.5 2.7-.3 5.3 1.17 5.66 3.5Z" />
      <path d="M4.93 4.93c2.7-.3 5.3 1.17 5.66 3.5-2.7.3-5.3-1.17-5.66-3.5Z" />
    </svg>
  );
}
