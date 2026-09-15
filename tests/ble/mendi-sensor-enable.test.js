// @vitest-environment node

import {
  expect,
  it,
  vi
} from "vitest";

import {
  MendiDriver
} from "../../src/ble/mendi-driver.js";

it("enables continuous Mendi optical streaming through ABB2", async () => {
  const writeValueWithResponse =
    vi.fn()
      .mockResolvedValue(undefined);

  const driver =
    new MendiDriver();

  driver.characteristics =
    new Map([
      [
        "ABB2",
        { writeValueWithResponse }
      ]
    ]);

  await driver.enableSensor();

  expect(writeValueWithResponse)
    .toHaveBeenCalledOnce();

  const payload =
    writeValueWithResponse
      .mock.calls[0][0];

  expect(Array.from(payload))
    .toEqual([8, 1]);
});
