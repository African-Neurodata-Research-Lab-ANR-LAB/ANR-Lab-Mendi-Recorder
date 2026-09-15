// @vitest-environment node

import {
  expect,
  it
} from "vitest";

import {
  decodeAdc
} from "../../src/protocol/adc-decoder.js";

it("decodes real ABB4 battery voltage telemetry", () => {
  const result =
    decodeAdc([8, 160, 29]);

  expect(result.decoded)
    .toBe(true);

  expect(result.voltage)
    .toBe(3744);

  expect(result.charging)
    .toBe(false);

  expect(result.usb)
    .toBe(false);
});
