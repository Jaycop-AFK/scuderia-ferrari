/** Opt-in local diagnostics. No analytics, network requests or per-frame React updates. */
export function attachVideoDiagnostics(video: HTMLVideoElement) {
  if (process.env.NODE_ENV !== "development" || !new URLSearchParams(location.search).has("film-debug")) {
    return () => {};
  }
  const samples: number[] = [];
  let start = 0;
  let count = 0;
  const seeking = () => { start = performance.now(); };
  const seeked = () => {
    if (!start) return;
    samples.push(performance.now() - start);
    if (samples.length > 300) samples.shift();
    count++;
    const sorted = [...samples].sort((a, b) => a - b);
    video.dataset.seekStats = JSON.stringify({
      count,
      medianMs: Math.round(sorted[Math.floor(sorted.length / 2)]),
      p95Ms: Math.round(sorted[Math.floor((sorted.length - 1) * .95)]),
      maxMs: Math.round(sorted.at(-1)!),
      time: Number(video.currentTime.toFixed(3)),
    });
    start = 0;
  };
  video.addEventListener("seeking", seeking);
  video.addEventListener("seeked", seeked);
  return () => {
    video.removeEventListener("seeking", seeking);
    video.removeEventListener("seeked", seeked);
    delete video.dataset.seekStats;
  };
}
