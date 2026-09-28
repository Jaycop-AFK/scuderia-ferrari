"use client";

import { useEffect, useRef, useState } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { SCENE_IDS, SCENE_LABELS, SCENES, type SceneId } from "@/lib/constants";
import styles from "./Navigation.module.css";

type NavigationProps = {
  activeScene: SceneId;
  reducedMotion: boolean;
  systemReduced: boolean;
  onToggleMotion: () => void;
};
export default function Navigation({ activeScene, reducedMotion, systemReduced, onToggleMotion }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const dialog = menu.current;
    if (!dialog) return;
    if (menuOpen && !dialog.open) dialog.showModal();
    if (!menuOpen && dialog.open) dialog.close();
  }, [menuOpen]);
  const close = () => { menu.current?.close(); setMenuOpen(false); toggle.current?.focus(); };
  const chapter = SCENE_IDS.indexOf(activeScene) + 1;
  return (
    <LazyMotion features={domAnimation} strict>
      <a href="#opening" data-scene-link="opening" className={styles.skip}>Skip to experience</a>
      <header className={styles.header}>
        <a className={styles.wordmark} href="#opening" data-scene-link="opening" aria-label="Scuderia 01 — return to opening">
          <span className={styles.mark} aria-hidden="true">/</span> SCUDERIA <span className={styles.edition}>/ 01</span>
        </a>
        <nav className={styles.links} aria-label="Main navigation">
          {(["engineering", "performance", "machine"] as const).map((id) => (
            <a key={id} href={`#${id}`} data-scene-link={id} aria-current={activeScene === id ? "location" : undefined}>{id.toUpperCase()}</a>
          ))}
          <a href="#drivers">DRIVERS</a>
        </nav>
        <div className={styles.right}>
          <span className={styles.online}><i /> RACE SYSTEM ONLINE</span>
          <m.button ref={toggle} className={styles.menuToggle} aria-expanded={menuOpen} aria-controls="chapter-menu"
            onClick={() => setMenuOpen(true)} whileTap={reducedMotion ? undefined : { scale: .96 }}>
            MENU <span aria-hidden="true">+</span>
          </m.button>
        </div>
      </header>
      <dialog id="chapter-menu" ref={menu} className={styles.dialog} data-lenis-prevent=""
        aria-labelledby="menu-heading"
        onCancel={(event) => { event.preventDefault(); close(); }}
        onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); close(); } }}
        onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
        <div className={styles.menuPanel}>
          <div className={styles.menuTop}><h2 id="menu-heading">THE INDEX</h2><button onClick={close} aria-label="Close menu">CLOSE ×</button></div>
          <nav aria-label="All chapters" className={styles.chapterLinks}>
            {SCENE_IDS.map((id, index) => (
              <a key={id} href={`#${id}`} data-scene-link={id} onClick={close} aria-current={activeScene === id ? "location" : undefined}>
                <span>{String(index + 1).padStart(2, "0")}</span>{SCENE_LABELS[id]}<span aria-hidden="true">↗</span>
              </a>
            ))}
            <a href="#drivers" onClick={close}><span>09</span>The drivers<span aria-hidden="true">↗</span></a>
          </nav>
          <p className={styles.menuFoot}>An independent study of the Formula 1 machine.<br />Not affiliated with Ferrari or Formula 1.</p>
        </div>
      </dialog>
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <p><span className={styles.chapterNumber}>{String(chapter).padStart(2, "0")} <span>/ 08</span></span><span>{SCENE_LABELS[activeScene].toUpperCase()}</span></p>
          <div className={styles.footerRight}>
            <span className={styles.scrollLabel}>{reducedMotion ? "READ AT YOUR OWN PACE" : "SCROLL TO DISCOVER ↓"}</span>
            <button onClick={onToggleMotion} className={styles.motionToggle} disabled={systemReduced}
              aria-pressed={reducedMotion} aria-label={systemReduced ? "Reduced motion enabled by your system" : reducedMotion ? "Enable cinematic motion" : "Reduce motion"}>
              <i className={reducedMotion ? styles.motionOff : styles.motionOn} /> {reducedMotion ? "MOTION OFF" : "MOTION ON"}
            </button>
          </div>
        </div>
        {!reducedMotion && <div className={styles.rail}>
          <div className={styles.railBase} role="progressbar" aria-label="Film progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
            <span data-film-progress="" />
          </div>
          <nav aria-label="Film chapters" className={styles.railLinks}>
            {SCENE_IDS.map((id, index) => (
              <a key={id} href={`#${id}`} data-scene-link={id} aria-label={`Chapter ${index + 1}: ${SCENE_LABELS[id]}`}
                aria-current={activeScene === id ? "location" : undefined}
                style={{ width: `${(SCENES[id][1] - SCENES[id][0]) * 100}%` }}>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </a>
            ))}
          </nav>
          <span className={styles.percent} aria-hidden="true"><span data-progress-number="">000</span>%</span>
        </div>}
      </footer>
    </LazyMotion>
  );
}
