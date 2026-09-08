import { describe, expect, it } from "vitest";
import { LiveTraceBuffer } from "../../src/visualization/live-trace-buffer.js";

describe("controller trace buffer integration", () => {

  it("stores optical samples in renderer-compatible form", () => {

    const buffer = new LiveTraceBuffer(5);

    buffer.push({
      red: 1000,
      infrared: 2000
    });

    expect(buffer.get()).toEqual({
      red: [1000],
      infrared: [2000]
    });

  });

});
