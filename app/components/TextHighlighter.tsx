"use client";

import { useEffect, useMemo, useRef, useState, type ElementType } from "react";
import { cn } from "@/lib/utils";

interface TextHighlighterProps {
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
  highlightColor?: string;
  direction?: "ltr" | "rtl";
  duration?: number;
  delay?: number;
}

export function TextHighlighter({
  children,
  as: Tag = "span",
  className,
  highlightColor = "linear-gradient(135deg, #d5d1ad, #b8b48a)",
  direction = "ltr",
  duration = 0.8,
  delay = 0.2,
}: TextHighlighterProps) {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const bgSize = isInView ? "100% 100%" : "0% 100%";
  const bgPos = useMemo(
    () => (direction === "ltr" ? "0% 0%" : "100% 0%"),
    [direction]
  );

  return (
    <Tag ref={ref}>
      <span
        className={cn("inline rounded-md px-1.5 py-0.5", className)}
        style={{
          backgroundImage: highlightColor,
          backgroundSize: bgSize,
          backgroundPosition: bgPos,
          backgroundRepeat: "no-repeat",
          transition: `background-size ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
        }}
      >
        {children}
      </span>
    </Tag>
  );
}
