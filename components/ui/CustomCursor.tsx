"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animation";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function CustomCursor({ reducedMotion }: { reducedMotion: boolean }) {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const cursor = useRef<HTMLDivElement>(null);
  const enabled = finePointer && !reducedMotion;
  useEffect(() => {
    if (!enabled || !cursor.current) return;
    const dot = cursor.current;
    const x = gsap.quickTo(dot, "x", { duration: .22, ease: "power3.out" });
    const y = gsap.quickTo(dot, "y", { duration: .22, ease: "power3.out" });
    const move = (event: PointerEvent) => {
      x(event.clientX); y(event.clientY);
      const hover = (event.target as Element).closest("a, button");
      gsap.to(dot, { opacity: .85, scale: hover ? 3 : 1, duration: .2, overwrite: "auto", ease: "power2.out" });
    };
    const leave = () => gsap.set(dot, { opacity: 0 });
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      x.tween.kill(); y.tween.kill(); gsap.killTweensOf(dot);
    };
  }, [enabled]);
  // The native cursor stays available; this is only a decorative fine-pointer accent.
  return enabled ? <div ref={cursor} aria-hidden="true" className="pointer-events-none fixed -left-[3px] -top-[3px] z-[60] h-[6px] w-[6px] rounded-full bg-white opacity-0 mix-blend-difference" /> : null;
}
