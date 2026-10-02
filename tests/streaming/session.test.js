import { expect, it } from 'vitest';
import { LiveSession } from '../../src/streaming/live-session.js';
import { Session } from '../../src/recording/session.js';
import { estimateHbPreview } from '../../src/processing/fnirs-hb-preview.js';
import { HbLiveStream } from '../../src/processing/hb-live-stream.js';

it('preserves delayed marker onset and sends each event once', () => {
  const sent = []; let ready = false;
  const bridge = {begin() {}, end() {}, send(m) { if (!ready) return false; sent.push(m); return true; }};
  const clock = {performanceStartMs: 1000, start() {}, nowSeconds: () => 5};
  const session = new Session({clock}); session.start({});
  session.addMarkerAt({onset: 2, description: 'TASK_START'});
  const live = new LiveSession({bridge}); live.begin(session);
  live.flushMarkers(); expect(sent).toHaveLength(0);
  ready = true; live.flushMarkers(); live.flushMarkers();
  expect(sent.map(m => m.timestamp_ms)).toEqual([1000, 3000]);
  expect(sent[1].event.description).toBe('TASK_START');
  live.observe({left: {red: 1, infrared: 2}, right: null}, {}, 6000, 'poll');
  expect(sent.at(-1)).toMatchObject({type: 'sample', timestamp_ms: 6000, optical: [1, 2, null, null], imu: [null, null, null, null, null, null], poll: true, sequence: 1});
  session.stop(); live.end();
  expect(sent.at(-1).event.description).toBe('STOP_RECORDING');
});

it('keeps unvalidated Hb preview unavailable', () => {
  expect(estimateHbPreview({red: 90, infrared: 190, baseline: {red: 100, infrared: 200}})).toMatchObject({hbo: null, hbr: null, status: 'UNVALIDATED'});
  const stream = new HbLiveStream({});
  expect(() => stream.start()).toThrow(/validat/i);
});
