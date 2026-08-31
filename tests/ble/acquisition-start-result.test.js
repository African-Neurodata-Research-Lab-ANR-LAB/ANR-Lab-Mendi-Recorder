import { describe, expect, it, vi } from "vitest";
import { startAcquisition } from "../../src/app/acquisition.js";

describe("acquisition start result", () => {
  it("reports when an acquisition is already active", async () => {
    const driver = {
      subscribe: vi.fn().mockResolvedValue(undefined),
      unsubscribe: vi.fn().mockResolvedValue(undefined)
    };

    const first = await startAcquisition(driver, vi.fn());
    const second = await startAcquisition(driver, vi.fn());

    expect(first).toBe(true);
    expect(second).toBe(false);
  });
});
