import { describe, expect, it, vi } from "vitest";
import {
  startAcquisition,
  handleAcquisitionDisconnect
} from "../../src/app/acquisition.js";

describe("acquisition disconnect recovery", () => {
  it("stops active streams and notifies the controller after an unexpected disconnect", async () => {
    const driver = {
      subscribe: vi.fn().mockResolvedValue(undefined),
      unsubscribe: vi.fn().mockResolvedValue(undefined)
    };

    const onPacket = vi.fn();
    const onDisconnected = vi.fn();

    await startAcquisition(driver, onPacket);

    await handleAcquisitionDisconnect(driver, {
      onDisconnected
    });

    expect(driver.unsubscribe).toHaveBeenCalledTimes(3);
    expect(driver.unsubscribe).toHaveBeenNthCalledWith(1, "ABB5");
    expect(driver.unsubscribe).toHaveBeenNthCalledWith(2, "ABB4");
    expect(driver.unsubscribe).toHaveBeenNthCalledWith(3, "ABB1");

    expect(onDisconnected).toHaveBeenCalledTimes(1);
  });
});
