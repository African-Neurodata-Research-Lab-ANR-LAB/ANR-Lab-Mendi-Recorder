import { describe, expect, it } from "vitest";
import { extractOpticalSample } from "../../src/protocol/optical-extractor.js";

describe("optical acquisition pipeline", () => {

  it("creates trace-ready optical samples", () => {

    const frame = {
      decoded: true,
      left: {
        red: 1200,
        ir: 2400
      }
    };

    const sample = extractOpticalSample(frame);

    expect(sample).toEqual({
      red: 1200,
      infrared: 2400
    });

  });

});