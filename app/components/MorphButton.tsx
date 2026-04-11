"use client";

import { motion, useAnimation, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

const PATH_FLAT = "M 0 100 V 100 Q 50 100 100 100 V 100 z";
const PATH_CURVE = "M 0 100 V 50 Q 50 0 100 50 V 100 z";
const PATH_FULL = "M 0 100 V 0 Q 50 0 100 0 V 100 z";

interface MorphButtonProps extends HTMLMotionProps<"button"> {
  variant?: "filled" | "outline";
}

export function MorphButton({
  children,
  className,
  variant = "filled",
  ...props
}: MorphButtonProps) {
  const pathControls = useAnimation();
  const textControls = useAnimation();

  const fillColor = variant === "filled" ? "#252224" : "#f5f6f3";

  const handleEnter = async () => {
    textControls.start({ color: variant === "filled" ? "#f5f6f3" : "#252224", scale: 1.02, transition: { duration: 0.4, ease: "easeInOut" } });
    await pathControls.start({ d: PATH_CURVE, transition: { duration: 0.2, ease: "easeIn" } });
    await pathControls.start({ d: PATH_FULL, transition: { duration: 0.2, ease: "easeOut" } });
  };

  const handleLeave = async () => {
    textControls.start({ color: variant === "filled" ? "#252224" : "#f5f6f3", scale: 1, transition: { duration: 0.4, ease: "easeInOut" } });
    await pathControls.start({ d: PATH_CURVE, transition: { duration: 0.2, ease: "easeIn" } });
    await pathControls.start({ d: PATH_FLAT, transition: { duration: 0.2, ease: "easeOut" } });
  };

  return (
    <motion.button
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-full px-10 py-4 font-chakra font-semibold uppercase tracking-wider",
        variant === "filled"
          ? "bg-foreground text-background"
          : "liquid-glass text-foreground border border-foreground/20",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 pointer-events-none">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <motion.path
            d={PATH_FLAT}
            fill={fillColor}
            animate={pathControls}
          />
        </svg>
      </div>

      <motion.span
        className="relative z-10 block"
        animate={textControls}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}
