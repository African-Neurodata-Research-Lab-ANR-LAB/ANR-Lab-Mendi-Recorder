import { describe, expect, it, vi } from "vitest";
import { startAcquisition } from "../../src/app/acquisition.js";

describe("acquisition subscription lifecycle", () => {
  it("rolls back earlier subscriptions when a later stream fails", async () => {
    const driver = {
      subscribe: vi.fn()
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error("ABB4 unavailable")),
      unsubscribe: vi.fn().mockResolvedValue(undefined)
    };

    const onPacket = vi.fn();

    await expect(
      startAcquisition(driver, onPacket)
    ).rejects.toThrow("ABB4 unavailable");

    expect(driver.subscribe).toHaveBeenNthCalledWith(
      1,
      "ABB1",
      onPacket
    );

    expect(driver.subscribe).toHaveBeenNthCalledWith(
      2,
      "ABB4",
      onPacket
    );

    expect(driver.unsubscribe).toHaveBeenCalledTimes(1);
    expect(driver.unsubscribe).toHaveBeenCalledWith("ABB1");
  });
});
