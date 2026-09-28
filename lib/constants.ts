export const F1_VIDEO_PATH = "/videos/ferrari-f1-hero.mp4";
export const F1_MODEL_PATH = "/models/f1-car.glb";
// Measured from this MP4's video track (audio extends container duration to 10.005s).
// Re-measure if the source video is replaced; do not infer video FPS from display Hz.
export const F1_VIDEO_TIMING = { fps: 24, frameCount: 240 } as const;

export const SCENES = {
  opening: [0, 0.15],
  focus: [0.15, 0.28],
  speed: [0.28, 0.42],
  machine: [0.42, 0.52],
  engineering: [0.52, 0.68],
  assembly: [0.68, 0.82],
  performance: [0.82, 0.92],
  final: [0.92, 1],
} as const;

export type SceneId = keyof typeof SCENES;
export const SCENE_LABELS: Record<SceneId, string> = {
  opening: "Pure intent",
  focus: "The driver",
  speed: "No hesitation",
  machine: "The machine",
  engineering: "Engineering",
  assembly: "One machine",
  performance: "Performance",
  final: "Beyond limits",
};
export const SCENE_IDS = Object.keys(SCENES) as SceneId[];
export const ENGINEERING_INDEX = ["Aerodynamics", "Power unit", "Suspension", "Braking", "Control"] as const;

// Illustrative presentation data, never official Ferrari technical claims.
export const PERFORMANCE_METRICS = [
  { value: "1.6", unit: "SEC", label: "0—100 KM/H" },
  { value: "350+", unit: "KM/H", label: "TOP SPEED" },
  { value: "15,000+", unit: "", label: "AERO ITERATIONS" },
  { value: "50", unit: "MS", label: "SYSTEM RESPONSE" },
] as const;
export const DRIVER_LABELS = [
  { label: "REACTION", value: "00.18 S" },
  { label: "VISOR", value: "LOCKED" },
  { label: "SYSTEM", value: "READY" },
] as const;
export const SPEED_DISPLAY = { value: "300", unit: "KM/H" } as const;
export const MOTION = {
  scrollScreens: 6.5,
  loadTimeoutMs: 15000,
  sceneEntry: 0.18,
  sceneExit: 0.18,
  beatOut: 0.4,
  beatIn: 0.46,
  navigationPoint: 0.25,
} as const;
