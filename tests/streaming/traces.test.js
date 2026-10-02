import { expect, it } from 'vitest';
import { LiveTraceBuffer } from '../../src/visualization/live-trace-buffer.js';
import { renderTrace } from '../../src/visualization/trace-renderer.js';

it('expires samples by session time, including when no packets arrive', () => {
  const buffer = new LiveTraceBuffer(10);
  [0, 10, 70].forEach(t => buffer.push({red: t, infrared: t + 1}, t));
  expect(buffer.getWindow(70, 60).times).toEqual([10, 70]);
  expect(buffer.getWindow(131, 60).times).toEqual([]);
});

function capture() {
  const paths = []; let current;
  const ctx = {
    clearRect() {}, beginPath() {current = [];},
    moveTo(x, y) {current.push(['M', x, y]);},
    lineTo(x, y) {current.push(['L', x, y]);},
    stroke() {paths.push(current);}, fillText() {}, setLineDash() {}
  };
  return {paths, canvas: {width: 1001, height: 300, getContext: () => ctx}};
}

it('aligns irregularly spaced samples and event markers on the same time axis', () => {
  const {canvas, paths} = capture();
  renderTrace(canvas, {red: [1, 2, 3], times: [0, 1, 10]}, {startSeconds: 0, endSeconds: 10, gapSeconds: 20, markers: [{onset: 1, description: 'TASK_START'}]});
  expect(paths[0].map(p => p[1])).toEqual([0, 100, 1000]);
  expect(paths[1][0][1]).toBe(100);
});

it('breaks the trace across missing samples and long acquisition gaps', () => {
  const {canvas, paths} = capture();
  renderTrace(canvas, {red: [1, null, 2, 3], times: [0, 0.5, 1, 10]}, {startSeconds: 0, endSeconds: 10, gapSeconds: 2});
  expect(paths[0].map(p => p[0])).toEqual(['M', 'M', 'M']);
});
