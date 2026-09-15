// @vitest-environment node

import {
  expect,
  it
} from "vitest";

import {
  decodeFrame
} from "../../src/protocol/frame-decoder.js";

it("decodes the real Mendi ABB1 frame captured from hardware", () => {
  const bytes = [
    8,30,16,229,116,24,138,252,255,255,255,255,255,255,255,1,
    32,255,8,40,192,235,255,255,255,255,255,255,255,1,
    48,128,241,255,255,255,255,255,255,255,1,
    61,0,128,210,65,
    64,180,251,5,
    72,245,200,2,
    80,131,134,1,
    88,193,228,2,
    96,200,153,1,
    104,186,51,
    112,183,243,16,
    120,134,224,5,
    128,1,212,24
  ];

  const frame =
    decodeFrame(bytes);

  expect(frame.decoded)
    .toBe(true);

  expect(frame.temperature)
    .toBeCloseTo(26.3125);

  expect(frame.left)
    .toEqual({
      ir: 97716,
      red: 42101,
      ambient: 17155
    });

  expect(frame.right)
    .toEqual({
      ir: 45633,
      red: 19656,
      ambient: 6586
    });

  expect(frame.pulseReference)
    .toEqual({
      ir: 276919,
      red: 94214,
      ambient: 3156
    });
});
