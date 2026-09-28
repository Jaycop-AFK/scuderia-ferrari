"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animation";
import type { VideoStatus } from "@/types";
import styles from "./Loader.module.css";

type LoaderProps = {
  status: VideoStatus;
  progress: number;
  reducedMotion: boolean;
  onRetry: () => void;
  onContinue: () => void;
};
export default function Loader({ status, progress, reducedMotion, onRetry, onContinue }: LoaderProps) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tween = gsap.to(root.current, {
      autoAlpha: status === "ready" ? 0 : 1,
      yPercent: status === "ready" && !reducedMotion ? -4 : 0,
      duration: reducedMotion ? 0 : .55,
      ease: "power3.inOut",
    });
    return () => { tween.kill(); };
  }, [status, reducedMotion]);

  return (
    <div ref={root} className={styles.loader} inert={status === "ready"} aria-hidden={status === "ready"}>
      <div className={styles.inner}>
        <span className={styles.number} aria-hidden="true">01</span>
        <p className="tech-label" role="status">{status === "error" ? "THE FILM COULDN’T LOAD" : "INITIALIZING MACHINE"}</p>
        <div className={styles.track}><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
        <div className={styles.progress}><span>00</span><span>{String(progress).padStart(2, "0")}</span></div>
        {status === "error" && (
          <div className={styles.actions}>
            <p>The connection may be slow, or this browser may not support the video.</p>
            <button onClick={onRetry}>RETRY FILM ↗</button>
            <button onClick={onContinue}>READ THE STORY →</button>
          </div>
        )}
      </div>
      <span className={styles.signature}>SCUDERIA / 01 &nbsp; — &nbsp; A STUDY IN SPEED</span>
    </div>
  );
}
