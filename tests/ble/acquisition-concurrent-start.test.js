import { describe, expect, it, vi } from "vitest";
import { startAcquisition } from "../../src/app/acquisition.js";

describe("acquisition concurrent start safety", () => {
  it("allows only one concurrent acquisition start for the same driver", async () => {
    let releaseFirstSubscribe;

    const firstSubscribe = new Promise((resolve) => {
      releaseFirstSubscribe = resolve;
    });

    const driver = {
      subscribe: vi.fn()
        .mockImplementationOnce(() => firstSubscribe)
        .mockResolvedValue(undefined),
      unsubscribe: vi.fn().mockResolvedValue(undefined)
    };

    const firstStart = startAcquisition(driver, vi.fn());
    const secondStart = startAcquisition(driver, vi.fn());

    releaseFirstSubscribe();

    const [first, second] = await Promise.all([firstStart, secondStart]);

    expect(first).toBe(true);
    expect(second).toBe(false);
    expect(driver.subscribe).toHaveBeenCalledTimes(3);
  });
});
