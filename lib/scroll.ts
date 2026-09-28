"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/animation";
export type { LenisOptions } from "lenis";

/** One Lenis instance, one shared GSAP RAF clock. Native touch momentum is retained. */
export function createSmoothScroll() {
  const lenis = new Lenis({
    autoRaf: false,
    lerp: 0.085,
    smoothWheel: true,
    syncTouch: false,
    anchors: false,
  });
  const update = () => ScrollTrigger.update();
  const tick = (time: number) => lenis.raf(time * 1000);
  lenis.on("scroll", update);
  gsap.ticker.lagSmoothing(0);
  gsap.ticker.add(tick);
  return {
    lenis,
    destroy() {
      gsap.ticker.remove(tick);
      lenis.off("scroll", update);
      lenis.destroy();
    },
  };
}
