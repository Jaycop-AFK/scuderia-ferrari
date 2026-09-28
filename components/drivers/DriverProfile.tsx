"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { gsap } from "@/lib/animation";
import type { Driver } from "@/data/drivers";
import DriverPortrait from "./DriverPortrait";
import DriverCallouts from "./DriverCallouts";
import styles from "./Drivers.module.css";

type Props = {
  driver: Driver;
  index: number;
  active: boolean;
  reducedMotion: boolean;
  touchMode: boolean;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  onToggle: (id: string) => void;
};

export default function DriverProfile({ driver, index, active, reducedMotion, touchMode, onActivate, onDeactivate, onToggle }: Props) {
  const root = useRef<HTMLElement>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const activeRef = useRef(active);
  const pointerFocus = useRef(false);
  const [warm, setWarm] = useState(false);
  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setWarm(true); observer.disconnect(); }
    }, { rootMargin: "600px" });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => {
    const panel = root.current;
    if (!panel) return;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      timeline.to("[data-driver-shadow]", { opacity: .2, duration: .6 }, 0)
        .to("[data-driver-color]", { opacity: 1, clipPath: "inset(0% -100% 0% -100%)", duration: .7 }, 0)
        .to("[data-portrait-art]", { scale: 1.015, duration: .7 }, 0)
        .to("[data-driver-number]", { x: 8, opacity: .9, duration: .7 }, 0)
        .to("[data-driver-name]", { x: 6, letterSpacing: "-.06em", color: "#ffffff", duration: .5 }, 0)
        .to("[data-name-marker]", { opacity: 1, x: 0, duration: .35 }, .12);
      panel.querySelectorAll<HTMLElement>("[data-callout]").forEach((callout, i) => {
        const offset = i * .08;
        timeline.to(callout.querySelector("[data-anchor]"), { opacity: 1, duration: .12 }, offset)
          .to(callout.querySelector("[data-leader]"), { strokeDashoffset: 0, opacity: 1, duration: .34 }, offset + .1)
          .to(callout.querySelector("[data-callout-box]"), { scaleX: 1, opacity: 1, duration: .3 }, offset + .25)
          .to(callout.querySelector("[data-callout-text]"), { opacity: 1, y: 0, duration: .28 }, offset + .35);
      });
      animation.current = timeline;
      timeline.progress(activeRef.current ? 1 : 0).pause();
    }, panel);
    return () => { animation.current = null; context.revert(); };
  }, []);
  useEffect(() => {
    const timeline = animation.current;
    if (!timeline) return;
    if (reducedMotion) timeline.progress(active ? 1 : 0).pause();
    else if (active) timeline.timeScale(1).play();
    else timeline.timeScale(1.5).reverse();
  }, [active, reducedMotion]);

  const name = `${driver.firstName} ${driver.lastName}`;
  const hover = (event: PointerEvent<HTMLElement>) => {
    if (!touchMode && event.pointerType !== "touch") onActivate(driver.id);
  };
  const leave = (event: PointerEvent<HTMLElement>) => {
    const focused = document.activeElement;
    if (touchMode || (focused?.matches("[data-driver-trigger]") && root.current?.contains(focused))) return;
    const next = event.relatedTarget;
    if (next instanceof Element && next.closest("[data-driver-trigger]") && root.current?.contains(next)) return;
    onDeactivate(driver.id);
  };
  const focus = () => { if (!pointerFocus.current) onActivate(driver.id); };
  const pointerDown = (event: PointerEvent<HTMLElement>) => { pointerFocus.current = touchMode || event.pointerType === "touch"; };
  return <article ref={root} className={styles.profile} id={`driver-${driver.id}`}
    data-driver={driver.id} data-active={active} aria-labelledby={`driver-${driver.id}-name`}
    onPointerLeave={leave}
    onBlur={(event) => {
      const next = event.relatedTarget;
      const nextIsTrigger = next instanceof Element && next.matches("[data-driver-trigger]") && event.currentTarget.contains(next);
      if (!nextIsTrigger) pointerFocus.current = false;
      if (!touchMode && !nextIsTrigger) onDeactivate(driver.id);
    }}
    onKeyDown={(event) => {
      pointerFocus.current = false;
      if (event.key === "Escape") { onDeactivate(driver.id); event.stopPropagation(); }
    }}>
    <div className={styles.profileTop}>
      <span>SCUDERIA FERRARI HP <span className={styles.topDivider}>/</span> DRIVER DOSSIER</span>
      <span>{String(index + 1).padStart(2, "0")} <span className={styles.topDivider}>/ 02</span></span>
    </div>
    <div className={styles.composition}>
      <span className={styles.number} data-driver-number="" data-driver-trigger="" aria-hidden="true" onPointerEnter={hover} onPointerLeave={leave}>{driver.number}</span>
      <div className={styles.nameBlock}>
        <p className={styles.profileIndex}><span /> THE HUMAN ELEMENT / {driver.code}</p>
        <h3 id={`driver-${driver.id}-name`}>
          <button type="button" className={styles.name} data-driver-name="" data-driver-trigger=""
            onPointerEnter={hover} onPointerLeave={leave} onPointerDown={pointerDown} onFocus={focus}
            onClick={() => onToggle(driver.id)} aria-pressed={active}
            aria-describedby={`driver-${driver.id}-instruction`}>
            <span>{driver.firstName}</span><span>{driver.lastName}</span>
            <span className={styles.nameMarker} data-name-marker="" aria-hidden="true">↗</span>
          </button>
        </h3>
        <p className={styles.instruction} id={`driver-${driver.id}-instruction`}>
          <span className={styles.fineHint}>HOVER OR FOCUS TO REVEAL</span><span className={styles.touchHint}>TAP TO REVEAL · TAP AGAIN TO CLOSE</span>
        </p>
      </div>
      <button type="button" className={styles.portrait} data-driver-trigger="" onPointerEnter={hover} onPointerLeave={leave}
        onPointerDown={pointerDown} onFocus={focus} onClick={() => onToggle(driver.id)}
        aria-label={`Reveal ${name} portrait`} aria-pressed={active}>
        <DriverPortrait driver={driver} warm={warm} />
      </button>
      <DriverCallouts driver={driver} />
      <div className={styles.identity}>
        <p>{driver.team}</p><p>{driver.nationality} <span>/</span> {driver.code} <span>/</span> {driver.number}</p>
      </div>
    </div>
    <div className={styles.profileBottom}>
      <span><i /> {active ? "IDENTITY REVEALED" : "AWAITING INTERACTION"}</span>
      <a href={index === 0 ? "#driver-leclerc" : "#drivers"}>{index === 0 ? "NEXT DRIVER" : "BACK TO DRIVERS"} <span aria-hidden="true">{index === 0 ? "↓" : "↑"}</span></a>
    </div>
  </article>;
}
