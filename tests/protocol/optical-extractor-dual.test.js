// @vitest-environment node

import {
  expect,
  it
} from "vitest";

import {
  extractOpticalChannels
} from "../../src/protocol/optical-extractor.js";

it("exposes left, right and temperature from a decoded Mendi frame", () => {
  const sample =
    extractOpticalChannels({
      decoded: true,
      temperature: 30.75,
      left: {
        red: -844650,
        ir: -827746,
        ambient: -847760
      },
      right: {
        red: -1676459,
        ir: -1638218,
        ambient: -1685362
      },
      pulseReference: {
        red: 132780,
        ir: 395137,
        ambient: -5862
      }
    });

  expect(sample.temperatureC)
    .toBe(30.75);

  expect(sample.left.red)
    .toBe(-844650);

  expect(sample.right.infrared)
    .toBe(-1638218);

  expect(sample.pulseReference.ambient)
    .toBe(-5862);

});
