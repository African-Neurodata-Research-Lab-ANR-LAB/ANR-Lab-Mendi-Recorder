import { FrameValidator } from '../src/qc/frame-validator.js';
import { StreamQualityEngine } from '../src/qc/stream-quality-engine.js';

function createFrame(value) {
  return new Uint8Array([value, value + 1, value + 2]);
}

export function testFrameValidator() {
  const validator = new FrameValidator();

  const first = validator.validate(createFrame(10));
  const second = validator.validate(createFrame(10));
  const third = validator.validate(createFrame(20));

  console.assert(first.fresh === true);
  console.assert(second.duplicate === true);
  console.assert(third.fresh === true);
}

export function testStreamQualityEngine() {
  const engine = new StreamQualityEngine();

  engine.process(
    {
      fresh: true,
      duplicate: false
    },
    Date.now()
  );

  const report = engine.getReport();

  console.assert(report.framesAnalyzed === 1);
  console.assert(report.freshness === 100);
}

export function runAcquisitionTests() {
  testFrameValidator();
  testStreamQualityEngine();

  return {
    success: true,
    message: 'Acquisition pipeline tests passed'
  };
}
