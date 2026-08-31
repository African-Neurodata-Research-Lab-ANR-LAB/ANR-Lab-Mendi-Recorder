import { describe, expect, it, vi } from "vitest";
import { SampleClock } from "../../src/recording/sample-clock.js";

describe("SampleClock", () => {
  it("starts from a monotonic origin", () => {
    const clock = new SampleClock();

    let performanceNow = 1000;

    vi.spyOn(globalThis, "performance", "get").mockReturnValue({
      now: () => performanceNow
    });

    clock.start();

    performanceNow = 1250;

    expect(clock.nowSeconds()).toBeCloseTo(0.25, 6);
  });

  it("provides wall-clock timestamps separately", () => {
    const clock = new SampleClock();

    expect(typeof clock.wallNowMs()).toBe("number");
  });
});
