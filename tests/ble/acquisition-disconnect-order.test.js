import { describe, expect, it, vi } from "vitest";
import {
  startAcquisition,
  handleAcquisitionDisconnect
} from "../../src/app/acquisition.js";

describe("acquisition disconnect recovery", () => {
  it("cleans up streams before notifying the controller", async () => {
    const driver = {
      subscribe: vi.fn().mockResolvedValue(undefined),
      unsubscribe: vi.fn().mockResolvedValue(undefined)
    };

    const calls = [];

    const onDisconnected = vi.fn(() => {
      calls.push("controller");
    });

    driver.unsubscribe.mockImplementation(async (key) => {
      calls.push(`unsubscribe:${key}`);
    });

    await startAcquisition(driver, vi.fn());

    await handleAcquisitionDisconnect(driver, {
      onDisconnected
    });

    expect(calls).toEqual([
      "unsubscribe:ABB5",
      "unsubscribe:ABB4",
      "unsubscribe:ABB1",
      "controller"
    ]);
  });
});
