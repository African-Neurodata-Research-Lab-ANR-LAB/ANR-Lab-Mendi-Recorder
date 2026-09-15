
// @vitest-environment node

import {
  expect,
  it,
  vi
} from "vitest";

import * as acquisition
  from "../../src/app/acquisition.js";

it("reconnects the Mendi and restarts acquisition subscriptions", async () => {
  const driver = {
    reconnect:
      vi.fn()
        .mockResolvedValue({}),

    subscribe:
      vi.fn()
        .mockResolvedValue(undefined),

    unsubscribe:
      vi.fn()
        .mockResolvedValue(undefined)
  };

  const onPacket = vi.fn();

  const recover =
    acquisition.reconnectAcquisition;

  expect(
    typeof recover
  ).toBe("function");

  await recover?.(
    driver,
    onPacket
  );

  expect(
    driver.reconnect
  ).toHaveBeenCalledOnce();

  expect(
    driver.subscribe
  ).toHaveBeenCalledTimes(3);
});
