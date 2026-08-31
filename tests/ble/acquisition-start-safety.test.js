import { describe, expect, it, vi } from "vitest";
import {
  startAcquisition
} from "../../src/app/acquisition.js";

describe("acquisition start safety", () => {
  it("does not subscribe twice for the same active driver", async () => {
    const driver = {
      subscribe: vi.fn().mockResolvedValue(undefined),
      unsubscribe: vi.fn().mockResolvedValue(undefined)
    };

    await startAcquisition(driver, vi.fn());
    await startAcquisition(driver, vi.fn());

    expect(driver.subscribe).toHaveBeenCalledTimes(3);
  });
});
