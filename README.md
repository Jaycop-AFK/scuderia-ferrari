# SCUDERIA / 01 — Phase 1 + Drivers

An independent cinematic Formula 1 study built with Next.js 16, React 19,
TypeScript, and Tailwind CSS. The page is one 650svh scroll journey around a
sticky 100svh film stage, followed by two interactive Ferrari driver profiles.

**Phase 1 only.** No Three.js vehicle, geometry, exploded-view implementation,
model download, or WebGL canvas is mounted. The supplied footage itself includes
an exploded-car sequence; that is part of the original video, not a 3D scene
created by this project.

## Run locally

Use Node.js 24 and npm, or a version supported by `engines.node`.

1. Install dependencies: `npm install`.
2. Start development: `npm run dev`.
3. Open [localhost:3000](http://localhost:3000).
4. Keep the cinematic video at `public/videos/ferrari-f1-hero.mp4`.
5. A future optional model belongs at `public/models/f1-car.glb`. It is not
   required or requested by Phase 1.

The approved video was copied from
`public/videos/Ferrari_F1_website_hero_animation_202608272320.mp4`.
The original remains untouched. Both files have SHA256:
`87c32c428b138f38313431ce99fce5fbbe44954682243611da583ba3d5f49194`.

The current MP4 is 1280×720, 10.005 seconds, and 3,682,468 bytes. Its browser URL
is `/videos/ferrari-f1-hero.mp4`. No alternative footage, transcoding, or
compression has been applied.

## Using the experience

Scroll down or up to direct the film. The bottom chapter rail, main navigation,
menu, and final CTAs all move to real chapters. The menu has keyboard focus
containment, Escape dismissal, and focus restoration. Chapter navigation focuses
the destination heading without an additional scroll jump.

**Motion on/off** toggles an accessible reading mode. System
`prefers-reduced-motion` takes priority: video scrubbing, Lenis, large reveals,
and the custom cursor are disabled. All eight chapters and both text beats become
readable in ordinary document flow over a stable paused frame.

The loader follows actual media readiness, not an artificial countdown. A media
error or 15-second readiness timeout offers retry or a text-only reading path.

## Timeline

All ranges and display values live in `lib/constants.ts`.

| Chapter | Normalized progress |
| --- | --- |
| Opening / built for speed | 0.00–0.15 |
| Driver / focus | 0.15–0.28 |
| Speed / zero hesitation | 0.28–0.42 |
| Machine / a system | 0.42–0.52 |
| Engineering | 0.52–0.68 |
| Assembly concept | 0.68–0.82 |
| Performance metrics | 0.82–0.92 |
| Final hero | 0.92–1.00 |

The metric values are presentation placeholders. The performance scene explicitly
states that they are **not official Ferrari specifications**. No affiliation with
Ferrari or Formula 1 is implied.

## Ferrari Drivers

Open `/#drivers`, or use **MEET THE DRIVERS** after the final film chapter.
Lewis Hamilton and Charles Leclerc each have a separate editorial panel.
Hover the name, number, or portrait to reveal the supplied color image over its
shadow. Focusing the name/portrait also reveals it; Escape dismisses it. On touch
screens, tap the name or portrait to toggle. Only one driver is active at a time.

The four desktop SVG callouts draw in sequence and reverse on exit. Tablet shows
three; mobile replaces leader lines with three always-visible information rows.
The existing motion preference also makes driver reveals instantaneous. Profiles
use ordinary document scrolling; no extra pinned stage or second Lenis instance.

Edit names, numbers, team, nationality, image paths and source framing in
`data/drivers.ts`. No championship statistics are included. The four supplied PNGs
remain unchanged; layered Next.js Images normalize their different transparent
padding in CSS. Because the supplied shadow and color outlines differ, they are
aligned by head/base and center, rather than treated as pixel-identical cutouts.
Keep image usage rights/credits with the project before publication.

## How the motion works

- `ScrollDirector.tsx` owns the single `f1-master` ScrollTrigger and the
  paused, normalized GSAP timeline. Every reveal, exit, and intermediate beat is
  tied to its playhead and reverses when scrolling upward.
- Native CSS sticky provides the stage. No pin spacer or scroll-jacking.
- A single Lenis instance uses GSAP's RAF ticker and notifies ScrollTrigger.
  Touch scrolling retains native momentum.
- The director writes progress to a ref. `VideoSequence.tsx` computes
  progress to one of the original video's 240 frames (24 fps) on the shared
  GSAP ticker. Lenis provides the only scroll easing; video does not lag behind
  a second easing layer. The scheduler skips duplicate frame requests, allows
  one outstanding seek, and reads the newest target after the decoder settles.
- Video duration is guarded until metadata is available; loaded metadata,
  duration changes, decoded data, canplay, errors, and retries are handled.
  End-time is clamped to a decodable frame before the exact duration.
- Normal video playback stays paused. Seeking stops when the document is hidden
  or the video is offscreen. There are no per-wheel time assignments and no
  per-frame React state updates.
- React updates only for discrete states such as active chapter, media
  readiness, menu state, and accessibility preferences.
- Every effect removes its ticker callbacks, observers, listeners, GSAP
  context, timeline, and Lenis instance on cleanup.

The Lenis integration follows its
[GSAP integration guidance](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger).
GSAP's [React lifecycle guidance](https://gsap.com/resources/React/) informs
registration and cleanup.

## Responsive design

Desktop uses fullscreen cover footage with asymmetric editorial text.
Tablet reduces secondary labels and scales the type. Portrait mobile retains the
fullscreen stage but fits the original landscape film in the lower part of the
screen, preserving the vehicle instead of aggressively cropping it. Mobile uses
simpler reveals, source-frame-aware seeking, and no custom cursor. The full chapter menu
is available at every size.

A small decorative cursor follows fine pointers only; the native cursor remains
available. Framer Motion is limited to the menu button's tap feedback.

## Files and responsibilities

- `app/`: server page/layout, self-hosted Inter Tight and Geist Mono via
  `next/font`, metadata, base styles, tokens and shared typography.
- `components/experience/F1Experience.tsx`: semantic scenes and state boundaries.
- `VideoSequence.tsx`: local media loading, frame scheduling and visibility.
- `ScrollDirector.tsx`: master choreography and navigation.
- `F1Experience.module.css`: stage, scene composition and responsive layouts.
- `components/typography/`: reusable masked headings, reveal text, labels, metrics.
- `components/ui/`: navigation/dialog, cursor and loader; module-scoped styles.
- `components/drivers/`: profiles, layered portraits, SVG callouts and intro.
- `data/drivers.ts`: editable driver identity, asset paths and framing metadata.
- `hooks/`: hydration-safe media queries and ref-based progress.
- `lib/`: browser-only GSAP setup, Lenis lifecycle, shared configuration.
- `types/`: video state and future `F1ModelProps`.
- `artifacts/phase1/`: browser QA evidence and screenshots.
- `artifacts/drivers/`: driver interaction QA and responsive screenshots.

The alias `@/*` resolves from the project root. Asset URLs are centralized in
`lib/constants.ts` (film/model) and `data/drivers.ts` (portraits). Videos are
intentionally not ignored by Git.

## Dependencies

Active: Next.js, React, TypeScript, Tailwind/PostCSS, GSAP/ScrollTrigger,
`@gsap/react` registration, Lenis, Framer Motion micro-interaction.

Reserved for the explicitly deferred Phase 2: Three.js, React Three Fiber,
`@react-three/drei`, and Three.js types. They are installed, but not imported into
the Phase 1 page or used to render geometry.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

ESLint remains on v9 because Next's bundled React/accessibility plugins do not
currently support v10; npm may report its deprecation. There are no forced peer
dependency overrides.

See `artifacts/phase1/QA.md` for browser checks and their scope. Testing in a
desktop browser at mobile viewport sizes is not a substitute for testing actual
iOS Safari or low-powered Android hardware.

## Video scrub performance — 2026-08-28

The supplied video has 240 samples at 24 fps, but only three sync samples:
1, 36 and 71 (approximately 0, 1.458 and 2.917 seconds). The long final GOP
remains expensive to seek. Code changes remove redundant seeks and layout-heavy
letter-spacing/blur animation; they cannot turn this asset into an all-intra video.
Neither MP4 has been modified. Source FPS/frame count are recorded in
`F1_VIDEO_TIMING`; update them if a different video is supplied.

For local diagnostics only, open `/?film-debug=1`. The video's `data-seek-stats`
attribute reports seek event latency, not display FPS or end-to-end frame latency.
The collector is inactive in production. Browser QA is in
`artifacts/phase1/scrub-followup.md`.

Recommended next asset step, **only with explicit approval**: make a separate
scrub copy from the original, keep 1280×720 / 24 fps, H.264, `yuv420p`, CRF 18,
all-intra (`-g 1 -keyint_min 1 -sc_threshold 0 -bf 0`), faststart, no audio.
Compare quality, file size and forward/reverse seek timings before switching the
central asset constant. This is a proposal, not a generated file or completed fix.

For model and portrait preparation, see [the asset checklist](docs/ASSET_PREPARATION.md).

## Phase 2 — not started

Local GLB assets are now supplied, but no model is loaded by the page. The future
3D components remain inactive, and `F1ModelProps` reserves overall, explosion,
and assembly progress values. Adding Drivers does not authorize Phase 2.

Only after explicit approval and a real model are available: lazy-load the real
Canvas with SSR disabled; use DPR [1, 1.75], camera [4, 1.8, 7] and FOV 32; then
implement video-to-3D handoff, engineering labels, an exploded view, assembly,
camera choreography and physically plausible lighting. No part of that phase
should be inferred from the video or fabricated with primitives.
