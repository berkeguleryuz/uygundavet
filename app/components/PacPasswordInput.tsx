"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import styles from "./pac-password.module.css";

interface PacPasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}

const GHOST_COLORS: Record<string, string> = {
  orange: "hsl(48, 100%, 50%)",
  green: "hsl(181, 100%, 57%)",
  pink: "hsl(332, 98%, 81%)",
  red: "hsl(12, 100%, 47%)",
};
const GHOST_KEYS = Object.keys(GHOST_COLORS);
const INPUT_BG = "rgba(255,255,255,0.05)";
const REVEAL_BG = "rgba(0,0,0,0.6)";

export function PacPasswordInput({
  value,
  onChange,
  placeholder,
  required,
  minLength,
}: PacPasswordInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pacRef = useRef<HTMLButtonElement>(null);
  const ghostRef = useRef<HTMLButtonElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);
  const cloakRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);

  /* ghost eye blink loop */
  useEffect(() => {
    const eyes = eyesRef.current;
    if (!eyes) return;
    const ctx = gsap.context(() => {
      const blink = () => {
        gsap.timeline().to(eyes, {
          delay: gsap.utils.random(2, 6),
          onComplete: blink,
          scaleY: 0.1,
          repeat: 3,
          yoyo: true,
          duration: 0.05,
        });
      };
      blink();
    });
    return () => ctx.revert();
  }, []);

  /* pac-man eats dots → reveal password */
  const showPassword = useCallback(() => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const input = inputRef.current!;
    const pac = pacRef.current!;
    const ghost = ghostRef.current!;
    const cloak = cloakRef.current!;
    const color =
      GHOST_COLORS[GHOST_KEYS[Math.floor(Math.random() * GHOST_KEYS.length)]];

    gsap
      .timeline({ onComplete: () => (animatingRef.current = false) })
      /* 1 – darken env */
      .to(input, {
        duration: 0.15,
        letterSpacing: "8px",
        backgroundColor: REVEAL_BG,
        onStart: () => gsap.set(ghost, { backgroundColor: color }),
      })
      .to(cloak, { duration: 0.15, backgroundColor: REVEAL_BG }, 0)
      /* 2 – pac chomps across */
      .to(pac, {
        duration: 0.8,
        right: "105%",
        ease: "none",
        onStart: () => pac.classList.add(styles.pacChomping),
        onComplete: () => {
          pac.classList.remove(styles.pacChomping);
          input.type = "text";
        },
      })
      .to(cloak, { duration: 0.8, left: -5, ease: "none" }, "<")
      /* 3 – ghost enters */
      .to(ghost, { duration: 0.8, right: 10, ease: "none" })
      .to(cloak, { duration: 0.8, left: "100%", ease: "none" }, "<")
      /* 4 – restore env */
      .to(input, {
        duration: 0.15,
        letterSpacing: "1px",
        backgroundColor: INPUT_BG,
      })
      .to(cloak, { duration: 0.15, backgroundColor: INPUT_BG }, "<");
  }, []);

  /* ghost sweeps → hide password */
  const hidePassword = useCallback(() => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const input = inputRef.current!;
    const pac = pacRef.current!;
    const ghost = ghostRef.current!;
    const cloak = cloakRef.current!;

    gsap
      .timeline({ onComplete: () => (animatingRef.current = false) })
      /* 1 – ghost + cloak sweep left */
      .to(ghost, {
        duration: 0.5,
        right: "105%",
        ease: "none",
        onStart: () => gsap.set(ghost, { backgroundColor: INPUT_BG }),
      })
      .to(
        cloak,
        {
          duration: 0.5,
          left: -5,
          ease: "none",
          onComplete: () => {
            gsap.set(pac, { right: 10, scale: 0 });
            input.type = "password";
          },
        },
        0,
      )
      /* 2 – cloak fades, pac pops back */
      .to(cloak, {
        duration: 0.15,
        opacity: 0,
        onComplete: () => gsap.set(cloak, { left: "100%", opacity: 1 }),
      })
      .to(pac, { duration: 0.15, scale: 1 }, 0.5);
  }, []);

  return (
    <div className={styles.container}>
      <input
        ref={inputRef}
        type="password"
        required={required}
        minLength={minLength}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-full w-full rounded-xl border-0 px-4 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-hidden font-sans"
        style={{ backgroundColor: INPUT_BG, letterSpacing: "1px" }}
      />
      <button
        ref={pacRef}
        type="button"
        onClick={showPassword}
        className={styles.pac}
        aria-label="Show password"
      />
      <button
        ref={ghostRef}
        type="button"
        onClick={hidePassword}
        className={styles.ghost}
        aria-label="Hide password"
      >
        <div ref={eyesRef} className={styles.ghostEyes} />
      </button>
      <div
        ref={cloakRef}
        className={styles.cloak}
        style={{ backgroundColor: INPUT_BG }}
      />
    </div>
  );
}
