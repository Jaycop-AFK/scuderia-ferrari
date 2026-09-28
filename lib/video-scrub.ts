type ScrubMedia = { currentTime: number; seeking: boolean };

/** One request per source frame. Drop obsolete targets while the decoder is busy. */
export function createVideoScrubber(media: ScrubMedia, fps: number, frameCount: number) {
  let requestedFrame = Math.max(0, Math.min(frameCount - 1, Math.floor(media.currentTime * fps)));
  let pending = false;
  return {
    update(progress: number) {
      if (!Number.isFinite(progress) || pending || media.seeking) return;
      const frame = Math.max(0, Math.min(frameCount - 1, Math.floor(progress * frameCount)));
      if (frame === requestedFrame) return;
      // Seek inside the frame, not at its floating-point timestamp boundary.
      media.currentTime = frame === 0 ? 0 : (frame + .5) / fps;
      requestedFrame = frame;
      pending = true;
    },
    settled() { pending = false; },
  };
}
