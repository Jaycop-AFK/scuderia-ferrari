"use client";

import { useEffect, useRef, useState } from "react";
import { drivers } from "@/data/drivers";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { gsap, registerGsapPlugins } from "@/lib/animation";
import DriverProfile from "./DriverProfile";
import styles from "./Drivers.module.css";

export default function DriversSection({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [activeDriver, setActiveDriver] = useState<string | null>(null);
  const touchMode = useMediaQuery("(hover: none), (pointer: coarse), (max-width: 700px)");
  useEffect(() => {
    if (reducedMotion || !root.current) return;
    registerGsapPlugins();
    const context = gsap.context(() => {
      gsap.fromTo("[data-drivers-entrance]", { y: 42, opacity: .1 }, {
        y: 0, opacity: 1, stagger: .09, ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 22%", scrub: .3 },
      });
    }, root);
    return () => context.revert();
  }, [reducedMotion]);

  return <section ref={root} className={styles.section} id="drivers" aria-labelledby="drivers-heading" data-reduced-motion={reducedMotion}>
    <div className={styles.intro}>
      <div className={styles.introTop}><span>BEYOND THE MACHINE</span><a href="#opening">RETURN TO THE FILM ↗</a></div>
      <p data-drivers-entrance="" className={styles.kicker}><i /> THE HUMAN ELEMENT</p>
      <div className={styles.introHeadline} data-drivers-entrance="">
        <h2 id="drivers-heading" tabIndex={-1}>DRIVERS<span>.</span></h2><span className={styles.driverCount}>[ 02 ]</span>
      </div>
      <div className={styles.introBottom} data-drivers-entrance="">
        <p>Behind the machine.<br /><span>The people who make it matter.</span></p>
        <nav aria-label="Ferrari drivers">{drivers.map((driver) => <a key={driver.id} href={`#driver-${driver.id}`}><span>{driver.number}</span> {driver.firstName} {driver.lastName} ↗</a>)}</nav>
      </div>
    </div>
    {drivers.map((driver, index) => <DriverProfile key={driver.id} driver={driver} index={index}
      active={activeDriver === driver.id} reducedMotion={reducedMotion} touchMode={touchMode}
      onActivate={setActiveDriver}
      onDeactivate={(id) => setActiveDriver((current) => current === id ? null : current)}
      onToggle={(id) => setActiveDriver((current) => current === id ? null : id)} />)}
    <footer className={styles.endNote}><span>SCUDERIA / 01</span><p>AN INDEPENDENT CREATIVE STUDY<br />NOT AFFILIATED WITH FERRARI OR FORMULA 1.</p><a href="#opening">BACK TO THE START ↑</a></footer>
  </section>;
}
