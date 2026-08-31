import { describe, expect, it, vi } from "vitest";
import {
  startAcquisition
} from "../../src/app/acquisition.js";

describe("acquisition failure recovery", () => {
  it("allows retry after a failed acquisition start", async () => {
    const driver = {
      subscribe: vi.fn()
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error("ABB4 unavailable"))
        .mockResolvedValue(undefined),
      unsubscribe: vi.fn().mockResolvedValue(undefined)
    };

    await expect(
      startAcquisition(driver, vi.fn())
    ).rejects.toThrow("ABB4 unavailable");

    await startAcquisition(driver, vi.fn());

    expect(driver.subscribe).toHaveBeenCalledTimes(5);
  });
});
