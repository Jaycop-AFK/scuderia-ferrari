"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger, registerGsapPlugins, addHeadingReveal } from "@/lib/animation";
import { createSmoothScroll } from "@/lib/scroll";
import { SCENES, SCENE_IDS, MOTION, type SceneId } from "@/lib/constants";

type ScrollDirectorProps = {
  rootRef: RefObject<HTMLDivElement | null>;
  progressRef: RefObject<number>;
  reducedMotion: boolean;
  mobile: boolean;
  ready: boolean;
  onScene: (scene: SceneId) => void;
};

export default function ScrollDirector({ rootRef, progressRef, reducedMotion, mobile, ready, onScene }: ScrollDirectorProps) {
  const initialized = useRef(false);
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !ready) return;
    // A breakpoint/motion change must not pull a reader out of the Drivers section.
    const visibleDriver = initialized.current && Array.from(document.querySelectorAll<HTMLElement>("[data-driver]")).find((panel) => {
      const bounds = panel.getBoundingClientRect();
      return bounds.top <= window.innerHeight / 2 && bounds.bottom > window.innerHeight / 2;
    });
    const initialScene = (initialized.current
      ? visibleDriver ? visibleDriver.id : root.getBoundingClientRect().bottom <= 0 ? "drivers" : root.dataset.activeScene
      : window.location.hash.slice(1)) as SceneId;
    registerGsapPlugins();
    const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-scene]"));
    let current: SceneId | null = null;
    let trigger: ScrollTrigger | undefined;
    let smooth: ReturnType<typeof createSmoothScroll> | undefined;
    let intro: gsap.core.Timeline | undefined;
    let timeline: gsap.core.Timeline | undefined;
    let lastPercent = -1;
    const line = root.querySelector<HTMLElement>("[data-film-progress]");
    const percent = root.querySelector<HTMLElement>("[data-progress-number]");
    const bar = root.querySelector<HTMLElement>("[role='progressbar']");

    const updateScene = (id: SceneId) => {
      if (current === id) return;
      current = id;
      onScene(id);
    };
    const context = gsap.context(() => {
      if (reducedMotion) return;
      smooth = createSmoothScroll();
      timeline = gsap.timeline({ paused: true });
      timeline.to({ progress: 0 }, { progress: 1, duration: 1, ease: "none" }, 0);
      panels.forEach((panel, index) => {
        const id = panel.dataset.scene as SceneId;
        const [start, end] = SCENES[id];
        const span = end - start;
        if (index !== 0) {
          gsap.set(panel, { autoAlpha: 0 });
          timeline!.set(panel, { autoAlpha: 1 }, start);
          const firstBeat = panel.querySelector<HTMLElement>("[data-beat='first']") || panel;
          addHeadingReveal(timeline!, firstBeat, start, span * MOTION.sceneEntry, mobile);
          timeline!.fromTo(panel.querySelectorAll("[data-reveal], [data-index-row]"),
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: span * .2, stagger: span * .012, immediateRender: false, ease: "power2.out" },
            start + span * .04);
        }
        if (id === "opening") {
          timeline!.to(panel.querySelectorAll("[data-unit]"), {
            xPercent: (unitIndex: number) => unitIndex % 2 ? 16 : -16,
            opacity: 0, duration: span * MOTION.sceneExit, ease: "power2.inOut",
          }, end - span * MOTION.sceneExit);
        }
        if (index !== panels.length - 1) {
          timeline!.to(panel, { autoAlpha: 0, duration: span * MOTION.sceneExit, ease: "power2.inOut" }, end - span * MOTION.sceneExit);
        }
        const secondBeat = panel.querySelector<HTMLElement>("[data-beat='second']");
        const firstBeat = panel.querySelector<HTMLElement>("[data-beat='first']");
        if (secondBeat && firstBeat) {
          gsap.set(secondBeat, { autoAlpha: 0 });
          timeline!.to(firstBeat, { autoAlpha: 0, x: mobile ? 0 : -30, duration: span * .12, ease: "power2.inOut" }, start + span * MOTION.beatOut);
          timeline!.set(secondBeat, { autoAlpha: 1 }, start + span * MOTION.beatIn);
          addHeadingReveal(timeline!, secondBeat, start + span * MOTION.beatIn, span * .25, mobile);
        }
        if (id === "assembly") {
          const words = panel.querySelectorAll("[data-beat='second'] [data-unit]");
          timeline!.fromTo(words,
            { x: mobile ? 0 : 20, scaleX: 1.06, transformOrigin: "left center" },
            { x: 0, scaleX: 1, duration: span * .24, ease: "power3.out", immediateRender: false },
            start + span * .62);
        }
      });
      const opening = panels[0];
      intro = gsap.timeline();
      intro.fromTo(opening.querySelectorAll("[data-unit]"),
        { yPercent: 110 },
        { yPercent: 0, duration: .85, stagger: .07, ease: "power3.out" });

      const update = (self: ScrollTrigger) => {
        const p = self.progress;
        progressRef.current = p;
        if (p > .002 && intro?.isActive()) intro.progress(1).pause();
        timeline?.progress(p);
        const id = SCENE_IDS.find((key) => p < SCENES[key][1]) ?? "final";
        updateScene(id);
        if (line) gsap.set(line, { scaleX: p });
        const value = Math.round(p * 100);
        if (lastPercent !== value) {
          lastPercent = value;
          if (percent) percent.textContent = String(value).padStart(3, "0");
          bar?.setAttribute("aria-valuenow", String(value));
        }
      };
      trigger = ScrollTrigger.create({
        id: "f1-master",
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: update,
        onRefresh: update,
      });
      update(trigger);
    }, root);

    const focusScene = (panel: HTMLElement) => {
      panel.querySelector<HTMLElement>("h1, h2")?.focus({ preventScroll: true });
    };
    const goTo = (id: SceneId, focus = true) => {
      const panel = panels.find((item) => item.dataset.scene === id);
      if (!panel) return;
      if (reducedMotion) {
        panel.scrollIntoView({ behavior: "instant", block: "start" });
        updateScene(id);
        if (focus) focusScene(panel);
      } else if (trigger && smooth) {
        const [start, end] = SCENES[id];
        const destination = id === "opening" ? 0 : start + (end - start) * MOTION.navigationPoint;
        smooth.lenis.scrollTo(trigger.start + destination * (trigger.end - trigger.start), {
          duration: 1.25,
          onComplete: () => { if (focus) focusScene(panel); },
        });
      }
    };
    const clicked = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href^='#']");
      if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (!root.contains(link) && !link.closest("#drivers")) return;
      const id = link.hash.slice(1) as SceneId;
      if (!(id in SCENES)) {
        const target = document.getElementById(id);
        if (!target) return;
        event.preventDefault();
        window.history.replaceState(null, "", "#" + id);
        const focus = () => target.querySelector<HTMLElement>("h2, h3 button")?.focus({ preventScroll: true });
        if (smooth && !reducedMotion) smooth.lenis.scrollTo(target, { duration: 1.25, onComplete: focus });
        else { target.scrollIntoView({ behavior: "instant", block: "start" }); focus(); }
        return;
      }
      event.preventDefault();
      window.history.replaceState(null, "", "#" + id);
      goTo(id);
    };
    const hashChanged = () => {
      const id = window.location.hash.slice(1) as SceneId;
      if (id in SCENES) goTo(id, false);
      else {
        const target = document.getElementById(id);
        if (target?.closest("#drivers")) {
          if (smooth) smooth.lenis.scrollTo(target, { duration: 1.25 });
          else target.scrollIntoView({ behavior: "instant" });
        }
      }
    };
    document.addEventListener("click", clicked);
    window.addEventListener("hashchange", hashChanged);
    const refreshFrame = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (initialScene in SCENES) goTo(initialScene, false);
      else {
        const target = document.getElementById(initialScene);
        if (target?.closest("#drivers")) {
          if (smooth) smooth.lenis.scrollTo(target, { immediate: true });
          else target.scrollIntoView({ behavior: "instant" });
        }
      }
      initialized.current = true;
    });
    let readingObserver: IntersectionObserver | undefined;
    if (reducedMotion) {
      readingObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) if (entry.isIntersecting) updateScene((entry.target as HTMLElement).dataset.scene as SceneId);
      }, { rootMargin: "-25% 0px -45% 0px" });
      panels.forEach((panel) => readingObserver!.observe(panel));
    }
    return () => {
      document.removeEventListener("click", clicked);
      window.removeEventListener("hashchange", hashChanged);
      window.cancelAnimationFrame(refreshFrame);
      readingObserver?.disconnect();
      trigger?.kill();
      intro?.kill();
      timeline?.kill();
      smooth?.destroy();
      context.revert();
    };
  }, [rootRef, progressRef, reducedMotion, mobile, ready, onScene]);
  return null;
}
