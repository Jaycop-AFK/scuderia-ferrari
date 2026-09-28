"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let pluginsRegistered = false;
export function registerGsapPlugins(): void {
  if (typeof window === "undefined" || pluginsRegistered) return;
  gsap.registerPlugin(useGSAP, ScrollTrigger);
  pluginsRegistered = true;
}

/** The director owns every heading's reveal, so all units reverse with its playhead. */
export function addHeadingReveal(
  timeline: gsap.core.Timeline,
  scope: HTMLElement,
  start: number,
  duration: number,
  simple: boolean,
) {
  scope.querySelectorAll<HTMLElement>("[data-split]").forEach((heading) => {
    const units = heading.querySelectorAll<HTMLElement>("[data-unit]");
    const stagger = Math.min(Number(heading.dataset.stagger) || 0.035, duration * 0.35 / Math.max(units.length, 1));
    timeline.fromTo(units,
      { yPercent: simple ? 100 : 112 },
      { yPercent: 0,
        duration: duration * 0.65, stagger, ease: "power3.out", immediateRender: false },
      start,
    );
  });
}
export { gsap, ScrollTrigger, useGSAP };
