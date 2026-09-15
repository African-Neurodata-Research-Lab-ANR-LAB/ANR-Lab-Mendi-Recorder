// @vitest-environment node

import {
  expect,
  it,
  vi
} from "vitest";

import {
  startAcquisition
} from "../../src/app/acquisition.js";

it("subscribes before enabling the continuous optical sensor", async () => {
  const calls = [];

  const driver = {
    subscribe: vi.fn(
      async key => {
        calls.push(`subscribe:${key}`);
      }
    ),
    unsubscribe: vi.fn(),
    enableSensor: vi.fn(
      async () => {
        calls.push("enableSensor");
      }
    )
  };

  await startAcquisition(
    driver,
    vi.fn()
  );

  expect(calls)
    .toEqual([
      "subscribe:ABB1",
      "subscribe:ABB4",
      "subscribe:ABB5",
      "enableSensor"
    ]);
});
