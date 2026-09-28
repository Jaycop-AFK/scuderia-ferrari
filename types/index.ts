import type { SceneId } from "@/lib/constants";

export type ScrollProgress = number;
export type VideoStatus = "loading" | "ready" | "error";
export type SceneNavigation = (scene: SceneId) => void;

/** Reserved for Phase 2. No WebGL vehicle is mounted in Phase 1. */
export type F1ModelProps = {
  progress: number;
  explosionProgress: number;
  assemblyProgress: number;
};
