import { describe, expect, test } from 'vitest';
import { FrameValidator } from '../src/qc/frame-validator.js';
import { StreamQualityEngine } from '../src/qc/stream-quality-engine.js';

function createFrame(value) {
  return new Uint8Array([value, value + 1, value + 2]);
}

describe('Acquisition pipeline components', () => {
  test('validates fresh and duplicate frames', () => {
    const validator = new FrameValidator();

    const first = validator.validate(createFrame(10));
    const second = validator.validate(createFrame(10));
    const third = validator.validate(createFrame(20));

    expect(first.fresh).toBe(true);
    expect(second.duplicate).toBe(true);
    expect(third.fresh).toBe(true);
  });

  test('tracks stream quality metrics', () => {
    const engine = new StreamQualityEngine();

    engine.process(
      {
        fresh: true,
        duplicate: false
      },
      Date.now()
    );

    const report = engine.getReport();

    expect(report.framesAnalyzed).toBe(1);
    expect(report.freshness).toBe(100);
  });
});
