import { describe, expect, it, vi } from "vitest";
import { startAcquisition, stopAcquisition } from "../../src/app/acquisition.js";

describe("acquisition start lifecycle contract", () => {
  it("returns false for a duplicate start without changing the active acquisition", async () => {
    const driver = {
      subscribe: vi.fn().mockResolvedValue(undefined),
      unsubscribe: vi.fn().mockResolvedValue(undefined)
    };

    const firstStart = await startAcquisition(driver, vi.fn());
    const secondStart = await startAcquisition(driver, vi.fn());

    expect(firstStart).toBe(true);
    expect(secondStart).toBe(false);
    expect(driver.subscribe).toHaveBeenCalledTimes(3);

    await stopAcquisition(driver);

    expect(driver.unsubscribe).toHaveBeenCalledTimes(3);
  });
});
