"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { DRIVER_LABELS, ENGINEERING_INDEX, MOTION, PERFORMANCE_METRICS, SPEED_DISPLAY, SCENE_LABELS, type SceneId } from "@/lib/constants";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import type { VideoStatus } from "@/types";
import VideoSequence from "./VideoSequence";
import ScrollDirector from "./ScrollDirector";
import SplitHeading from "@/components/typography/SplitHeading";
import TechLabel from "@/components/typography/TechLabel";
import RevealText from "@/components/typography/RevealText";
import Metric from "@/components/typography/Metric";
import Navigation from "@/components/ui/Navigation";
import CustomCursor from "@/components/ui/CustomCursor";
import Loader from "@/components/ui/Loader";
import DriversSection from "@/components/drivers/DriversSection";
import styles from "./F1Experience.module.css";

function ChapterLink({ scene, children, primary = false }: { scene: SceneId; children: ReactNode; primary?: boolean }) {
  return <a href={`#${scene}`} data-scene-link={scene} className={primary ? styles.primaryLink : styles.textLink}>{children}</a>;
}

export default function F1Experience() {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress();
  const systemReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const mobile = useMediaQuery("(max-width: 700px)");
  const [manualReduced, setManualReduced] = useState(false);
  const [activeScene, setActiveScene] = useState<SceneId>("opening");
  const [videoStatus, setVideoStatus] = useState<VideoStatus>("loading");
  const [loadProgress, setLoadProgress] = useState(0);
  const [retryKey, setRetryKey] = useState(0);
  const [skipFilm, setSkipFilm] = useState(false);
  const [showFilmNavigation, setShowFilmNavigation] = useState(true);
  const reducedMotion = systemReduced || manualReduced || skipFilm;
  useEffect(() => {
    const target = reducedMotion ? root.current : stage.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      setShowFilmNavigation(reducedMotion ? entry.isIntersecting : entry.intersectionRatio >= .5);
    }, { threshold: reducedMotion ? 0 : [0, .5, 1] });
    observer.observe(target);
    return () => observer.disconnect();
  }, [reducedMotion]);
  const panelProps = (id: SceneId) => ({
    id, "data-scene": id,
    "aria-label": SCENE_LABELS[id],
    "aria-hidden": !reducedMotion && activeScene !== id,
    inert: !reducedMotion && activeScene !== id,
    className: styles.scene,
  });
  const retry = () => { setLoadProgress(0); setVideoStatus("loading"); setRetryKey((key) => key + 1); };
  const continueWithoutFilm = () => { setSkipFilm(true); setVideoStatus("ready"); };

  return (
    <><div ref={root} className={styles.experience} data-motion={reducedMotion ? "reduced" : "cinematic"}
      data-active-scene={activeScene} style={{ "--scroll-height": `${MOTION.scrollScreens * 100}svh` } as CSSProperties}>
      <div ref={stage} className={styles.stage}>
        {!skipFilm && <VideoSequence key={retryKey} videoRef={video} progressRef={progress}
          reducedMotion={reducedMotion} onStatus={setVideoStatus} onProgress={setLoadProgress} retryKey={retryKey} />}
        {/* Phase 2 boundary: no Canvas, GLB request, fabricated model, or 3D geometry. */}
        <div className={styles.mask} aria-hidden="true" />
        <div className={styles.overlay}>
          <section {...panelProps("opening")}>
            <div className={styles.content}>
              <TechLabel className={styles.eyebrow}>FORMULA // PERFORMANCE 001</TechLabel>
              <SplitHeading as="h1" lines={["BUILT", "FOR", "SPEED."]} />
              <RevealText>A machine designed where<br />a thousandth of a second matters.</RevealText>
              <ChapterLink scene="focus">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></ChapterLink>
            </div>
            <TechLabel className={styles.sceneNote}>A STUDY IN SPEED.<br />A PURSUIT OF PRECISION.</TechLabel>
          </section>

          <section {...panelProps("focus")}>
            <div className={styles.content}>
              <TechLabel className={styles.eyebrow}>02 / THE HUMAN ELEMENT</TechLabel>
              <SplitHeading lines={["FOCUS"]} className={styles.focusTitle} />
              <RevealText className={styles.focusCopy}>PRECISION STARTS<br />BEFORE THE LIGHTS<br />GO OUT.</RevealText>
              <TechLabel className={styles.smallAnnotation}>THE QUIET BEFORE EVERYTHING.</TechLabel>
            </div>
            <dl className={styles.driverLabels}>
              {DRIVER_LABELS.map((item) => <div key={item.label} data-reveal=""><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
            </dl>
          </section>

          <section {...panelProps("speed")}>
            <div className={styles.content}>
              <TechLabel className={styles.eyebrow}>03 / COMMIT TO THE MOMENT</TechLabel>
              <div className={styles.beatStage}>
                <div data-beat="first" className={styles.beat}>
                  <SplitHeading lines={[SPEED_DISPLAY.value]} className={styles.speedNumber} />
                  <TechLabel className={styles.speedUnit}>{SPEED_DISPLAY.unit}</TechLabel>
                </div>
                <div data-beat="second" className={styles.beat}>
                  <SplitHeading lines={["ZERO", "HESITATION."]} className={styles.compactTitle} />
                </div>
              </div>
              <RevealText>There is no room for almost.<br />Only the next fraction of a second.</RevealText>
            </div>
            <TechLabel className={styles.sceneNote}>MOMENTUM IS A MINDSET.</TechLabel>
          </section>

          <section {...panelProps("machine")}>
            <div className={styles.content}>
              <TechLabel className={styles.eyebrow}>04 / THE SUM OF EVERYTHING</TechLabel>
              <div className={styles.beatStage}>
                <div data-beat="first" className={styles.beat}><SplitHeading lines={["NOT JUST", "A CAR."]} className={styles.compactTitle} /></div>
                <div data-beat="second" className={styles.beat}><SplitHeading lines={["A", "SYSTEM."]} /></div>
              </div>
              <RevealText>Aerodynamics. Energy. Temperature.<br />Data. Human instinct.</RevealText>
            </div>
            <TechLabel className={styles.sceneNote}>FIVE DISCIPLINES.<br />ONE PURPOSE.</TechLabel>
          </section>

          <section {...panelProps("engineering")} data-phase-two="engineering">
            <div className={styles.content}>
              <TechLabel className={styles.eyebrow}>05 / ENGINEERING, WITHOUT COMPROMISE</TechLabel>
              <SplitHeading lines={["EVERY", "MILLIMETER", "MATTERS."]} className={styles.engineeringTitle} />
              <ol className={styles.engineeringIndex}>
                {ENGINEERING_INDEX.map((item, index) => <li key={item} data-index-row=""><span>{String(index + 1).padStart(2, "0")}</span>{item}<span aria-hidden="true">—</span></li>)}
              </ol>
            </div>
            <TechLabel className={styles.sceneNote}>PRECISION IS NOT A DETAIL.<br />IT IS THE ENTIRE POINT.</TechLabel>
          </section>

          <section {...panelProps("assembly")} data-phase-two="assembly">
            <div className={styles.content}>
              <TechLabel className={styles.eyebrow}>06 / COMPLEXITY, IN HARMONY</TechLabel>
              <div className={styles.beatStage}>
                <div data-beat="first" className={styles.beat}><SplitHeading lines={["ONE", "MACHINE."]} className={styles.compactTitle} /></div>
                <div data-beat="second" className={styles.beat}><SplitHeading lines={["THOUSANDS", "OF DECISIONS."]} split="words" className={styles.assemblyTitle} /></div>
              </div>
              <RevealText>Every part has a purpose.<br />Together, they become something else.</RevealText>
            </div>
            <TechLabel className={styles.sceneNote}>NOTHING IN ISOLATION.<br />EVERYTHING CONNECTED.</TechLabel>
          </section>

          <section {...panelProps("performance")}>
            <div className={`${styles.content} ${styles.performanceContent}`}>
              <TechLabel className={styles.eyebrow}>07 / THE LANGUAGE OF PERFORMANCE</TechLabel>
              <SplitHeading lines={["PERFORMANCE", "BY NUMBERS."]} className={styles.performanceTitle} />
              <dl className={styles.primaryMetric}><Metric {...PERFORMANCE_METRICS[0]} primary /></dl>
              <dl className={styles.secondaryMetrics}>{PERFORMANCE_METRICS.slice(1).map((metric) => <Metric key={metric.label} {...metric} />)}</dl>
              <p className={styles.disclaimer}>Illustrative design values. Not official Ferrari specifications.</p>
            </div>
          </section>

          <section {...panelProps("final")}>
            <div className={styles.content}>
              <TechLabel className={styles.eyebrow}>08 / THE PURSUIT NEVER ENDS</TechLabel>
              <SplitHeading lines={["ENGINEERED", "BEYOND", "LIMITS."]} className={styles.finalTitle} />
              <RevealText>Speed is only the result.<br />Precision is the process.</RevealText>
              <div className={styles.finalActions}>
                <ChapterLink scene="machine" primary>EXPLORE THE MACHINE <span aria-hidden="true">↗</span></ChapterLink>
                <ChapterLink scene="engineering">VIEW ENGINEERING <span aria-hidden="true">↗</span></ChapterLink>
                <a href="#drivers" className={styles.textLink}>MEET THE DRIVERS <span aria-hidden="true">↓</span></a>
              </div>
            </div>
            <div className={styles.finalNote}><TechLabel>01 / 04 — THE MACHINE</TechLabel><p>SCUDERIA / 01</p><TechLabel>AN INDEPENDENT CREATIVE STUDY</TechLabel></div>
          </section>
        </div>
      </div>
      <div className={styles.chrome} data-visible={showFilmNavigation} inert={!showFilmNavigation} aria-hidden={!showFilmNavigation}>
        <Navigation activeScene={activeScene} reducedMotion={reducedMotion} systemReduced={systemReduced}
        onToggleMotion={() => setManualReduced((value) => !value)} />
        <CustomCursor reducedMotion={reducedMotion || mobile || !showFilmNavigation} />
      </div>
      <ScrollDirector rootRef={root} progressRef={progress} reducedMotion={reducedMotion} mobile={mobile}
        ready={videoStatus === "ready"} onScene={setActiveScene} />
      <Loader status={videoStatus} progress={loadProgress} reducedMotion={reducedMotion}
        onRetry={retry} onContinue={continueWithoutFilm} />
      <noscript><div className={styles.noScript}>JavaScript is required for the interactive film. Enable it to explore the chapters.</div></noscript>
    </div><DriversSection reducedMotion={reducedMotion} /></>
  );
}
