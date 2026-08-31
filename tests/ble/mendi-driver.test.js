import { describe, expect, it, vi } from "vitest";
import { MendiDriver } from "../../src/ble/mendi-driver.js";

describe("MendiDriver subscription lifecycle", () => {
  it("unsubscribes previously started streams when a later subscription fails", async () => {
    const driver = new MendiDriver();

    const abb1 = {
      uuid: "abb1",
      startNotifications: vi.fn().mockResolvedValue(undefined),
      stopNotifications: vi.fn().mockResolvedValue(undefined),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    };

    const abb4 = {
      uuid: "abb4",
      startNotifications: vi
        .fn()
        .mockRejectedValue(new Error("ABB4 unavailable")),
      stopNotifications: vi.fn().mockResolvedValue(undefined),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    };

    driver.characteristics = new Map([
      ["ABB1", abb1],
      ["ABB4", abb4]
    ]);

    await driver.subscribe("ABB1", vi.fn());

    await expect(
      driver.subscribe("ABB4", vi.fn())
    ).rejects.toThrow("ABB4 unavailable");

    await driver.unsubscribe("ABB1");

    expect(abb1.stopNotifications).toHaveBeenCalledTimes(1);
    expect(driver.stream.subscriptions.has(abb1)).toBe(false);
  });
});
