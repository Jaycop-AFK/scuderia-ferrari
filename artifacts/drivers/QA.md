# Ferrari Drivers QA — 2026-08-28

## Scope

Two driver panels appended after the unchanged 650svh cinematic stage. Only the
four supplied local PNGs are used. No image replacement, source image edits,
video conversion, GLB modification, Canvas, or Phase 2 choreography was added.

## Checks

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: existing five video-scrub scheduler tests passed. These are not
  driver interaction tests. Node reports the pre-existing module-type warning.
- `npm run build`: passed, static `/` and `/_not-found` generated.
- HEAD requests for all four `/images/drivers/*.png` assets returned 200/image/png.
- All four optimized images decoded in the browser; no browser errors observed.
  Next dev emitted an LCP/eager-loading advisory on a direct driver hash load.

## Browser interaction checks

In-app Chromium at 1440×900, 768×1024, 390×844 and 360×640:

- Default shadow opacity 1, color 0, closed vertical mask.
- Hover name, background number and portrait: active driver reveals; at 150ms the
  color/mask were intermediate, then reached opacity 1 with shadow opacity .2.
- Four desktop SVG lines draw and reverse. Tablet displays three callouts.
- Moving off triggers returns the portrait to its silhouette.
- Focus delivered through driver navigation/name control reveals the same image.
  Escape reverses it. Native Tab traversal could not be reliably delivered by
  this browser automation; verify physical keyboard traversal manually.
- Only one driver activates at a time; Next Driver moves to Charles and focuses
  his name. Return-to-film restores the original film navigation.
- Mobile name tap opens/closes; switching from name to portrait toggles correctly.
  This caught and fixed an ordering conflict between pointerdown, blur and focus.
- Three mobile identity rows remain visible even when the portrait is closed.
- Existing Motion Off switches the driver state immediately; final state was
  sampled after 50ms. System reduced motion uses the same application flag, but
  a separate OS-level preference change was not exercised in this run.
- No horizontal document overflow at the tested sizes.
- Mobile profile navigation via actual links positioned the target at 0.125px
  from the viewport top. Film chrome is hidden outside the film stage.
- Tablet inspection caught a horizontal mask crop; the vertical reveal now allows
  the image's natural width. Team callout was moved clear of the helmet.

`measurements.json` contains the sampled states. Screenshots capture desktop
silhouette/reveal, Charles, tablet and mobile/facts views. Some earlier samples
use the previous equivalent vertical mask; final samples include the corrected
horizontal mask bounds.

## Boundaries

This is desktop browser viewport testing, not a physical iOS/Android performance
or assistive-technology audit. No measured FPS claim is made. Existing video GOP
seek limitations remain unchanged. Shadow/color source outlines differ; CSS
normalizes their padding/center and head/base, but they are not identical cutouts.
Image publication rights and credits still require owner confirmation.
