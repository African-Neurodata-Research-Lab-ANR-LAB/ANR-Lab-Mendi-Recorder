// @vitest-environment node

import {
  expect,
  it,
  vi
} from "vitest";

import {
  startAcquisition,
  stopAcquisition
} from "../../src/app/acquisition.js";

it("falls back to read-only ABB1 polling when frame notifications stall", async () => {
  let now = 0;
  let pollTick = null;

  const onPacket = vi.fn();

  const driver = {
    subscribe:
      vi.fn().mockResolvedValue(
        undefined
      ),
    unsubscribe:
      vi.fn().mockResolvedValue(
        undefined
      ),
    enableSensor:
      vi.fn().mockResolvedValue(
        true
      ),
    readFrame:
      vi.fn().mockResolvedValue({
        timestampMs: 1500,
        receivedAtMs: 1500,
        characteristicUuid:
          "fc3eabb1-c6c4-49e6-922a-6e551c455af5",
        bytes:
          Uint8Array.from([8, 1]),
        transport: "poll"
      })
  };

  await startAcquisition(
    driver,
    onPacket,
    {
      nowFn: () => now,
      frameStallAfterMs: 1000,
      framePollIntervalMs: 500,
      setIntervalFn(callback) {
        pollTick = callback;
        return 77;
      },
      clearIntervalFn:
        vi.fn()
    }
  );

  expect(driver.readFrame)
    .not.toHaveBeenCalled();

  now = 1500;
  await pollTick();

  expect(driver.readFrame)
    .toHaveBeenCalledOnce();

  expect(onPacket)
    .toHaveBeenCalledWith(
      expect.objectContaining({
        transport: "poll"
      })
    );

  await stopAcquisition(driver);
});
