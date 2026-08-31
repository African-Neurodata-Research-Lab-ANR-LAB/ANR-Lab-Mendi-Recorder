import { describe, expect, it, vi } from "vitest";
import {
  startAcquisition,
  stopAcquisition
} from "../../src/app/acquisition.js";

describe("acquisition restart safety", () => {
  it("allows a new acquisition after the previous one is stopped", async () => {
    const driver = {
      subscribe: vi.fn().mockResolvedValue(undefined),
      unsubscribe: vi.fn().mockResolvedValue(undefined)
    };

    await startAcquisition(driver, vi.fn());
    await stopAcquisition(driver);
    await startAcquisition(driver, vi.fn());

    expect(driver.subscribe).toHaveBeenCalledTimes(6);
    expect(driver.unsubscribe).toHaveBeenCalledTimes(3);
  });
});
