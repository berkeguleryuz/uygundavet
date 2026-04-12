import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("relative shrink-0 flex items-center justify-center", className)}>
      <Image
        src="/logo-gold-transparent.png"
        alt="Davetiye Logo"
        fill
        sizes="88px"
        className="object-contain"
        priority
      />
    </div>
  );
}
