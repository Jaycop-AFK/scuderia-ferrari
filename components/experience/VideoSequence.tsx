"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/animation";
import { F1_VIDEO_PATH, F1_VIDEO_TIMING, MOTION } from "@/lib/constants";
import { attachVideoDiagnostics } from "@/lib/video-diagnostics";
import { createVideoScrubber } from "@/lib/video-scrub";
import type { VideoStatus } from "@/types";
import styles from "./F1Experience.module.css";

type VideoSequenceProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  progressRef: RefObject<number>;
  reducedMotion: boolean;
  onStatus: (status: VideoStatus) => void;
  onProgress: (progress: number) => void;
  retryKey: number;
};

export default function VideoSequence({
  videoRef, progressRef, reducedMotion, onStatus, onProgress, retryKey,
}: VideoSequenceProps) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let ready = false;
    let visible = true;
    let lastProgress = -1;
    let timedOut = false;
    const scrubber = createVideoScrubber(video, F1_VIDEO_TIMING.fps, F1_VIDEO_TIMING.frameCount);
    video.muted = true;
    video.pause();
    const stopDiagnostics = attachVideoDiagnostics(video);

    const reportProgress = (value: number) => {
      const percent = Math.round(value);
      if (percent !== lastProgress) { lastProgress = percent; onProgress(percent); }
    };
    const metadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) reportProgress(Math.max(lastProgress, 25));
    };
    const buffered = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0 || !video.buffered.length) return;
      reportProgress(Math.max(lastProgress, 25 + Math.min(video.buffered.end(video.buffered.length - 1) / video.duration, 1) * 65));
    };
    const canBegin = () => {
      metadata();
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !Number.isFinite(video.duration)) return;
      ready = true;
      window.clearTimeout(timeout);
      if (!timedOut) { reportProgress(100); onStatus("ready"); }
      video.pause();
      if (reducedMotion && video.currentTime !== 0) video.currentTime = 0;
    };
    const fail = () => { window.clearTimeout(timeout); onStatus("error"); };
    const timeout = window.setTimeout(() => {
      if (!ready) { timedOut = true; onStatus("error"); }
    }, MOTION.loadTimeoutMs);
    const tick = () => {
      if (!ready || !visible || document.hidden || reducedMotion || video.error) return;
      // Lenis already smooths the shared progress. A second playhead easing adds lag.
      // Read the newest target on the next tick; never queue stale intermediate seeks.
      scrubber.update(progressRef.current);
    };
    const pauseWhenHidden = () => { if (document.hidden) video.pause(); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && video.preload !== "auto") video.preload = "auto";
      if (!visible) video.pause();
    }, { threshold: 0.01 });

    video.addEventListener("loadedmetadata", metadata);
    video.addEventListener("durationchange", metadata);
    video.addEventListener("loadeddata", canBegin);
    video.addEventListener("canplay", canBegin);
    video.addEventListener("progress", buffered);
    video.addEventListener("error", fail);
    video.addEventListener("seeked", scrubber.settled);
    document.addEventListener("visibilitychange", pauseWhenHidden);
    observer.observe(video);
    if (!reducedMotion) gsap.ticker.add(tick);
    if (retryKey > 0) video.load();
    else if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) canBegin();

    return () => {
      stopDiagnostics();
      window.clearTimeout(timeout);
      observer.disconnect();
      gsap.ticker.remove(tick);
      document.removeEventListener("visibilitychange", pauseWhenHidden);
      video.removeEventListener("loadedmetadata", metadata);
      video.removeEventListener("durationchange", metadata);
      video.removeEventListener("loadeddata", canBegin);
      video.removeEventListener("canplay", canBegin);
      video.removeEventListener("progress", buffered);
      video.removeEventListener("error", fail);
      video.removeEventListener("seeked", scrubber.settled);
      video.pause();
    };
  }, [videoRef, progressRef, reducedMotion, onStatus, onProgress, retryKey]);

  return <video ref={videoRef} className={styles.video} src={F1_VIDEO_PATH}
    muted playsInline preload="metadata" aria-hidden="true" tabIndex={-1}
    disablePictureInPicture controlsList="nodownload nofullscreen noremoteplayback" />;
}
