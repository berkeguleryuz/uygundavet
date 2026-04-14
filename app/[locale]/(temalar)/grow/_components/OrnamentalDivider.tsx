export function OrnamentalDivider({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className || ""}`}>
      <div className="h-px w-10 bg-[#d5d1ad]/30" />
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="text-[#d5d1ad]"
      >
        <path
          d="M10 4C10 4 8 2 6 2C4 2 2 4 2 6C2 10 10 14 10 14C10 14 18 10 18 6C18 4 16 2 14 2C12 2 10 4 10 4Z"
          fill="currentColor"
          fillOpacity="0.6"
        />
      </svg>
      <div className="h-px w-10 bg-[#d5d1ad]/30" />
    </div>
  );
}
