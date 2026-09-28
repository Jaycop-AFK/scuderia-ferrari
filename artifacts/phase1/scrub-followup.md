# Video scrub investigation — 2026-08-28

## Finding and scope

Read the supplied MP4's ISO BMFF sample tables without modifying either video.
Video timescale 12288; 240 samples × 512 ticks => 24 fps / 10 seconds.
Sync samples: 1, 36, 71. Last keyframe is approximately 2.917 seconds;
the final GOP spans approximately 7.083 seconds. Audio extends total duration
to 10.005 seconds. This is poorly suited to frequent random-access seeking.

The old code also applied 120 ms video smoothing after Lenis scroll smoothing,
then sought up to 24/30 times per second even if the target remained in the same
source frame. Typography animated letter spacing and blur during scroll.

## Changes

- Frame-aware scheduler: skip duplicate source frames, wait for seek completion,
  then use newest progress. No second easing layer or fixed 24/30 Hz seek timer.
- Clamp to actual video frames rather than the longer audio/container endpoint.
- Use transforms for typography movement/compression, no animated letter spacing
  or blur on scroll. Semantic content, scene ranges and reduced motion retained.
- Optional development-only `?film-debug=1` seek-event diagnostics.
- Added five scheduler unit tests and asset preparation documentation.
- No source video edits, conversion, generated footage or Phase 2 work.

## Browser observations

In-app Chromium, development server, current viewport width 618 px. Chapter 1
to chapter 8 link navigation, then real downward and upward scroll/navigation.

| Navigation sample | Completed seeks | Median event latency | P95 | Maximum |
| --- | ---: | ---: | ---: | ---: |
| Original scheduler, opening to final chapter | 7 | 73 ms | 271 ms | 690 ms |
| Revised scheduler, opening to final chapter | 5 | 204 ms | 245 ms | 1053 ms |

These are single diagnostic runs with different target frames and cache state,
**not a controlled benchmark or evidence of an overall speedup**. Event latency
is not displayed FPS or end-to-end latency. The new scheduler avoids duplicate
requests, but significant decoder stalls remain; the stutter is NOT fully fixed.

Verified after change:

- Asset HTTP 200, `video/mp4`.
- Final scroll 100% reaches 9.979166 seconds, inside video frame 239, paused.
- Full reverse reaches 0%, currentTime 0.
- Reduced motion exposes all eight sections and retains time 0 after scrolling.
- No horizontal overflow at current viewport. One development Fast Refresh warning
  was captured when the effect dependency list changed during editing; a full
  reload is required after this change. No other warning/error was captured.
- `npm test`: 5/5 pass (Node reports a non-failing module-type warning).
- `npm run lint`, `npm run typecheck`, `npm run build`: pass.
- Both MP4 SHA256 values unchanged:
  `87c32c428b138f38313431ce99fce5fbbe44954682243611da583ba3d5f49194`.
- `public/models/f1-car.glb` still absent. No Three.js Canvas introduced.

No physical mobile test or full new responsive sweep was performed in this
follow-up; see original QA for earlier responsive coverage.

## Requires user approval/input

Recommend a separate all-intra H.264 scrub asset preserving 1280×720 / 24 fps,
starting at CRF 18 / yuv420p / faststart / no audio. Compare size and quality and
repeat forward/reverse tests before adopting it. Do not overwrite either MP4.
No derivative has been created and the asset constant has not changed.

Driver scope (Ferrari or full grid) and actual portrait assets are unconfirmed.
Official Ferrari driver names/numbers/countries were verified; no driver UI or
unlicensed/placeholder portrait added. See `docs/ASSET_PREPARATION.md`.
