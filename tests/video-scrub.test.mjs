import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createVideoScrubber } from '../lib/video-scrub.ts';

function fixture(time = 0) {
  const writes = [];
  const media = {
    seeking: false,
    get currentTime() { return time; },
    set currentTime(value) { time = value; writes.push(value); },
  };
  return { media, writes, scrub: createVideoScrubber(media, 24, 240) };
}

test('does not repeatedly decode targets in the same source frame', () => {
  const { scrub, writes } = fixture();
  scrub.update(.1); scrub.settled(); scrub.update(.1001); scrub.update(.103);
  assert.deepEqual(writes, [24.5 / 24]);
});

test('waits for decoder, then uses newest target after a direction change', () => {
  const { scrub, writes } = fixture();
  scrub.update(.8); scrub.update(.9); scrub.update(.2);
  assert.equal(writes.length, 1);
  scrub.settled(); scrub.update(.1);
  assert.deepEqual(writes, [192.5 / 24, 24.5 / 24]);
});

test('honors external seeks and clamps both endpoints to real frames', () => {
  const { media, scrub, writes } = fixture();
  media.seeking = true; scrub.update(1); assert.equal(writes.length, 0);
  media.seeking = false; scrub.update(2); scrub.settled(); scrub.update(-1);
  assert.deepEqual(writes, [239.5 / 24, 0]);
});

test('ignores invalid progress and a stationary initial frame', () => {
  const { scrub, writes } = fixture();
  for (const p of [NaN, Infinity, -Infinity, 0]) scrub.update(p);
  assert.equal(writes.length, 0);
});

test('can revisit every frame forward and in reverse', () => {
  const { scrub, writes } = fixture();
  for (let i = 1; i < 240; i++) { scrub.update((i + .1) / 240); scrub.settled(); }
  for (let i = 238; i >= 0; i--) { scrub.update((i + .1) / 240); scrub.settled(); }
  assert.equal(writes.length, 478);
  assert.equal(writes[238], 239.5 / 24);
  assert.equal(writes.at(-1), 0);
});
